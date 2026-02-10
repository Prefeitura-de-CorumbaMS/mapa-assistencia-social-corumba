require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixDatetimes() {
  console.log('===============================================');
  console.log('CORREÇÃO: Valores de datetime na tabela prod_icone');
  console.log('===============================================\n');

  try {
    // Corrigir valores inválidos de datetime (0000-00-00 00:00:00)
    console.log('📝 Atualizando valores de created_at e updated_at...\n');

    await prisma.$executeRaw`
      UPDATE prod_icone
      SET
        created_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        created_at = '0000-00-00 00:00:00'
        OR updated_at = '0000-00-00 00:00:00'
        OR created_at IS NULL
        OR updated_at IS NULL
    `;

    console.log('✓ Valores de datetime corrigidos\n');

    // Verificar dados
    const icones = await prisma.$queryRaw`
      SELECT id, nome, url, ativo, created_at, updated_at
      FROM prod_icone
      ORDER BY ordem
    `;

    console.log('📋 Ícones após correção:');
    console.log('===============================================');
    console.log(`Total: ${icones.length} ícones\n`);

    console.log('✅ Correção concluída com sucesso!\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    throw error;
  }
}

fixDatetimes()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('\n❌ ERRO FATAL:', error);
    prisma.$disconnect();
    process.exit(1);
  });
