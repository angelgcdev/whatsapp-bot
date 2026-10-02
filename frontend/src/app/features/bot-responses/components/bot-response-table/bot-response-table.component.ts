import { Component, input, output } from '@angular/core';
import { BotResponse } from '../../models/bot-response.model';
import { LucideAlertCircle, LucideInbox, LucidePencil, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'app-bot-response-table',
  imports: [LucideAlertCircle, LucideInbox, LucidePencil, LucideTrash2],
  templateUrl: './bot-response-table.component.html',
  styleUrl: './bot-response-table.component.css',
})
export class BotResponseTableComponent {
  // Inputs reactivos
  readonly responses = input.required<BotResponse[]>();
  readonly isLoading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);

  // Outputs de eventos
  readonly edit = output<BotResponse>();
  readonly delete = output<BotResponse>();
  readonly retry = output<void>();
}
