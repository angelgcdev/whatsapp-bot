import { Component, inject, OnInit, signal } from '@angular/core';
import { BotResponsesService } from '../../services/bot-responses.service';
import { BotResponse } from '../../models/bot-response.model';
import { BotResponseFormComponent } from '../../components/bot-response-form/bot-response-form.component';
import { BotResponseTableComponent } from '../../components/bot-response-table/bot-response-table.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { LucideBot, LucideMoon, LucidePlus, LucideSun } from '@lucide/angular';

@Component({
  selector: 'app-bot-responses-page',
  imports: [
    BotResponseFormComponent,
    BotResponseTableComponent,
    LucideBot,
    LucidePlus,
    LucideSun,
    LucideMoon,
  ],
  templateUrl: './bot-responses-page.component.html',
  styleUrl: './bot-responses-page.component.css',
})
export class BotResponsesPageComponent implements OnInit {
  private readonly botResponsesService = inject(BotResponsesService);
  readonly themeService = inject(ThemeService);

  // Estados de datos
  readonly responses = signal<BotResponse[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  // Estados del formulario
  readonly isFormOpen = signal<boolean>(false);
  readonly selectedResponse = signal<BotResponse | null>(null);
  readonly isSaving = signal<boolean>(false);

  ngOnInit(): void {
    this.loadResponses();
  }

  loadResponses(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.botResponsesService.getAll().subscribe({
      next: (data) => {
        this.responses.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Failed to connect to backend server. Make sure NestJS is running on port 3000.',
        );
        this.isLoading.set(false);
      },
    });
  }

  openCreate(): void {
    this.selectedResponse.set(null);
    this.isFormOpen.set(true);
  }

  openEdit(item: BotResponse): void {
    this.selectedResponse.set(item);
    this.isFormOpen.set(true);
  }

  cancelForm(): void {
    this.isFormOpen.set(false);
    this.selectedResponse.set(null);
  }

  onSaveResponse(data: { keyword: string; response: string; isActive: boolean }): void {
    this.isSaving.set(true);
    const selected = this.selectedResponse();

    if (selected) {
      this.botResponsesService.update(selected.id, data).subscribe({
        next: (updatedResponse) => {
          this.responses.update((currentResponses) =>
            currentResponses.map((item) =>
              item.id === updatedResponse.id ? updatedResponse : item,
            ),
          );
          this.cancelForm();
          this.isSaving.set(false);
        },
        error: (err) => {
          alert(err.error?.message || 'Error updating bot response');
          this.isSaving.set(false);
        },
      });
    } else {
      this.botResponsesService.create(data).subscribe({
        next: (createdResponse) => {
          this.responses.update((currentResponses) => [createdResponse, ...currentResponses]);
          this.cancelForm();
          this.isSaving.set(false);
        },
        error: (err) => {
          alert(err.error?.message || 'Error creating bot response');
          this.isSaving.set(false);
        },
      });
    }
  }

  onDeleteResponse(item: BotResponse): void {
    const confirmed = confirm(
      `Are you sure you want to delete the trigger "${item.keyword}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    this.botResponsesService.delete(item.id).subscribe({
      next: () => {
        this.responses.update((currentResponses) =>
          currentResponses.filter((res) => res.id !== item.id),
        );
      },
      error: (err) => {
        alert(err.error?.message || 'Error deleting bot response');
      },
    });
  }
}
