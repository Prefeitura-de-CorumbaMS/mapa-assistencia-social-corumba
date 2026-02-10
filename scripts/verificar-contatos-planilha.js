const XLSX = require('xlsx')

// Ler planilha
const wb = XLSX.readFile('../mapeamento_unidades_assistencia_social_ok.xlsx')
const ws = wb.Sheets['Mapa_Assistencia_Social']
const data = XLSX.utils.sheet_to_json(ws, {
  defval: null,
  blankrows: true
})

console.log('='.repeat(80))
console.log('CONTATOS NA PLANILHA')
console.log('='.repeat(80))

for (let i = 0; i < data.length; i++) {
  const row = data[i]
  const nome = row.Nome_principal?.trim()

  if (!nome) continue

  console.log(`\n[Linha ${i + 2}] ${nome}`)

  const telefone = row.Número_principal?.trim() || row.Telefone_principal?.trim()
  const whatsapp = row.WhatsApp_principal?.trim()
  const email = row.Email_principal?.trim()

  if (telefone && telefone !== '-') {
    console.log(`   📞 Telefone: ${telefone}`)
  }
  if (whatsapp && whatsapp !== '-') {
    console.log(`   💬 WhatsApp: ${whatsapp}`)
  }
  if (email && email !== '-') {
    console.log(`   📧 E-mail: ${email}`)
  }

  if (!telefone && !whatsapp && !email) {
    console.log(`   ❌ Sem contatos na planilha`)
  }
}

console.log('\n' + '='.repeat(80))
