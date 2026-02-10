require('dotenv').config({ path: '../.env' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const setores = await prisma.pROD_Setor.findMany({
    include: {
      unidades: {
        include: {
          unidade: true
        }
      }
    }
  })

  console.log('\n' + '='.repeat(70))
  console.log('📊 SETORES CADASTRADOS NO SISTEMA')
  console.log('='.repeat(70))

  for (const setor of setores) {
    console.log('\n📦 SETOR:', setor.nome)
    console.log('   👤 Gestor:', setor.gestor || 'N/A')
    console.log('   📞 Número:', setor.numero || 'N/A')
    console.log('   💬 WhatsApp:', setor.whatsapp || 'N/A')
    console.log('   📧 Email:', setor.email || 'N/A')
    console.log('   🏢 Unidade:', setor.unidades[0]?.unidade?.nome || 'N/A')
    console.log('   🆔 ID Unidade:', setor.unidades[0]?.unidade?.id || 'N/A')
  }

  console.log('\n' + '='.repeat(70))
  console.log(`✅ Total de setores cadastrados: ${setores.length}`)
  console.log('='.repeat(70) + '\n')
}

main().finally(() => prisma.$disconnect())
