import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BotResponse } from '../../models/bot-response.model';
import { LucidePencil, LucidePlus, LucideSave, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-bot-response-form',
  imports: [ReactiveFormsModule, LucidePlus, LucidePencil, LucideX, LucideSave],
  templateUrl: './bot-response-form.component.html',
  styleUrl: './bot-response-form.component.css',
})
export class BotResponseFormComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs
  readonly initialData = input<BotResponse | null>(null);
  readonly isSaving = input<boolean>(false);

  // Outputs
  readonly save = output<{ keyword: string; response: string; isActive: boolean }>();
  readonly cancel = output<void>();

  readonly form = this.fb.group({
    keyword: ['', [Validators.required, Validators.minLength(2)]],
    response: ['', [Validators.required]],
    isActive: [true],
  });

  constructor() {
    // Sincroniza el formulario cuando cambia initialData (modo edición vs creación)
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.setValue({
          keyword: data.keyword,
          response: data.response,
          isActive: data.isActive,
        });
      } else {
        this.form.reset({
          keyword: '',
          response: '',
          isActive: true,
        });
      }
    });
  }

  submitForm(): void {
    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    const { keyword, response, isActive } = this.form.getRawValue();
    if (!keyword || !response) return;

    this.save.emit({
      keyword,
      response,
      isActive: isActive ?? true,
    });
  }
}
