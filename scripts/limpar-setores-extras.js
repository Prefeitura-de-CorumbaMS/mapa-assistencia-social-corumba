require('dotenv').config({ path: '../.env' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Limpando setores extras da Casa dos Conselhos...\n')

  // Setores que DEVEM permanecer (linhas 19-27 da planilha)
  const setoresCorretos = [
    'CASA DOS CONSELHOS',
    'CONSELHO TUTELAR',
    'Conselho Municipal de Defesa dos Direitos da Pessoa Idosa',
    'CONSELHO MUNICIPAL DA ASSISTÊNCIA SOCIAL',
    'CONSELHO MUNICIPAL DOS DIREITOS DA CRIANÇA E DO ADOLESCENTE',
    'CONSELHO MUNICIPAL DOS DIREITOS DA PESSOA COM DEFICIÊNCIA - COMPED',
    'Conselho Municipal de Segurança Alimentar e Nutricional.',
    'Conselho Municipal dos Direitos da Mulher',
    'Violação de direitos de crianças e adolescentes'
  ]

  // Buscar unidade Casa dos Conselhos
  const unidade = await prisma.pROD_UnidadeTuristica.findFirst({
    where: { nome: { contains: 'Casa dos Conselhos' } }
  })

  if (!unidade) {
    console.log('❌ Unidade não encontrada!')
    return
  }

  console.log(`✅ Unidade: ${unidade.nome} (ID: ${unidade.id})\n`)

  // Buscar todos os setores da unidade
  const junctions = await prisma.junction_UnidadeSetor.findMany({
    where: { id_unidade: unidade.id },
    include: { setor: true }
  })

  console.log(`📊 Total de setores cadastrados: ${junctions.length}`)
  console.log(`✅ Setores corretos esperados: ${setoresCorretos.length}\n`)

  let removidos = 0

  for (const junction of junctions) {
    const setor = junction.setor

    // Se o setor NÃO está na lista de corretos, remover
    if (!setoresCorretos.includes(setor.nome)) {
      console.log(`❌ Removendo: ${setor.nome}`)

      // Deletar junction
      await prisma.junction_UnidadeSetor.delete({
        where: {
          id_unidade_id_setor: {
            id_unidade: unidade.id,
            id_setor: setor.id
          }
        }
      })

      // Deletar setor
      await prisma.pROD_Setor.delete({
        where: { id: setor.id }
      })

      removidos++
    } else {
      console.log(`✅ Mantendo: ${setor.nome}`)
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log('📊 RESUMO')
  console.log('='.repeat(70))
  console.log(`✅ Setores mantidos: ${junctions.length - removidos}`)
  console.log(`❌ Setores removidos: ${removidos}`)
  console.log('='.repeat(70))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
