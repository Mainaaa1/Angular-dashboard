import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthState } from '@core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">

      <!-- Card -->
      <div class="login-box">

        <!-- Brand -->
        <div class="login-brand">
          <div class="brand-icon">📊</div>
          <h1 class="brand-name">Dashboard</h1>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onLogin()" class="login-form">
          <h2 class="login-title">Welcome back</h2>
          <p class="login-subtitle">Sign in to continue</p>

          <div class="form-group">
            <label>Email</label>
            <input 
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="you@example.com"
              required
              class="form-input"
              [disabled]="isLoading()"
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input 
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
              class="form-input"
              [disabled]="isLoading()"
            />
          </div>

          <div class="form-row">
            <label class="checkbox">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
              <span>Remember me</span>
            </label>

            <a class="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" class="btn-login" [disabled]="isLoading()">
            {{ isLoading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Footer -->
        <div class="login-footer">
          <p>Demo: any@email.com / any</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #f8fafc;
      padding: 1rem;
    }

    .login-box {
      width: 100%;
      max-width: 400px;
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid #e5e7eb;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      animation: fadeIn 0.4s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Brand */
    .login-brand {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .brand-icon {
      font-size: 2rem;
      margin-bottom: 0.25rem;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
    }

    /* Titles */
    .login-title {
      text-align: center;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: #1e293b;
    }

    .login-subtitle {
      text-align: center;
      font-size: 0.85rem;
      color: #64748b;
      margin-bottom: 1.5rem;
    }

    /* Form */
    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 0.4rem;
      color: #334155;
    }

    .form-input {
      width: 100%;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
    }

    .form-input:disabled {
      background: #f1f5f9;
    }

    /* Row */
    .form-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      margin: 0.75rem 0 1.25rem;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
    }

    .forgot-link {
      color: #4f46e5;
      cursor: pointer;
      text-decoration: none;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    /* Button */
    .btn-login {
      width: 100%;
      padding: 0.7rem;
      border-radius: 8px;
      border: none;
      background: #4f46e5;
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-login:hover:not(:disabled) {
      background: #4338ca;
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Footer */
    .login-footer {
      margin-top: 1.25rem;
      font-size: 0.75rem;
      text-align: center;
      color: #94a3b8;
      background: #f1f5f9;
      padding: 0.75rem;
      border-radius: 8px;
    }

    /* Mobile */
    @media (max-width: 480px) {
      .login-box {
        padding: 1.5rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  email = 'admin@example.com';
  password = 'demo';
  rememberMe = false;
  readonly isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.notificationService.error('Please enter email and password');
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: (authState: AuthState) => {
        this.authService.setAuthState(authState);
        this.notificationService.success('Welcome back!');
        this.router.navigate(['/dashboard']);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Invalid credentials');
        this.isLoading.set(false);
      }
    });
  }
}