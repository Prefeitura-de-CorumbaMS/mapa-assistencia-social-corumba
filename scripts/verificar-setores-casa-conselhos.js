const XLSX = require('xlsx')

const wb = XLSX.readFile('../mapeamento_unidades_assistencia_social_ok.xlsx')
const ws = wb.Sheets['Mapa_Assistencia_Social']
const data = XLSX.utils.sheet_to_json(ws)

// Filtrar TODAS as linhas da Casa dos Conselhos
const casaConselhos = data.filter(row => {
  const nome = (row.Nome_principal || '').trim()
  return nome.includes('Casa dos Conselhos')
})

console.log('='.repeat(70))
console.log('SETORES DA CASA DOS CONSELHOS NA PLANILHA')
console.log('='.repeat(70))
console.log('\nTotal de linhas encontradas:', casaConselhos.length)

casaConselhos.forEach((row, index) => {
  console.log('\n' + '-'.repeat(70))
  console.log(`[${index + 1}] SETOR: ${row.Setor || 'N/A'}`)
  console.log('    👤 Gestor:', row.Gestor_setor || 'N/A')
  console.log('    📞 Número:', row.Número_setor || 'N/A')
  console.log('    💬 WhatsApp:', row.WhattsApp_setor || 'N/A')
  console.log('    📧 Email:', row.Email_setor || 'N/A')
})

console.log('\n' + '='.repeat(70))
