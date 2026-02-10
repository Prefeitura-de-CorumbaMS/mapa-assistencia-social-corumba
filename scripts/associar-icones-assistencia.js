require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mapeamento de palavras-chave para ícones
const mapeamentoIcones = {
  'CRAS': 'CRAS',
  'CREAS': 'CREAS',
  'Centro Pop': 'Centro Pop',
  'CENTRO POP': 'Centro Pop',
  'Casa de Passagem': 'Casa de Passagem',
  'Albergue': 'Casa de Passagem',
  'Casa do Migrante': 'Casa de Passagem',
  'Convivência': 'Centro de Convivência',
  'CCI': 'Centro de Convivência',
  'Acolhimento': 'Unidade de Acolhimento',
  'CAIAD': 'Abrigo Institucional',
  'CAIN': 'Abrigo Institucional',
  'Asilo': 'Centro de Atendimento ao Idoso',
  'Idosos': 'Centro de Atendimento ao Idoso',
  'CRAM': 'Centro de Atendimento à Mulher',
  'Mulher': 'Centro de Atendimento à Mulher',
  'Maria da Penha': 'Centro de Atendimento à Mulher',
  'Conselhos': 'Conselho Tutelar',
  'Casa de recuperação': 'Casa Lar',
  'Secretaria': 'Assistência Social Geral',
  'CIDADANIA': 'Assistência Social Geral',
  'ALMOXARIFADO': 'Outros Serviços'
};

async function associarIcones() {
  console.log('===============================================');
  console.log('ASSOCIAÇÃO: Ícones de Assistência Social');
  console.log('===============================================\n');

  try {
    // 1. Buscar todos os ícones
    const icones = await prisma.$queryRaw`
      SELECT id, nome, url
      FROM prod_icone
      WHERE ativo = TRUE
      ORDER BY ordem
    `;

    console.log(`✓ Ícones disponíveis: ${icones.length}\n`);

    // Criar mapa de ícones por nome
    const iconesMap = new Map();
    icones.forEach(icone => {
      iconesMap.set(icone.nome, icone);
    });

    // 2. Buscar todas as unidades
    const unidades = await prisma.$queryRaw`
      SELECT id, nome, icone_url
      FROM prod_unidade_turistica
      WHERE ativo = TRUE
      ORDER BY nome
    `;

    console.log(`✓ Unidades encontradas: ${unidades.length}\n`);
    console.log('📝 Associando ícones...\n');

    let atualizadas = 0;
    let semIcone = 0;

    for (const unidade of unidades) {
      let iconeEncontrado = null;

      // Tentar encontrar ícone baseado em palavras-chave
      for (const [keyword, iconeNome] of Object.entries(mapeamentoIcones)) {
        if (unidade.nome.includes(keyword)) {
          iconeEncontrado = iconesMap.get(iconeNome);
          if (iconeEncontrado) break;
        }
      }

      // Se não encontrou, usar ícone padrão
      if (!iconeEncontrado) {
        iconeEncontrado = iconesMap.get('Assistência Social Geral');
      }

      if (iconeEncontrado) {
        await prisma.$queryRaw`
          UPDATE prod_unidade_turistica
          SET icone_url = ${iconeEncontrado.url}
          WHERE id = ${unidade.id}
        `;

        console.log(`  ✓ ${unidade.nome.substring(0, 50).padEnd(50)} → ${iconeEncontrado.nome}`);
        atualizadas++;
      } else {
        console.log(`  ⚠️  ${unidade.nome} - SEM ÍCONE`);
        semIcone++;
      }
    }

    console.log('\n===============================================');
    console.log('RESUMO');
    console.log('===============================================');
    console.log(`✓ Unidades atualizadas: ${atualizadas}`);
    console.log(`⚠️  Sem ícone: ${semIcone}`);
    console.log('\n✅ Associação concluída!\n');

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
