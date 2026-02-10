require('dotenv').config();
const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importarAssistenciaSocial() {
  console.log('===============================================');
  console.log('IMPORTAÇÃO: Unidades de Assistência Social');
  console.log('===============================================\n');

  // 1. Ler planilha
  const workbook = XLSX.readFile('C:\\dev\\mapa_ass_social\\mapeamento_unidades_assistencia_social_ok.xlsx');
  const sheet = workbook.Sheets['Mapa_Assistencia_Social'];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: null });

  console.log(`📄 Planilha lida: ${data.length} registros\n`);

  // 2. Agrupar por unidade principal
  const unidadesMap = new Map();

  data.forEach(row => {
    const nomeUnidade = row.Nome_principal;
    if (!nomeUnidade) return;

    if (!unidadesMap.has(nomeUnidade)) {
      // Extrair latitude e longitude
      const coords = row.Coordenadas_principal?.split(',') || [];
      const latitude = coords[0]?.trim() || null;
      const longitude = coords[1]?.trim() || null;

      unidadesMap.set(nomeUnidade, {
        secretaria: row.SECRETARIA || null,
        nome: nomeUnidade,
        gestor: row.Gestor_principal || null,
        endereco: row.Endereço_principal || null,
        latitude: latitude,
        longitude: longitude,
        email: row.Email_principal || null,
        telefone: row.Telefone_principal || null,
        whatsapp: row.Whatsapp_principal || null,
        setores: []
      });
    }

    // Se tem setor, adicionar
    if (row.Setor) {
      unidadesMap.get(nomeUnidade).setores.push({
        nome: row.Setor,
        gestor: row.Gestor_setor || null,
        numero: row.Número_setor || null,
        whatsapp: row.WhattsApp_setor || null,
        email: row.Email_setor || null
      });
    }
  });

  const unidades = Array.from(unidadesMap.values());

  console.log('📊 Estatísticas:');
  console.log(`   - Unidades principais: ${unidades.length}`);
  console.log(`   - Unidades com setores: ${unidades.filter(u => u.setores.length > 0).length}`);
  console.log(`   - Total de setores: ${unidades.reduce((acc, u) => acc + u.setores.length, 0)}\n`);

  console.log('📝 Importando unidades...\n');

  let unidadesImportadas = 0;
  let setoresImportados = 0;
  let erros = 0;

  for (const unidade of unidades) {
    try {
      // Validar coordenadas
      if (!unidade.latitude || !unidade.longitude) {
        console.log(`  ⚠️  ${unidade.nome} - SEM COORDENADAS (pulando)`);
        erros++;
        continue;
      }

      // Criar unidade
      const unidadeCriada = await prisma.$queryRaw`
        INSERT INTO prod_unidade_turistica (
          nome,
          endereco,
          latitude,
          longitude,
          telefone,
          whatsapp,
          email,
          setor,
          ativo,
          created_at,
          updated_at
        ) VALUES (
          ${unidade.nome},
          ${unidade.endereco},
          ${unidade.latitude},
          ${unidade.longitude},
          ${unidade.telefone},
          ${unidade.whatsapp},
          ${unidade.email},
          ${unidade.secretaria},
          TRUE,
          NOW(),
          NOW()
        )
      `;

      // Buscar ID da unidade criada
      const [result] = await prisma.$queryRaw`
        SELECT id FROM prod_unidade_turistica
        WHERE nome = ${unidade.nome}
        ORDER BY id DESC
        LIMIT 1
      `;

      const unidadeId = result.id;

      console.log(`  ✓ ${unidade.nome}`);
      unidadesImportadas++;

      // Criar setores (se existirem)
      for (const setor of unidade.setores) {
        try {
          await prisma.$queryRaw`
            INSERT INTO prod_setor (
              nome,
              gestor,
              numero,
              whatsapp,
              email,
              ativo,
              created_at,
              updated_at
            ) VALUES (
              ${setor.nome},
              ${setor.gestor},
              ${setor.numero},
              ${setor.whatsapp},
              ${setor.email},
              TRUE,
              NOW(),
              NOW()
            )
          `;

          const [setorResult] = await prisma.$queryRaw`
            SELECT id FROM prod_setor
            WHERE nome = ${setor.nome}
            ORDER BY id DESC
            LIMIT 1
          `;

          const setorId = setorResult.id;

          // Criar junction
          await prisma.$queryRaw`
            INSERT INTO junction_unidade_setor (
              id_unidade,
              id_setor,
              created_at
            ) VALUES (
              ${unidadeId},
              ${setorId},
              NOW()
            )
          `;

          console.log(`      → Setor: ${setor.nome}`);
          setoresImportados++;
        } catch (error) {
          console.error(`      ✗ Erro ao criar setor: ${error.message}`);
          erros++;
        }
      }

    } catch (error) {
      console.error(`  ✗ ${unidade.nome} - ERRO: ${error.message}`);
      erros++;
    }
  }

  console.log('\n===============================================');
  console.log('RESUMO DA IMPORTAÇÃO');
  console.log('===============================================');
  console.log(`✓ Unidades importadas: ${unidadesImportadas}`);
  console.log(`✓ Setores importados: ${setoresImportados}`);
  console.log(`✗ Erros: ${erros}`);
  console.log('\n✅ Importação concluída!\n');
}

importarAssistenciaSocial()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('\n❌ ERRO FATAL:', error);
    prisma.$disconnect();
    process.exit(1);
  });
