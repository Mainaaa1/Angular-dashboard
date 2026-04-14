import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';
import { NotificationContainerComponent } from './notification-container.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, NotificationContainerComponent],
  template: `
    <div class="layout-container">
      <app-header (toggleSidebar)="onToggleSidebar()"></app-header>
      
      <div class="layout-body">
        <app-sidebar [isOpen]="isSidebarOpen()"></app-sidebar>
        
        <main class="main-content" [class.sidebar-closed]="!isSidebarOpen()">
          <router-outlet></router-outlet>
        </main>
      </div>

      <app-notification-container></app-notification-container>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f7fafc;
    }

    .layout-body {
      display: flex;
      flex: 1;
      position: relative;
    }

    .main-content {
      flex: 1;
      margin-left: 250px;
      padding: 2rem;
      overflow-y: auto;
      transition: margin-left 0.3s ease;
    }

    .main-content.sidebar-closed {
      margin-left: 0;
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        padding: 1rem;
      }
    }
  `]
})
export class LayoutComponent {
  readonly isSidebarOpen = signal(true);

  onToggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }
}
