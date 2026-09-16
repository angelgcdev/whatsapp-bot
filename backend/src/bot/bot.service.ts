import { Injectable } from '@nestjs/common';

@Injectable()
export class BotService {
  processMessage(text: string): string {
    const command = text.trim().toLowerCase();

    switch (command) {
      case 'hola':
      case 'hello':
      case 'menu':
      case 'ayuda':
      case 'help':
        return this.getMainMenu();
      case '1':
      case 'servicios':
      case 'services':
        return this.getServicesInfo();
      case '2':
      case 'contacto':
      case 'contact':
        return this.getContactInfo();
      default:
        return this.getFallbackMessage();
    }
  }

  private getMainMenu(): string {
    return (
      '👋 ¡Hola! Bienvenido a nuestro asistente virtual.\n\n' +
      'Por favor elige una opción escribiendo el número o la palabra clave:\n\n' +
      '1️⃣ *Servicios* - Conoce lo que ofrecemos\n' +
      '2️⃣ *Contacto* - Horarios y canales de atención\n' +
      'ℹ️ Escribe *ayuda* en cualquier momento para volver a ver este menú.'
    );
  }
  private getServicesInfo(): string {
    return (
      '🚀 *Nuestros Servicios*\n\n' +
      '• Desarrollo de Software a la Medida\n' +
      '• Bots de WhatsApp y Automatización\n' +
      '• Consultoría Cloud y DevOps\n\n' +
      'Escribe *menu* para volver al menú principal.'
    );
  }
  private getContactInfo(): string {
    return (
      '📞 *Canales de Contacto*\n\n' +
      '• 📧 Email: soporte@example.com\n' +
      '• 🌐 Web: https://example.com\n' +
      '• ⏰ Horario: Lunes a Viernes de 9:00 AM a 6:00 PM\n\n' +
      'Escribe *menu* para volver al menú principal.'
    );
  }
  private getFallbackMessage(): string {
    return (
      '🤖 No entendí ese comando.\n\n' +
      'Por favor escribe *menu* o *ayuda* para ver las opciones disponibles.'
    );
  }
}
