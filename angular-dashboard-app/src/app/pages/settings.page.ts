import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your preferences and account settings</p>
      </div>

      <div class="settings-container">
        <!-- Profile Settings -->
        <div class="settings-card">
          <div class="card-header">
            <h2 class="card-title">👤 Profile Settings</h2>
          </div>

          <form class="settings-form">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" value="{{ user()?.name || '' }}" class="form-input" readonly>
            </div>

            <div class="form-group">
              <label>Email Address</label>
              <input type="email" value="{{ user()?.email || '' }}" class="form-input" readonly>
            </div>

            <div class="form-group">
              <label>Role</label>
              <input type="text" [value]="(user()?.role || '').toUpperCase()" class="form-input" readonly>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="showProfileEditNotification()">Edit Profile</button>
            </div>
          </form>
        </div>

        <!-- Notification Preferences -->
        <div class="settings-card">
          <div class="card-header">
            <h2 class="card-title">🔔 Notifications</h2>
          </div>

          <div class="notification-settings">
            <div class="setting-item">
              <div class="setting-info">
                <p class="setting-label">Email Notifications</p>
                <p class="setting-description">Receive important updates via email</p>
              </div>
              <input type="checkbox" [(ngModel)]="settings.emailNotifications" class="toggle-input">
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <p class="setting-label">Push Notifications</p>
                <p class="setting-description">Receive push notifications</p>
              </div>
              <input type="checkbox" [(ngModel)]="settings.pushNotifications" class="toggle-input">
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <p class="setting-label">Daily Summary</p>
                <p class="setting-description">Get a daily summary of your activities</p>
              </div>
              <input type="checkbox" [(ngModel)]="settings.dailySummary" class="toggle-input">
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-primary" (click)="saveNotificationSettings()">Save Settings</button>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="settings-card">
          <div class="card-header">
            <h2 class="card-title">🔒 Security</h2>
          </div>

          <div class="security-settings">
            <div class="setting-item">
              <div class="setting-info">
                <p class="setting-label">Two-Factor Authentication</p>
                <p class="setting-description">Add an extra layer of security to your account</p>
              </div>
              <button class="btn btn-secondary btn-sm">Enable 2FA</button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <p class="setting-label">Change Password</p>
                <p class="setting-description">Update your password regularly</p>
              </div>
              <button class="btn btn-secondary btn-sm" (click)="openChangePasswordModal()">Change</button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <p class="setting-label">Active Sessions</p>
                <p class="setting-description">Manage your active sessions</p>
              </div>
              <button class="btn btn-secondary btn-sm">View Sessions</button>
            </div>
          </div>
        </div>

        <!-- Appearance Settings -->
        <div class="settings-card">
          <div class="card-header">
            <h2 class="card-title">🎨 Appearance</h2>
          </div>

          <div class="appearance-settings">
            <div class="form-group">
              <label>Theme</label>
              <select [(ngModel)]="settings.theme" class="form-input">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Language</label>
              <select [(ngModel)]="settings.language" class="form-input">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-primary" (click)="saveAppearanceSettings()">Save Preferences</button>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="settings-card danger-zone">
          <div class="card-header">
            <h2 class="card-title">⚠️ Danger Zone</h2>
          </div>

          <div class="danger-actions">
            <div class="danger-item">
              <div class="danger-info">
                <p class="danger-label">Delete Account</p>
                <p class="danger-description">Permanently delete your account and all associated data</p>
              </div>
              <button class="btn btn-danger" (click)="confirmDeleteAccount()">Delete</button>
            </div>

            <div class="danger-item">
              <div class="danger-info">
                <p class="danger-label">Sign Out</p>
                <p class="danger-description">Sign out from your account</p>
              </div>
              <button class="btn btn-danger" (click)="signOut()">Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: #2d3748;
    }

    .page-subtitle {
      margin: 0.5rem 0 0 0;
      color: #718096;
      font-size: 0.95rem;
    }

    .settings-container {
      display: grid;
      gap: 1.5rem;
      max-width: 700px;
    }

    .settings-card {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }

    .settings-card.danger-zone {
      border-color: #fee2e2;
      background: #fef2f2;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      background: #f7fafc;
    }

    .settings-card.danger-zone .card-header {
      background: #fee2e2;
    }

    .card-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #2d3748;
    }

    .settings-form {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group:last-child {
      margin-bottom: 0;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
      color: #4a5568;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e0;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      box-sizing: border-box;
      background: white;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #4a5568;
    }

    .btn-secondary:hover {
      background: #cbd5e0;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }

    .notification-settings,
    .security-settings,
    .danger-actions {
      padding: 1.5rem;
    }

    .setting-item,
    .danger-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      border-bottom: 1px solid #e2e8f0;
      gap: 1rem;
    }

    .settings-card.danger-zone .setting-item,
    .settings-card.danger-zone .danger-item {
      border-bottom-color: #fecaca;
    }

    .setting-item:last-child,
    .danger-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .setting-info,
    .danger-info {
      flex: 1;
    }

    .setting-label,
    .danger-label {
      margin: 0;
      font-weight: 600;
      color: #2d3748;
      font-size: 0.9rem;
    }

    .setting-description,
    .danger-description {
      margin: 0.25rem 0 0 0;
      color: #718096;
      font-size: 0.85rem;
    }

    .settings-card.danger-zone .danger-description {
      color: #b91c1c;
    }

    .toggle-input {
      width: 3rem;
      height: 1.5rem;
      cursor: pointer;
      flex-shrink: 0;
    }

    .appearance-settings {
      padding: 1.5rem;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 1.5rem;
      }

      .setting-item,
      .danger-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class SettingsComponent {
  readonly user = this.authService.user;

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
    this.notificationService.success('Notification preferences updated');
  }

  saveAppearanceSettings(): void {
    this.notificationService.success('Appearance settings updated');
  }

  openChangePasswordModal(): void {
    this.notificationService.info('Password change feature coming soon');
  }

  showProfileEditNotification(): void {
    this.notificationService.info('Profile editing feature coming soon');
  }

  confirmDeleteAccount(): void {
    if (confirm('Are you sure? This action cannot be undone.')) {
      this.notificationService.success('Account deletion request submitted');
    }
  }

  signOut(): void {
    this.authService.logout();
    this.notificationService.success('Signed out successfully');
  }
}
