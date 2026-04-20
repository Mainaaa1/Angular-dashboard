import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">

      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your account and preferences</p>
      </div>

      <!-- Grid Layout -->
      <div class="settings-grid">

        <!-- Profile -->
        <div class="card">
          <h3 class="card-title">Profile</h3>

          <div class="form-group">
            <label>Name</label>
            <input class="input" [value]="user()?.name" readonly>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input class="input" [value]="user()?.email" readonly>
          </div>

          <div class="form-group">
            <label>Role</label>
            <input class="input" [value]="user()?.role" readonly>
          </div>

          <button class="btn-secondary" (click)="showProfileEditNotification()">
            Edit Profile
          </button>
        </div>

        <!-- Notifications -->
        <div class="card">
          <h3 class="card-title">Notifications</h3>

          <div class="setting">
            <div>
              <p>Email Notifications</p>
              <small>Receive updates via email</small>
            </div>
            <label class="switch">
              <input type="checkbox" [(ngModel)]="settings.emailNotifications">
              <span></span>
            </label>
          </div>

          <div class="setting">
            <div>
              <p>Push Notifications</p>
              <small>Browser push alerts</small>
            </div>
            <label class="switch">
              <input type="checkbox" [(ngModel)]="settings.pushNotifications">
              <span></span>
            </label>
          </div>

          <button class="btn-primary" [disabled]="isSaving()" (click)="saveNotificationSettings()">
            <span *ngIf="!isSaving()">Save</span>
            <span *ngIf="isSaving()" class="spinner"></span>
          </button>
        </div>

        <!-- Appearance -->
        <div class="card">
          <h3 class="card-title">Appearance</h3>

          <div class="form-group">
            <label>Theme</label>
            <select [(ngModel)]="settings.theme" class="input">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div class="form-group">
            <label>Language</label>
            <select [(ngModel)]="settings.language" class="input">
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
          </div>

          <button class="btn-primary" (click)="saveAppearanceSettings()">
            Save Preferences
          </button>
        </div>

        <!-- Security -->
        <div class="card">
          <h3 class="card-title">Security</h3>

          <button class="btn-secondary" (click)="openChangePasswordModal()">
            Change Password
          </button>

          <button class="btn-secondary">
            Enable 2FA
          </button>
        </div>

        <!-- Danger Zone -->
        <div class="card danger">
          <h3 class="card-title">Danger Zone</h3>

          <button class="btn-danger" (click)="confirmDeleteAccount()">
            Delete Account
          </button>

          <button class="btn-danger outline" (click)="signOut()">
            Sign Out
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
    }

    .page-subtitle {
      color: #64748b;
      margin-bottom: 1.5rem;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .card {
      background: white;
      padding: 1.25rem;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
    }

    .input {
      width: 100%;
      padding: 0.6rem;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .btn-primary {
      background: #4f46e5;
      color: white;
      padding: 0.6rem;
      border-radius: 8px;
      border: none;
    }

    .btn-secondary {
      background: #e2e8f0;
      padding: 0.6rem;
      border-radius: 8px;
      border: none;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
      padding: 0.6rem;
      border-radius: 8px;
      border: none;
    }

    .btn-danger.outline {
      background: transparent;
      border: 1px solid #ef4444;
      color: #ef4444;
    }

    .danger {
      border-color: #fecaca;
      background: #fef2f2;
    }

    /* Toggle Switch */
    .switch {
      position: relative;
      width: 40px;
      height: 22px;
    }

    .switch input {
      display: none;
    }

    .switch span {
      position: absolute;
      inset: 0;
      background: #cbd5e1;
      border-radius: 999px;
      cursor: pointer;
    }

    .switch span::before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      left: 3px;
      top: 3px;
      background: white;
      border-radius: 50%;
      transition: 0.2s;
    }

    .switch input:checked + span {
      background: #4f46e5;
    }

    .switch input:checked + span::before {
      transform: translateX(18px);
    }

    .setting {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent {

  readonly isSaving = signal(false);

  get user() {
    return this.authService.user;
  }

  settings = {
    emailNotifications: true,
    pushNotifications: false,
    dailySummary: true,
    theme: 'light',
    language: 'en'
  };

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  saveNotificationSettings(): void {
    this.isSaving.set(true);

    setTimeout(() => {
      this.notificationService.success('Saved');
      this.isSaving.set(false);
    }, 800);
  }

  saveAppearanceSettings(): void {
    this.notificationService.success('Updated');
  }

  openChangePasswordModal(): void {
    this.notificationService.info('Coming soon');
  }

  showProfileEditNotification(): void {
    this.notificationService.info('Coming soon');
  }

  confirmDeleteAccount(): void {
    if (confirm('This cannot be undone')) {
      this.notificationService.success('Request sent');
    }
  }

  signOut(): void {
    this.authService.logout();
    this.notificationService.success('Signed out');
  }
}