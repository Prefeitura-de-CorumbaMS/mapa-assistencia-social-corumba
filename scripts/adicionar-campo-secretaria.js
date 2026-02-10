require('dotenv').config({ path: '../.env' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Adicionando campos de secretária e atualizando unidade 19...\n')

  try {
    // Adicionar colunas na tabela
    console.log('📝 Adicionando colunas secretaria e secretaria_adjunta...')

    await prisma.$executeRawUnsafe(`
      ALTER TABLE prod_unidade_turistica
      ADD COLUMN IF NOT EXISTS secretaria VARCHAR(255) NULL,
      ADD COLUMN IF NOT EXISTS secretaria_adjunta VARCHAR(255) NULL
    `)

    console.log('✅ Colunas adicionadas com sucesso!\n')

    // Atualizar a unidade ID 19 (Secretaria Municipal)
    console.log('📝 Atualizando unidade ID 19 com informações da Secretária...')

    const unidade = await prisma.pROD_UnidadeTuristica.update({
      where: { id: 19 },
      data: {
        secretaria: 'Beatriz Rosália Ribeiro Cavassa de Oliveira',
        secretaria_adjunta: 'Jane Contu',
        updated_at: new Date()
      }
    })

    console.log('✅ Unidade atualizada com sucesso!')
    console.log(`   📍 Unidade: ${unidade.nome}`)
    console.log(`   👤 Secretária: ${unidade.secretaria}`)
    console.log(`   👤 Secretária Adjunta: ${unidade.secretaria_adjunta}`)

    console.log('\n' + '='.repeat(70))
    console.log('✅ OPERAÇÃO CONCLUÍDA COM SUCESSO!')
    console.log('='.repeat(70))

  } catch (error) {
    console.error('❌ Erro:', error.message)
    throw error
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
