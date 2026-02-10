require('dotenv').config({ path: '../.env' })
const { PrismaClient } = require('@prisma/client')
const XLSX = require('xlsx')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Importando setores da Secretaria Municipal de Assistência Social e Cidadania...\n')

  // Ler planilha
  const wb = XLSX.readFile('../mapeamento_unidades_assistencia_social_ok.xlsx')
  const ws = wb.Sheets['Mapa_Assistencia_Social']
  const data = XLSX.utils.sheet_to_json(ws, {
    defval: null,
    blankrows: true
  })

  console.log('📊 Total de linhas na planilha:', data.length)

  // Buscar unidade Secretaria Municipal no banco
  const unidade = await prisma.pROD_UnidadeTuristica.findFirst({
    where: {
      nome: {
        contains: 'Secretaria Municipal de Assistência Social e Cidadania'
      }
    }
  })

  if (!unidade) {
    console.log('❌ Unidade Secretaria Municipal de Assistência Social e Cidadania não encontrada no banco!')
    return
  }

  console.log(`✅ Unidade encontrada: ${unidade.nome} (ID: ${unidade.id})`)

  // Filtrar apenas as linhas 28-35 (índices 27-34 em array 0-based, mas +1 por causa do header)
  // Como o array é 0-based e a primeira linha é header, linha 28 da planilha = índice 26
  const linhasSecreataria = data.slice(27, 35) // Pega da linha 28 até 35 (inclusive)

  console.log(`\n📋 Processando ${linhasSecreataria.length} linhas (28-35 da planilha)`)

  const setoresParaImportar = []

  linhasSecreataria.forEach((row, index) => {
    const linhaReal = 28 + index // Linha real na planilha

    // Se a linha tem dados na coluna Setor, é um setor para importar
    if (row.Setor && row.Setor.trim() !== '') {
      setoresParaImportar.push({
        linha: linhaReal,
        nome: row.Setor.trim(),
        gestor: row.Gestor_setor?.trim() || null,
        numero: row.Número_setor?.trim() || null,
        whatsapp: row.WhattsApp_setor?.trim() || null,
        email: row.Email_setor?.trim() || null,
      })
    }
  })

  console.log(`\n✅ Encontrados ${setoresParaImportar.length} setores para importar`)

  let setoresCriados = 0
  let setoresIgnorados = 0

  for (const setorData of setoresParaImportar) {
    console.log(`\n[Linha ${setorData.linha}] ${setorData.nome}`)

    // Verificar se o setor já existe para esta unidade
    const junctionExistente = await prisma.junction_UnidadeSetor.findFirst({
      where: {
        id_unidade: unidade.id
      },
      include: {
        setor: true
      }
    })

    if (junctionExistente && junctionExistente.setor.nome === setorData.nome) {
      console.log(`   ⏭️  Setor já existe, pulando...`)
      setoresIgnorados++
      continue
    }

    try {
      // Criar setor
      const novoSetor = await prisma.pROD_Setor.create({
        data: {
          nome: setorData.nome,
          gestor: setorData.gestor && setorData.gestor !== '-' ? setorData.gestor : null,
          numero: setorData.numero && setorData.numero !== '-' ? setorData.numero : null,
          whatsapp: setorData.whatsapp && setorData.whatsapp !== '-' ? setorData.whatsapp : null,
          email: setorData.email && setorData.email !== '-' ? setorData.email : null,
          ativo: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      })

      console.log(`   ✅ Setor criado (ID: ${novoSetor.id})`)
      console.log(`      👤 Gestor: ${novoSetor.gestor || 'N/A'}`)
      console.log(`      📞 Número: ${novoSetor.numero || 'N/A'}`)
      console.log(`      💬 WhatsApp: ${novoSetor.whatsapp || 'N/A'}`)
      console.log(`      📧 Email: ${novoSetor.email || 'N/A'}`)

      // Criar junction (relacionamento)
      await prisma.junction_UnidadeSetor.create({
        data: {
          id_unidade: unidade.id,
          id_setor: novoSetor.id,
          created_at: new Date()
        }
      })

      console.log(`   🔗 Relacionamento criado`)
      setoresCriados++

    } catch (error) {
      console.error(`   ❌ Erro ao criar setor:`, error.message)
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log('📊 RESUMO DA IMPORTAÇÃO')
  console.log('='.repeat(70))
  console.log(`✅ Setores criados: ${setoresCriados}`)
  console.log(`⏭️  Setores já existentes: ${setoresIgnorados}`)
  console.log(`📋 Total processado: ${setoresParaImportar.length}`)
  console.log('='.repeat(70))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
