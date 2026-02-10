const XLSX = require('xlsx');

// Ler planilha
const workbook = XLSX.readFile('C:\\dev\\mapa_ass_social\\mapeamento_unidades_assistencia_social_ok.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Converter para JSON (incluir células vazias)
const data = XLSX.utils.sheet_to_json(sheet, { defval: null });

console.log('===============================================');
console.log('ANÁLISE COMPLETA: Assistência Social');
console.log('===============================================\n');

console.log(`Total de registros: ${data.length}\n`);

// Agrupar por unidade principal
const unidadesMap = new Map();

data.forEach(row => {
  const nomeUnidade = row.Nome_principal;

  if (!nomeUnidade) return;

  if (!unidadesMap.has(nomeUnidade)) {
    unidadesMap.set(nomeUnidade, {
      secretaria: row.SECRETARIA,
      nome: nomeUnidade,
      gestor: row.Gestor_principal,
      endereco: row.Endereço_principal,
      coordenadas: row.Coordenadas_principal,
      email: row.Email_principal,
      telefone: row.Telefone_principal,
      whatsapp: row.Whatsapp_principal,
      setores: []
    });
  }

  // Se tem setor, adicionar
  if (row.Setor) {
    unidadesMap.get(nomeUnidade).setores.push({
      nome: row.Setor,
      gestor: row.Gestor_setor,
      numero: row.Número_setor,
      whatsapp: row.WhattsApp_setor,
      email: row.Email_setor
    });
  }
});

const unidades = Array.from(unidadesMap.values());

console.log('===============================================');
console.log('ESTATÍSTICAS');
console.log('===============================================');
console.log(`Total de unidades principais: ${unidades.length}`);

const unidadesComSetores = unidades.filter(u => u.setores.length > 0);
const totalSetores = unidades.reduce((acc, u) => acc + u.setores.length, 0);

console.log(`Unidades com setores: ${unidadesComSetores.length}`);
console.log(`Total de setores: ${totalSetores}`);
console.log('');

// Mostrar unidades com setores
console.log('===============================================');
console.log('UNIDADES COM SETORES');
console.log('===============================================\n');

unidadesComSetores.forEach(unidade => {
  console.log(`📍 ${unidade.nome}`);
  console.log(`   Setores (${unidade.setores.length}):`);
  unidade.setores.forEach((setor, idx) => {
    console.log(`   ${idx + 1}. ${setor.nome}`);
    if (setor.gestor) console.log(`      Gestor: ${setor.gestor}`);
    if (setor.numero) console.log(`      Número: ${setor.numero}`);
  });
  console.log('');
});

// Mostrar exemplos de unidades sem setores
console.log('===============================================');
console.log('EXEMPLOS DE UNIDADES SEM SETORES');
console.log('===============================================\n');

const unidadesSemSetores = unidades.filter(u => u.setores.length === 0);
unidadesSemSetores.slice(0, 5).forEach(unidade => {
  console.log(`📍 ${unidade.nome}`);
  console.log(`   Gestor: ${unidade.gestor || 'N/A'}`);
  console.log(`   Endereço: ${unidade.endereco || 'N/A'}`);
  console.log(`   Coordenadas: ${unidade.coordenadas || 'N/A'}`);
  console.log('');
});

// Salvar JSON para referência
const fs = require('fs');
fs.writeFileSync(
  'scripts/temp_unidades_assistencia.json',
  JSON.stringify(unidades, null, 2)
);

console.log('✅ Dados salvos em: scripts/temp_unidades_assistencia.json');
