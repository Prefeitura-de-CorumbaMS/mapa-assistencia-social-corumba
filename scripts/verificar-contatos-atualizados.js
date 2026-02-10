require('dotenv').config({ path: '../.env' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Verificando contatos atualizados nas unidades...\n')

  // Buscar todas as unidades
  const unidades = await prisma.pROD_UnidadeTuristica.findMany({
    where: { ativo: true },
    orderBy: { id: 'asc' }
  })

  console.log(`📊 Total de unidades ativas: ${unidades.length}\n`)

  let comTelefone = 0
  let comWhatsApp = 0
  let comEmail = 0

  console.log('='.repeat(80))
  console.log('CONTATOS DAS UNIDADES')
  console.log('='.repeat(80))

  for (const unidade of unidades) {
    console.log(`\n[${unidade.id}] ${unidade.nome}`)

    if (unidade.telefone) {
      console.log(`   📞 Telefone: ${unidade.telefone}`)
      comTelefone++
    }

    if (unidade.whatsapp) {
      console.log(`   💬 WhatsApp: ${unidade.whatsapp}`)
      comWhatsApp++
    }

    if (unidade.email) {
      console.log(`   📧 E-mail: ${unidade.email}`)
      comEmail++
    }

    if (!unidade.telefone && !unidade.whatsapp && !unidade.email) {
      console.log(`   ❌ Sem contatos cadastrados`)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('📊 RESUMO')
  console.log('='.repeat(80))
  console.log(`✅ Unidades com telefone: ${comTelefone}`)
  console.log(`✅ Unidades com WhatsApp: ${comWhatsApp}`)
  console.log(`✅ Unidades com e-mail: ${comEmail}`)
  console.log(`📱 Total de unidades: ${unidades.length}`)
  console.log('='.repeat(80))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
