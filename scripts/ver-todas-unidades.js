const XLSX = require('xlsx')

const wb = XLSX.readFile('../mapeamento_unidades_assistencia_social_ok.xlsx')
const ws = wb.Sheets['Mapa_Assistencia_Social']
const data = XLSX.utils.sheet_to_json(ws)

console.log('='.repeat(70))
console.log(`TOTAL DE LINHAS NA PLANILHA: ${data.length}`)
console.log('='.repeat(70))

data.forEach((row, index) => {
  console.log(`\n[${index + 1}] ${row.Nome_principal || 'SEM NOME'}`)
  console.log(`    Secretaria: ${row.SECRETARIA || 'N/A'}`)
  console.log(`    Gestor: ${row.Gestor_principal || 'N/A'}`)
  console.log(`    Endereço: ${row.Endereço_principal || 'N/A'}`)
})

console.log('\n' + '='.repeat(70))

// Buscar especificamente Casa dos Conselhos
console.log('\n🔍 BUSCANDO CASA DOS CONSELHOS...\n')
const casa = data.filter(r => {
  const nome = (r.Nome_principal || '').toLowerCase()
  const secretaria = (r.SECRETARIA || '').toLowerCase()
  return nome.includes('conselhos') || nome.includes('conselho') ||
         secretaria.includes('conselhos') || secretaria.includes('conselho')
})

console.log(`Encontradas ${casa.length} linha(s) relacionada(s) a conselhos:`)
casa.forEach((r, i) => {
  console.log(`\n  [${i + 1}] ${r.Nome_principal}`)
  console.log(`      Secretaria: ${r.SECRETARIA}`)
})
