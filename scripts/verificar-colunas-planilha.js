const XLSX = require('xlsx')

// Ler planilha
const wb = XLSX.readFile('../mapeamento_unidades_assistencia_social_ok.xlsx')
const ws = wb.Sheets['Mapa_Assistencia_Social']
const data = XLSX.utils.sheet_to_json(ws, {
  defval: null,
  blankrows: true
})

console.log('='.repeat(80))
console.log('COLUNAS DA PLANILHA')
console.log('='.repeat(80))

// Pegar a primeira linha para ver os nomes das colunas
if (data.length > 0) {
  const primeiraLinha = data[0]
  const colunas = Object.keys(primeiraLinha)

  console.log('\nColunas disponíveis:')
  colunas.forEach((col, index) => {
    console.log(`  ${index + 1}. ${col}`)
  })

  // Verificar colunas de contato
  console.log('\n' + '='.repeat(80))
  console.log('COLUNAS DE CONTATO ENCONTRADAS:')
  console.log('='.repeat(80))

  const colunasContato = colunas.filter(col =>
    col.toLowerCase().includes('whatsapp') ||
    col.toLowerCase().includes('email') ||
    col.toLowerCase().includes('telefone') ||
    col.toLowerCase().includes('número')
  )

  colunasContato.forEach(col => {
    console.log(`  ✅ ${col}`)
  })
}

// Mostrar alguns exemplos de dados
console.log('\n' + '='.repeat(80))
console.log('EXEMPLOS DE DADOS (primeiras 3 linhas):')
console.log('='.repeat(80))

for (let i = 0; i < Math.min(3, data.length); i++) {
  const row = data[i]
  console.log(`\n[Linha ${i + 2}] ${row.Nome_principal || 'SEM NOME'}`)

  // Mostrar todos os campos de contato
  Object.keys(row).forEach(key => {
    if (key.toLowerCase().includes('whatsapp') ||
        key.toLowerCase().includes('email') ||
        key.toLowerCase().includes('telefone') ||
        key.toLowerCase().includes('número')) {
      console.log(`  ${key}: ${row[key] || 'N/A'}`)
    }
  })
}

console.log('\n' + '='.repeat(80))
