require('dotenv').config({ path: '../.env' })
const { PrismaClient } = require('@prisma/client')
const XLSX = require('xlsx')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Reimportando TODOS os contatos (WhatsApp, E-mail, Telefone)...\n')

  // Ler planilha
  const wb = XLSX.readFile('../mapeamento_unidades_assistencia_social_ok.xlsx')
  const ws = wb.Sheets['Mapa_Assistencia_Social']
  const data = XLSX.utils.sheet_to_json(ws, {
    defval: null,
    blankrows: true
  })

  console.log('📊 Total de linhas na planilha:', data.length)

  let atualizadas = 0
  let naoEncontradas = 0
  let semContatos = 0

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const nomePrincipal = row.Nome_principal?.trim()

    if (!nomePrincipal) continue

    // Buscar TODOS os contatos da linha (nomes corretos das colunas)
    const email = row.Email_principal?.trim() || null
    const telefone = row.Telefone_principal?.trim() || null
    const whatsapp = row.Whatsapp_principal?.trim() || null // "a" minúsculo!

    // Se não tiver nenhum contato, pular
    if (!email && !telefone && !whatsapp) {
      semContatos++
      continue
    }

    console.log(`\n[Linha ${i + 2}] ${nomePrincipal}`)
    if (telefone && telefone !== '-') console.log(`   📞 Telefone: ${telefone}`)
    if (whatsapp && whatsapp !== '-') console.log(`   💬 WhatsApp: ${whatsapp}`)
    if (email && email !== '-') console.log(`   📧 E-mail: ${email}`)

    // Buscar unidade no banco
    const unidade = await prisma.pROD_UnidadeTuristica.findFirst({
      where: {
        nome: {
          contains: nomePrincipal
        }
      }
    })

    if (!unidade) {
      console.log(`   ❌ Unidade não encontrada no banco`)
      naoEncontradas++
      continue
    }

    try {
      // Preparar valores para SQL (escape de aspas)
      const emailValue = email && email !== '-' ? `'${email.replace(/'/g, "''")}'` : 'NULL'
      const telefoneValue = telefone && telefone !== '-' ? `'${telefone.replace(/'/g, "''")}'` : 'NULL'
      const whatsappValue = whatsapp && whatsapp !== '-' ? `'${whatsapp.replace(/'/g, "''")}'` : 'NULL'

      // Atualizar com SQL
      await prisma.$executeRawUnsafe(`
        UPDATE prod_unidade_turistica
        SET
          telefone = ${telefoneValue},
          whatsapp = ${whatsappValue},
          email = ${emailValue},
          updated_at = NOW()
        WHERE id = ${unidade.id}
      `)

      console.log(`   ✅ Unidade atualizada (ID: ${unidade.id})`)
      atualizadas++

    } catch (error) {
      console.error(`   ❌ Erro ao atualizar:`, error.message)
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log('📊 RESUMO DA ATUALIZAÇÃO')
  console.log('='.repeat(70))
  console.log(`✅ Unidades atualizadas: ${atualizadas}`)
  console.log(`⏭️  Unidades sem contatos: ${semContatos}`)
  console.log(`❌ Unidades não encontradas: ${naoEncontradas}`)
  console.log('='.repeat(70))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
