import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Notification } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notifications = signal<Notification[]>([]);

  readonly notificationList = this.notifications.asReadonly();

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 4000): void {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      message,
      type,
      duration
    };

    this.notifications.update(current => [...current, notification]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(notification.id);
      }, duration);
    }
  }

  dismiss(id: string): void {
    this.notifications.update(current => current.filter(n => n.id !== id));
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration || 5000);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  clearAll(): void {
    this.notifications.set([]);
  }
}
