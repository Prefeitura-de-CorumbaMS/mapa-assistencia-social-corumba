require('dotenv').config();
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateIcones() {
  console.log('===============================================');
  console.log('ATUALIZAÇÃO: Ícones de Assistência Social');
  console.log('===============================================\n');

  // Ler arquivo SQL
  const migrationPath = 'packages/database/migrations/update_icones_assistencia_social.sql';
  console.log(`📄 Lendo arquivo: ${migrationPath}`);

  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Dividir em statements (separados por ;)
  const statements = sql
    .split(/;[\s\n]/)
    .map(s => s.trim())
    .filter(s => {
      // Remover linhas vazias e comentários puros
      if (s.length === 0) return false;
      if (s.startsWith('--') && !s.includes('\n')) return false;
      return true;
    })
    .map(s => {
      // Remover comentários de linha
      return s.split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .trim();
    })
    .filter(s => s.length > 0);

  console.log(`✓ Encontrados ${statements.length} comandos SQL\n`);

  console.log('📝 Esta operação irá:');
  console.log('    - Limpar ícones antigos de turismo');
  console.log('    - Inserir 22 novos ícones de assistência social\n');

  console.log('Executando atualização...\n');

  let executados = 0;
  let erros = 0;

  for (const statement of statements) {
    try {
      // Ignorar comentários
      if (statement.startsWith('--') || statement.startsWith('/*')) {
        continue;
      }

      await prisma.$executeRawUnsafe(statement);
      executados++;

      // Log para operações importantes
      if (statement.includes('TRUNCATE')) {
        console.log(`  ✓ Ícones antigos removidos`);
      } else if (statement.includes('INSERT INTO')) {
        console.log(`  ✓ Novos ícones inseridos`);
      } else if (statement.includes('SELECT')) {
        // Executar e exibir resultados
        const results = await prisma.$queryRawUnsafe(statement);
        console.log('\n📋 Ícones cadastrados:');
        console.log('===============================================');
        results.forEach(row => {
          console.log(`  ${row.ordem}. ${row.nome.padEnd(35)} → ${row.url}`);
        });
        console.log('===============================================\n');
      }
    } catch (error) {
      erros++;
      console.error(`  ✗ Erro:`, error.message);
    }
  }

  console.log('\n===============================================');
  console.log('RESUMO DA ATUALIZAÇÃO');
  console.log('===============================================');
  console.log(`✓ Comandos executados: ${executados}`);
  console.log(`✗ Erros: ${erros}`);
  console.log('\n✅ Ícones de assistência social atualizados com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('   1. Associar ícones às unidades/categorias');
  console.log('   2. Testar visualização no mapa\n');
}

updateIcones()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('\n❌ ERRO FATAL:', error);
    prisma.$disconnect();
    process.exit(1);
  });
