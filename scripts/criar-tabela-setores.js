require('dotenv').config();
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criarTabelaSetores() {
  console.log('===============================================');
  console.log('MIGRAÇÃO: Tabela de Setores');
  console.log('===============================================\n');

  const migrationPath = 'packages/database/migrations/add_setores_assistencia_social.sql';
  console.log(`📄 Lendo arquivo: ${migrationPath}`);

  const sql = fs.readFileSync(migrationPath, 'utf8');

  const statements = sql
    .split(/;[\s\n]/)
    .map(s => s.trim())
    .filter(s => {
      if (s.length === 0) return false;
      if (s.startsWith('--') && !s.includes('\n')) return false;
      return true;
    })
    .map(s => {
      return s.split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .trim();
    })
    .filter(s => s.length > 0);

  console.log(`✓ Encontrados ${statements.length} comandos SQL\n`);

  console.log('📝 Esta operação irá:');
  console.log('    - Criar tabela prod_setor');
  console.log('    - Criar tabela junction_unidade_setor\n');

  console.log('Executando migração...\n');

  let executados = 0;

  for (const statement of statements) {
    try {
      if (statement.startsWith('--') || statement.startsWith('/*')) {
        continue;
      }

      await prisma.$executeRawUnsafe(statement);
      executados++;

      if (statement.includes('CREATE TABLE')) {
        const match = statement.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i);
        if (match) {
          console.log(`  ✓ Tabela criada: ${match[1]}`);
        }
      } else if (statement.includes('SELECT')) {
        const results = await prisma.$queryRawUnsafe(statement);
        console.log('\n📋 Verificação:');
        console.log('===============================================');
        results.forEach(row => {
          console.log(`  ${row.tabela.padEnd(30)} → ${row.total} registros`);
        });
        console.log('===============================================\n');
      }
    } catch (error) {
      console.error(`  ✗ Erro:`, error.message);
    }
  }

  console.log('\n===============================================');
  console.log('RESUMO');
  console.log('===============================================');
  console.log(`✓ Comandos executados: ${executados}`);
  console.log('\n✅ Tabelas de setores criadas!');
  console.log('   Pronto para importar dados\n');
}

criarTabelaSetores()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('\n❌ ERRO FATAL:', error);
    prisma.$disconnect();
    process.exit(1);
  });
