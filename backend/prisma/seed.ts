import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({ adapter });

const botResponses = [
  {
    keyword: 'hola',
    response:
      '👋 ¡Hola! Bienvenido a nuestro asistente virtual.\n\n' +
      'Por favor elige una opción escribiendo el número o la palabra clave:\n\n' +
      '1️⃣ *Servicios* - Conoce lo que ofrecemos\n' +
      '2️⃣ *Contacto* - Horarios y canales de atención\n' +
      'ℹ️ Escribe *ayuda* en cualquier momento para volver a ver este menú.',
  },
  {
    keyword: 'menu',
    response:
      '👋 ¡Hola! Bienvenido a nuestro asistente virtual.\n\n' +
      'Por favor elige una opción escribiendo el número o la palabra clave:\n\n' +
      '1️⃣ *Servicios* - Conoce lo que ofrecemos\n' +
      '2️⃣ *Contacto* - Horarios y canales de atención\n' +
      'ℹ️ Escribe *ayuda* en cualquier momento para volver a ver este menú.',
  },
  {
    keyword: 'ayuda',
    response:
      '👋 ¡Hola! Bienvenido a nuestro asistente virtual.\n\n' +
      'Por favor elige una opción escribiendo el número o la palabra clave:\n\n' +
      '1️⃣ *Servicios* - Conoce lo que ofrecemos\n' +
      '2️⃣ *Contacto* - Horarios y canales de atención\n' +
      'ℹ️ Escribe *ayuda* en cualquier momento para volver a ver este menú.',
  },
  {
    keyword: '1',
    response:
      '🚀 *Nuestros Servicios*\n\n' +
      '• Desarrollo de Software a la Medida\n' +
      '• Bots de WhatsApp y Automatización\n' +
      '• Consultoría Cloud y DevOps\n\n' +
      'Escribe *menu* para volver al menú principal.',
  },
  {
    keyword: '2',
    response:
      '📞 *Canales de Contacto*\n\n' +
      '• 📧 Email: soporte@example.com\n' +
      '• 🌐 Web: https://example.com\n' +
      '• ⏰ Horario: Lunes a Viernes de 9:00 AM a 6:00 PM\n\n' +
      'Escribe *menu* para volver al menú principal.',
  },
  {
    keyword: 'fallback',
    response:
      '🤖 No entendí ese comando.\n\n' +
      'Por favor escribe *menu* o *ayuda* para ver las opciones disponibles.',
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  for (const data of botResponses) {
    const record = await prisma.botResponse.upsert({
      where: { keyword: data.keyword },
      update: { response: data.response },
      create: data,
    });
    console.log(`  ✅ Seeded: "${record.keyword}" (id: ${record.id})`);
  }

  console.log('🌱 Seeding completed!');
}

main()
  .catch((error) => {
    console.error('❌ Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
