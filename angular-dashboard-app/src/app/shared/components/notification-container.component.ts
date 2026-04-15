import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, animate, style } from '@angular/animations';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div *ngFor="let notification of notificationService.notificationList()" 
           class="notification" 
           [class]="'notification-' + notification.type"
           [@slideIn]>
        <span class="notification-icon">{{ getIcon(notification.type) }}</span>
        <span class="notification-message">{{ notification.message }}</span>
        <button class="notification-close" (click)="notificationService.dismiss(notification.id)">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .notification {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 300px;
      max-width: 500px;
    }

    .notification-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .notification-message {
      flex: 1;
      font-size: 0.9rem;
    }

    .notification-close {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 1rem;
      padding: 0;
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }

    .notification-close:hover {
      opacity: 1;
    }

    .notification-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .notification-success .notification-close {
      color: white;
      opacity: 0.8;
    }

    .notification-error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .notification-error .notification-close {
      color: white;
      opacity: 0.8;
    }

    .notification-info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    .notification-info .notification-close {
      color: white;
      opacity: 0.8;
    }

    .notification-warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .notification-warning .notification-close {
      color: white;
      opacity: 0.8;
    }

    @media (max-width: 600px) {
      .notification-container {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
      }

      .notification {
        min-width: auto;
      }
    }
  `]
})
export class NotificationContainerComponent {
  constructor(readonly notificationService: NotificationService) {}

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      'success': '✓',
      'error': '✕',
      'info': 'ℹ',
      'warning': '⚠'
    };
    return icons[type] || 'ℹ';
  }
}
