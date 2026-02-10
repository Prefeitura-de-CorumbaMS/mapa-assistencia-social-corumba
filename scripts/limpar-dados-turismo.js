require('dotenv').config();
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function limparDadosTurismo() {
  console.log('===============================================');
  console.log('LIMPEZA: Dados de Turismo');
  console.log('===============================================\n');

  const migrationPath = 'packages/database/migrations/limpar_dados_turismo.sql';
  console.log(`📄 Lendo arquivo: ${migrationPath}`);

  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Dividir em statements
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

  console.log('⚠️  ATENÇÃO: Esta operação irá:');
  console.log('    - Deletar TODAS as unidades turísticas');
  console.log('    - Deletar TODAS as categorias');
  console.log('    - Deletar TODOS os vínculos e redes sociais\n');

  console.log('Executando limpeza...\n');

  let executados = 0;

  for (const statement of statements) {
    try {
      if (statement.startsWith('--') || statement.startsWith('/*')) {
        continue;
      }

      const result = await prisma.$executeRawUnsafe(statement);
      executados++;

      if (statement.includes('TRUNCATE')) {
        const match = statement.match(/TRUNCATE TABLE\s+(\w+)/i);
        if (match) {
          console.log(`  ✓ Tabela limpa: ${match[1]}`);
        }
      } else if (statement.includes('SELECT')) {
        const results = await prisma.$queryRawUnsafe(statement);
        console.log('\n📋 Verificação:');
        console.log('===============================================');
        results.forEach(row => {
          console.log(`  ${row.tabela.padEnd(40)} → ${row.total} registros`);
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
  console.log('\n✅ Limpeza concluída!');
  console.log('   Banco pronto para receber dados de assistência social\n');
}

limparDadosTurismo()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('\n❌ ERRO FATAL:', error);
    prisma.$disconnect();
    process.exit(1);
  });
