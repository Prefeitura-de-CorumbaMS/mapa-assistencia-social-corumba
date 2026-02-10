require('dotenv').config({ path: '../.env' })
const { PrismaClient } = require('@prisma/client')
const XLSX = require('xlsx')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando importação de setores específicos...\n')

  // Ler planilha
  const wb = XLSX.readFile('../mapeamento_unidades_assistencia_social_ok.xlsx')
  const ws = wb.Sheets['Mapa_Assistencia_Social']
  const data = XLSX.utils.sheet_to_json(ws)

  // Filtrar apenas as unidades solicitadas
  const unidadesParaImportar = [
    'Casa dos Conselhos',
    'Secretaria Municipal de Assistência Social e Cidadania',
    'CASA DA CIDADANIA'
  ]

  const dadosSetores = data.filter(row => {
    const nome = (row.Nome_principal || '').trim()
    return unidadesParaImportar.some(u => nome.includes(u))
  })

  console.log(`📊 Encontrados ${dadosSetores.length} registros com setores na planilha\n`)

  let setoresCriados = 0
  let erros = 0

  for (const registro of dadosSetores) {
    const nomePrincipal = (registro.Nome_principal || '').trim()
    const nomeSetor = registro.Setor

    if (!nomeSetor) {
      console.log(`⚠️  Sem setor para: ${nomePrincipal}`)
      continue
    }

    try {
      // Buscar unidade no banco pelo nome
      const unidade = await prisma.pROD_UnidadeTuristica.findFirst({
        where: {
          nome: {
            contains: nomePrincipal.includes('Secretaria') ? 'Secretaria Municipal' :
                     nomePrincipal.includes('CIDADANIA') ? 'CASA DA CIDADANIA' :
                     'Casa dos Conselhos'
          }
        }
      })

      if (!unidade) {
        console.log(`❌ Unidade não encontrada no banco: ${nomePrincipal}`)
        erros++
        continue
      }

      console.log(`\n📍 Unidade encontrada: ${unidade.nome} (ID: ${unidade.id})`)

      // Verificar se o setor já existe para esta unidade
      const setorExistente = await prisma.junction_UnidadeSetor.findFirst({
        where: {
          id_unidade: unidade.id
        },
        include: {
          setor: true
        }
      })

      if (setorExistente && setorExistente.setor.nome === nomeSetor) {
        console.log(`   ⏭️  Setor "${nomeSetor}" já existe para esta unidade`)
        continue
      }

      // Preparar dados do setor
      const gestorSetor = (registro.Gestor_setor || '').trim()
      const numeroSetor = (registro.Número_setor || '').trim()
      const whatsappSetor = (registro.WhattsApp_setor || '').trim()
      const emailSetor = (registro.Email_setor || '').trim()

      // Criar setor
      const novoSetor = await prisma.pROD_Setor.create({
        data: {
          nome: nomeSetor,
          gestor: gestorSetor && gestorSetor !== '-' ? gestorSetor : null,
          numero: numeroSetor && numeroSetor !== '-' ? numeroSetor : null,
          whatsapp: whatsappSetor && whatsappSetor !== '-' ? whatsappSetor : null,
          email: emailSetor && emailSetor !== '-' ? emailSetor : null,
          ativo: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      })

      console.log(`   ✅ Setor criado: ${novoSetor.nome}`)
      console.log(`      Gestor: ${novoSetor.gestor || 'N/A'}`)
      console.log(`      Número: ${novoSetor.numero || 'N/A'}`)
      console.log(`      WhatsApp: ${novoSetor.whatsapp || 'N/A'}`)
      console.log(`      Email: ${novoSetor.email || 'N/A'}`)

      // Criar junction (relacionamento)
      await prisma.junction_UnidadeSetor.create({
        data: {
          id_unidade: unidade.id,
          id_setor: novoSetor.id,
          created_at: new Date()
        }
      })

      console.log(`   🔗 Relacionamento criado entre unidade e setor`)
      setoresCriados++

    } catch (error) {
      console.error(`❌ Erro ao processar ${nomePrincipal}:`, error.message)
      erros++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO DA IMPORTAÇÃO')
  console.log('='.repeat(60))
  console.log(`✅ Setores criados: ${setoresCriados}`)
  console.log(`❌ Erros: ${erros}`)
  console.log('='.repeat(60))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
