import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AuthState, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly user = computed(() => this.authState().user);
  readonly token = computed(() => this.authState().token);

  login(email: string, password: string): Observable<AuthState> {
    // Simulate API call - replace with actual backend call
    const mockUser: User = {
      id: '1',
      name: 'Admin User',
      email: email,
      role: 'admin',
      status: 'active',
      avatar: 'https://via.placeholder.com/40',
      createdAt: new Date()
    };

    return of({
      isAuthenticated: true,
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now()
    }).pipe(delay(500));
  }

  logout(): void {
    this.authState.set({
      isAuthenticated: false,
      user: null,
      token: null
    });
    localStorage.removeItem('authToken');
  }

  setAuthState(state: AuthState): void {
    this.authState.set(state);
  }

  authenticate(token: string): void {
    const mockUser: User = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      avatar: 'https://via.placeholder.com/40',
      createdAt: new Date()
    };

    this.authState.set({
      isAuthenticated: true,
      user: mockUser,
      token: token
    });
  }
}
