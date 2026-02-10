require('dotenv').config({ path: '../.env' })
const { PrismaClient } = require('@prisma/client')
const XLSX = require('xlsx')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Atualizando telefones das unidades...\n')

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
  let semTelefone = 0

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const nomePrincipal = row.Nome_principal?.trim()

    if (!nomePrincipal) continue

    // Buscar telefone da linha (pode estar em diferentes colunas)
    const telefone = row.Número_principal?.trim() ||
                     row.Telefone_principal?.trim() ||
                     row.Telefone?.trim() ||
                     null

    // Se não tiver telefone, pular
    if (!telefone || telefone === '-' || telefone === 'N/A') {
      semTelefone++
      continue
    }

    console.log(`\n[Linha ${i + 2}] ${nomePrincipal}`)
    console.log(`   📞 Telefone: ${telefone}`)

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
      // Atualizar com SQL
      await prisma.$executeRawUnsafe(`
        UPDATE prod_unidade_turistica
        SET
          telefone = '${telefone}',
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
  console.log(`⏭️  Unidades sem telefone: ${semTelefone}`)
  console.log(`❌ Unidades não encontradas: ${naoEncontradas}`)
  console.log('='.repeat(70))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
