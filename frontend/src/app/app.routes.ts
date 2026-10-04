import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'conversations',
    pathMatch: 'full',
  },
  {
    path: 'conversations',
    loadComponent: () =>
      import('./features/conversations/pages/conversations-page/conversations-page.component').then(
        (m) => m.ConversationsPageComponent,
      ),
  },
  {
    path: 'bot-responses',
    loadComponent: () =>
      import('./features/bot-responses/pages/bot-responses-page/bot-responses-page.component').then(
        (m) => m.BotResponsesPageComponent,
      ),
  },
];
