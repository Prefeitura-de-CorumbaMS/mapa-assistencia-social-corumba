#!/usr/bin/env node

/**
 * Script para limpar todos os dados de analytics (execução forçada, sem confirmação)
 * Mantém intactos os dados das unidades e demais tabelas
 */

// Carregar variáveis de ambiente
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { prisma } = require('@mapatur/database');

async function main() {
  console.log('\n========================================');
  console.log('LIMPEZA DE DADOS DE ANALYTICS');
  console.log('========================================\n');

  try {
    // Contar registros antes da limpeza
    console.log('📊 Contando registros atuais...\n');

    const [eventCount, sessionCount, unitStatsCount, searchStatsCount] = await Promise.all([
      prisma.aNALYTICS_Event.count(),
      prisma.aNALYTICS_Session.count(),
      prisma.aNALYTICS_UnitStats.count(),
      prisma.aNALYTICS_SearchStats.count(),
    ]);

    console.log(`📌 ANALYTICS_Event: ${eventCount.toLocaleString('pt-BR')} registros`);
    console.log(`📌 ANALYTICS_Session: ${sessionCount.toLocaleString('pt-BR')} registros`);
    console.log(`📌 ANALYTICS_UnitStats: ${unitStatsCount.toLocaleString('pt-BR')} registros`);
    console.log(`📌 ANALYTICS_SearchStats: ${searchStatsCount.toLocaleString('pt-BR')} registros`);

    const total = eventCount + sessionCount + unitStatsCount + searchStatsCount;
    console.log(`\n🔢 TOTAL: ${total.toLocaleString('pt-BR')} registros\n`);

    if (total === 0) {
      console.log('✅ Não há dados de analytics para limpar.\n');
      await prisma.$disconnect();
      process.exit(0);
    }

    console.log('🗑️  Iniciando limpeza...\n');

    // Deletar em ordem (eventos primeiro, depois agregações)
    console.log('1️⃣  Deletando eventos...');
    const deletedEvents = await prisma.aNALYTICS_Event.deleteMany({});
    console.log(`   ✅ ${deletedEvents.count.toLocaleString('pt-BR')} eventos deletados`);

    console.log('2️⃣  Deletando sessões...');
    const deletedSessions = await prisma.aNALYTICS_Session.deleteMany({});
    console.log(`   ✅ ${deletedSessions.count.toLocaleString('pt-BR')} sessões deletadas`);

    console.log('3️⃣  Deletando estatísticas de unidades...');
    const deletedUnitStats = await prisma.aNALYTICS_UnitStats.deleteMany({});
    console.log(`   ✅ ${deletedUnitStats.count.toLocaleString('pt-BR')} registros deletados`);

    console.log('4️⃣  Deletando estatísticas de busca...');
    const deletedSearchStats = await prisma.aNALYTICS_SearchStats.deleteMany({});
    console.log(`   ✅ ${deletedSearchStats.count.toLocaleString('pt-BR')} registros deletados`);

    const totalDeleted = deletedEvents.count + deletedSessions.count +
                         deletedUnitStats.count + deletedSearchStats.count;

    console.log('\n========================================');
    console.log(`✅ LIMPEZA CONCLUÍDA COM SUCESSO!`);
    console.log(`🗑️  Total de registros deletados: ${totalDeleted.toLocaleString('pt-BR')}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ Erro ao limpar dados de analytics:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
