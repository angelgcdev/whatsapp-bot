import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideBot,
  LucideLayoutDashboard,
  LucideMessageSquare,
  LucideMoon,
  LucideSun,
  LucideZap,
} from '@lucide/angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideBot,
    LucideMessageSquare,
    LucideZap,
    LucideLayoutDashboard,
    LucideSun,
    LucideMoon,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  readonly themeService = inject(ThemeService);
}
