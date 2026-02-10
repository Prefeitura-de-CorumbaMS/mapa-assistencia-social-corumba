require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function associarIcones() {
  console.log('===============================================');
  console.log('ASSOCIAÇÃO: Ícones → Unidades');
  console.log('===============================================\n');

  try {
    // 1. Buscar todos os ícones disponíveis
    const icones = await prisma.pROD_Icone.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' }
    });

    console.log(`✓ Encontrados ${icones.length} ícones ativos\n`);

    // 2. Buscar todas as unidades turísticas
    const unidades = await prisma.pROD_UnidadeTuristica.findMany({
      select: {
        id: true,
        nome: true,
        icone_url: true
      }
    });

    console.log(`✓ Encontradas ${unidades.length} unidades turísticas\n`);

    if (unidades.length === 0) {
      console.log('⚠️  Nenhuma unidade encontrada para associar ícones.');
      return;
    }

    console.log('📝 Associando ícones às unidades...\n');

    let atualizadas = 0;

    // 3. Associar ícones de forma distribuída
    for (let i = 0; i < unidades.length; i++) {
      const unidade = unidades[i];
      // Distribui os ícones ciclicamente entre as unidades
      const icone = icones[i % icones.length];

      await prisma.pROD_UnidadeTuristica.update({
        where: { id: unidade.id },
        data: { icone_url: icone.url }
      });

      console.log(`  ✓ ${unidade.nome.substring(0, 40).padEnd(40)} → ${icone.nome}`);
      atualizadas++;
    }

    console.log('\n===============================================');
    console.log('RESUMO DA ASSOCIAÇÃO');
    console.log('===============================================');
    console.log(`✓ Unidades atualizadas: ${atualizadas}`);
    console.log(`✓ Ícones utilizados: ${icones.length}`);
    console.log('\n✅ Associação concluída com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Iniciar o servidor: npm run dev:api');
    console.log('   2. Abrir o frontend: npm run dev:web');
    console.log('   3. Visualizar os ícones no mapa\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    throw error;
  }
}

associarIcones()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('\n❌ ERRO FATAL:', error);
    prisma.$disconnect();
    process.exit(1);
  });
