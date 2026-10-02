import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    // Comprobamos si el usuario guardó preferencia previa o prefiere dark mode en su SO
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

      this.isDarkMode.set(isDark);
      this.applyTheme(isDark);
    }
  }

  toggleTheme(): void {
    const nextState = !this.isDarkMode();
    this.isDarkMode.set(nextState);
    this.applyTheme(nextState);

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextState ? 'dark' : 'light');
    }
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
    }
  }
}
