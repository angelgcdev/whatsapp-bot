import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'bot-responses',
    pathMatch: 'full',
  },
  {
    path: 'bot-responses',
    loadComponent: () =>
      import('./features/bot-responses/pages/bot-responses-page/bot-responses-page.component').then(
        (m) => m.BotResponsesPageComponent,
      ),
  },
];
