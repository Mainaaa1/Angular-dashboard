import { Component, output, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button
          class="sidebar-toggle"
          *ngIf="isMobile()"
          (click)="onToggleSidebar()"
        >
          ☰
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
          🔔
          <span class="notification-badge">3</span>
        </button>

        <button class="icon-btn" title="Settings">
          ⚙️
        </button>

        <div class="user-menu">
          <button class="user-btn" (click)="toggleUserMenu()">
            <img
              [src]="user()?.avatar ?? fallbackAvatar"
              class="user-avatar"
            />
            <span class="user-name">{{ user()?.name }}</span>
            <span class="dropdown-icon">▼</span>
          </button>

          <div class="dropdown-menu" *ngIf="isUserMenuOpen()">
            <a class="dropdown-item">Profile</a>
            <a class="dropdown-item">Settings</a>
            <hr class="dropdown-divider" />
            <button class="dropdown-item logout-btn" (click)="onLogout()">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: sticky;
      top: 0;
      z-index: 1000;
      gap: 2rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sidebar-toggle {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1.25rem;
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
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 2.5rem 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      background: rgba(255,255,255,0.2);
      color: white;
    }

    .search-icon {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .icon-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      padding: 0.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      position: relative;
    }

    .notification-badge {
      position: absolute;
      top: -0.4rem;
      right: -0.4rem;
      background: red;
      font-size: 0.7rem;
      width: 1.2rem;
      height: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .user-menu {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }

    .dropdown-menu {
      position: absolute;
      right: 0;
      top: 100%;
      background: white;
      color: black;
      border-radius: 0.5rem;
      margin-top: 0.5rem;
      min-width: 180px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .dropdown-item {
      display: block;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }

    .dropdown-item:hover {
      background: #f3f4f6;
    }

    .logout-btn {
      color: red;
    }

    /* MOBILE RULES */
    @media (max-width: 768px) {
      .header-center {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  readonly toggleSidebar = output<void>();
  readonly isUserMenuOpen = signal(false);
  readonly isMobile = signal(window.innerWidth < 768);

  readonly fallbackAvatar = 'https://via.placeholder.com/32';

  constructor(private auth: AuthService) {}

  readonly user = computed(() => this.auth.user?.());

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(v => !v);
  }

  onLogout(): void {
    this.isUserMenuOpen.set(false);
    this.auth.logout();
  }
}