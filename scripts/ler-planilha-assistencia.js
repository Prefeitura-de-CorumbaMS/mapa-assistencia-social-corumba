const XLSX = require('xlsx');

// Ler planilha
const workbook = XLSX.readFile('C:\\dev\\mapa_ass_social\\mapeamento_unidades_assistencia_social_ok.xlsx');

console.log('Abas disponíveis:', workbook.SheetNames);
console.log('');

// Ler todas as abas
workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  console.log(`\nAba: ${sheetName} - ${data.length} registros`);
  if (data.length > 0) {
    console.log('Colunas:', Object.keys(data[0]).join(', '));
  }
});

console.log('\n');

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Converter para JSON
const data = XLSX.utils.sheet_to_json(sheet);

console.log('===============================================');
console.log('ANÁLISE: Planilha de Assistência Social');
console.log('===============================================\n');

console.log(`Total de registros: ${data.length}\n`);

// Mostrar primeiros 10 registros
console.log('Primeiros 10 registros:');
console.log('===============================================');
data.slice(0, 10).forEach((row, index) => {
  console.log(`\nRegistro ${index + 1}:`);
  console.log(JSON.stringify(row, null, 2));
});

// Mostrar todas as colunas
console.log('\n===============================================');
console.log('Colunas disponíveis:');
console.log('===============================================');
if (data.length > 0) {
  Object.keys(data[0]).forEach((key, index) => {
    console.log(`${index + 1}. ${key}`);
  });
}

// Estatísticas
console.log('\n===============================================');
console.log('Estatísticas:');
console.log('===============================================');

// Contar unidades únicas
const unidadesUnicas = new Set(data.map(row => row.UNIDADE || row.unidade || row.Unidade));
console.log(`Unidades únicas: ${unidadesUnicas.size}`);

// Verificar se há setores
const colunaSetor = Object.keys(data[0]).find(k =>
  k.toLowerCase().includes('setor') ||
  k.toLowerCase().includes('categoria') ||
  k.toLowerCase().includes('tipo')
);

if (colunaSetor) {
  const setores = data.map(row => row[colunaSetor]).filter(Boolean);
  const setoresUnicos = new Set(setores);
  console.log(`\nColuna de setor/categoria: "${colunaSetor}"`);
  console.log(`Setores únicos: ${setoresUnicos.size}`);
  console.log(`Setores:`);
  Array.from(setoresUnicos).slice(0, 10).forEach(s => console.log(`  - ${s}`));
}
