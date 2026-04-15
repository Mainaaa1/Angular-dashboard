import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="sidebar-toggle" (click)="onToggleSidebar()">
          <span class="icon">☰</span>
        </button>
        <h1 class="logo">Dashboard</h1>
      </div>

      <div class="header-center">
        <div class="search-bar">
          <input type="text" placeholder="Search..." class="search-input">
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <div class="header-right">
        <button class="icon-btn" title="Notifications">
          <span class="notification-icon">🔔</span>
          <span class="notification-badge">3</span>
        </button>
        
        <button class="icon-btn" title="Settings">
          <span class="settings-icon">⚙️</span>
        </button>

        <div class="user-menu">
          <button class="user-btn" (click)="toggleUserMenu()">
            <img [src]="user()?.avatar || 'https://via.placeholder.com/32'" alt="User" class="user-avatar">
            <span class="user-name">{{ user()?.name }}</span>
            <span class="dropdown-icon">▼</span>
          </button>
          
          <div class="dropdown-menu" *ngIf="isUserMenuOpen()">
            <a href="#" class="dropdown-item">Profile</a>
            <a href="#" class="dropdown-item">Settings</a>
            <hr class="dropdown-divider">
            <button class="dropdown-item logout-btn" (click)="onLogout()">Logout</button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
      gap: 2rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 200px;
    }

    .sidebar-toggle {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 0.5rem 0.75rem;
      font-size: 1.25rem;
      cursor: pointer;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      display: none;
    }

    .sidebar-toggle:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .logo {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .header-center {
      flex: 1;
      max-width: 400px;
    }

    .search-bar {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 2.5rem 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 0.9rem;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .search-icon {
      position: absolute;
      right: 0.75rem;
      opacity: 0.7;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .icon-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 0.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1.25rem;
      transition: all 0.3s ease;
      position: relative;
    }

    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .notification-badge {
      position: absolute;
      top: -0.5rem;
      right: -0.5rem;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .user-menu {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 0.25rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .user-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.5);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 180px;
      margin-top: 0.5rem;
      z-index: 1001;
    }

    .dropdown-item {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      color: #333;
      transition: all 0.2s ease;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .dropdown-item:hover {
      background: #f3f4f6;
    }

    .logout-btn {
      color: #ef4444;
    }

    .dropdown-divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 0;
    }

    @media (max-width: 768px) {
      .header {
        padding: 1rem;
        gap: 1rem;
      }

      .sidebar-toggle {
        display: block;
      }

      .header-center {
        display: none;
      }

      .user-name,
      .dropdown-icon {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  get user() {
    return this.auth.user;
  }

  readonly isUserMenuOpen = signal(false);

  toggleSidebar = output<void>();

  constructor(private auth: AuthService) {}

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(v => !v);
  }

  onLogout(): void {
    this.auth.logout();
  }
}
