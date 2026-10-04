import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'bot' | 'agent';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  contactName: string;
  phoneNumber: string;
  avatarUrl: string;
  isBotActive: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTimestamp: string;
  messages: ChatMessage[];
}

@Component({
  selector: 'app-conversations-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversations-page.component.html',
  styleUrl: './conversations-page.component.css',
})
export class ConversationsPageComponent {
  // Lista de conversaciones
  conversations = signal<Conversation[]>([
    {
      id: 'conv-1',
      contactName: 'Carlos Gómez',
      phoneNumber: '+58 412 1234567',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      isBotActive: true,
      unreadCount: 0,
      lastMessage: 'Here are our available service plans: 1. Basic 2. Pro 3. Enterprise',
      lastMessageTimestamp: '10:45 AM',
      messages: [
        {
          id: '1',
          sender: 'customer',
          text: 'Hello! Can you share your pricing plans?',
          timestamp: '10:44 AM',
        },
        {
          id: '2',
          sender: 'bot',
          text: 'Here are our available service plans: 1. Basic 2. Pro 3. Enterprise',
          timestamp: '10:45 AM',
        },
      ],
    },
    {
      id: 'conv-2',
      contactName: 'María Rodríguez',
      phoneNumber: '+58 414 9876543',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isBotActive: false,
      unreadCount: 2,
      lastMessage: 'Could you give me a personalized quote for 10 users?',
      lastMessageTimestamp: '11:15 AM',
      messages: [
        {
          id: '3',
          sender: 'customer',
          text: 'I would like to speak with a human agent.',
          timestamp: '11:10 AM',
        },
        {
          id: '4',
          sender: 'agent',
          text: 'Hello María, my name is Alex. How can I assist you today?',
          timestamp: '11:12 AM',
        },
        {
          id: '5',
          sender: 'customer',
          text: 'Could you give me a personalized quote for 10 users?',
          timestamp: '11:15 AM',
        },
      ],
    },
    {
      id: 'conv-3',
      contactName: 'Juan Pérez',
      phoneNumber: '+58 424 5551234',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      isBotActive: true,
      unreadCount: 1,
      lastMessage: 'menu',
      lastMessageTimestamp: '11:30 AM',
      messages: [{ id: '6', sender: 'customer', text: 'menu', timestamp: '11:30 AM' }],
    },
  ]);

  // ID de la conversación activa seleccionada
  selectedId = signal<string>('conv-1');

  // Filtro activo: 'all' | 'bot' | 'human'
  activeFilter = signal<'all' | 'bot' | 'human'>('all');

  // Búsqueda
  searchQuery = signal<string>('');

  // Mensaje que escribe el operador en el input inferior
  newMessageText = '';

  // Conversación actualmente seleccionada
  selectedConversation = computed(() => {
    return this.conversations().find((c) => c.id === this.selectedId()) ?? null;
  });

  // Lista filtrada según búsqueda y filtro
  filteredConversations = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const filter = this.activeFilter();
    let list = this.conversations();

    if (filter === 'bot') {
      list = list.filter((c) => c.isBotActive);
    } else if (filter === 'human') {
      list = list.filter((c) => !c.isBotActive);
    }

    if (query) {
      list = list.filter(
        (c) => c.contactName.toLowerCase().includes(query) || c.phoneNumber.includes(query),
      );
    }

    return list;
  });

  // Seleccionar conversación
  selectConversation(id: string) {
    this.selectedId.set(id);
  }

  // Alternar estado del bot para el chat activo
  toggleBotStatus() {
    const current = this.selectedConversation();
    if (!current) return;

    this.conversations.update((list) =>
      list.map((c) => (c.id === current.id ? { ...c, isBotActive: !c.isBotActive } : c)),
    );
  }

  // Enviar mensaje simulado como operador humano
  sendMessage() {
    const text = this.newMessageText.trim();
    const current = this.selectedConversation();
    if (!text || !current) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'agent',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.conversations.update((list) =>
      list.map((c) => {
        if (c.id === current.id) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTimestamp: newMsg.timestamp,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      }),
    );

    this.newMessageText = '';
  }
}
