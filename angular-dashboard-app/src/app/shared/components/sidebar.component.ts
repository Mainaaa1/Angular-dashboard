import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [@slideInOut]>
      <nav class="nav">
        <div class="nav-section">
          <div class="nav-header">Main</div>
          <div class="nav-items">
            <a *ngFor="let item of navItems" 
               [routerLink]="item.route" 
               routerLinkActive="active"
               [routerLinkActiveOptions]="{ exact: false }"
               class="nav-item">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
              <span *ngIf="item.badge" class="nav-badge">{{ item.badge }}</span>
            </a>
          </div>
        </div>

        <div class="nav-section">
          <div class="nav-header">Management</div>
          <div class="nav-items">
            <a routerLink="/users" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👥</span>
              <span class="nav-label">Users</span>
            </a>
            <a routerLink="/products" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📦</span>
              <span class="nav-label">Products</span>
            </a>
            <a routerLink="/settings" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">⚙️</span>
              <span class="nav-label">Settings</span>
            </a>
          </div>
        </div>

        <div class="nav-section">
          <div class="nav-header">Analytics</div>
          <div class="nav-items">
            <a routerLink="/analytics" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📊</span>
              <span class="nav-label">Reports</span>
            </a>
            <a routerLink="/logs" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📝</span>
              <span class="nav-label">Logs</span>
            </a>
          </div>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="version-badge">v1.0.0</div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: linear-gradient(180deg, #2d3748 0%, #1a202c 100%);
      color: #e2e8f0;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 3.5rem;
      height: calc(100vh - 3.5rem);
      overflow-y: auto;
      z-index: 999;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    }

    .nav {
      flex: 1;
      padding: 1.5rem 0;
    }

    .nav-section {
      padding: 0 1rem 1.5rem;
    }

    .nav-header {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #a0aec0;
      margin-bottom: 0.75rem;
      letter-spacing: 0.05em;
    }

    .nav-items {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      color: #cbd5e0;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      position: relative;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-item.active {
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, transparent 100%);
      color: #667eea;
      border-left-color: #667eea;
      font-weight: 600;
    }

    .nav-icon {
      font-size: 1.25rem;
      min-width: 1.5rem;
    }

    .nav-label {
      flex: 1;
      font-size: 0.95rem;
    }

    .nav-badge {
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .sidebar-footer {
      padding: 1.5rem 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .version-badge {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      text-align: center;
      color: #a0aec0;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .sidebar.open {
        transform: translateX(0);
      }
    }
  `],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class SidebarComponent {
  isOpen = input(true);

  navItems: NavItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/dashboard' },
    { icon: '📈', label: 'Analytics', route: '/analytics', badge: 3 }
  ];
}
