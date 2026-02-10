require('dotenv').config({ path: '../.env' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Atualizando unidade 19 com informações da Secretária...\n')

  try {
    // Atualizar diretamente com SQL
    await prisma.$executeRawUnsafe(`
      UPDATE prod_unidade_turistica
      SET
        secretaria = 'Beatriz Rosália Ribeiro Cavassa de Oliveira',
        secretaria_adjunta = 'Jane Contu',
        updated_at = NOW()
      WHERE id = 19
    `)

    console.log('✅ Unidade atualizada com sucesso!')

    // Buscar para confirmar
    const unidade = await prisma.$queryRawUnsafe(`
      SELECT id, nome, secretaria, secretaria_adjunta
      FROM prod_unidade_turistica
      WHERE id = 19
    `)

    if (unidade && unidade.length > 0) {
      const u = unidade[0]
      console.log(`\n📍 Unidade: ${u.nome}`)
      console.log(`👤 Secretária: ${u.secretaria}`)
      console.log(`👤 Secretária Adjunta: ${u.secretaria_adjunta}`)
    }

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
