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
      <div class="login-box">
        <div class="login-brand">
          <div class="brand-icon">📊</div>
          <h1 class="brand-name">Dashboard</h1>
        </div>

        <form (ngSubmit)="onLogin()" class="login-form">
          <h2 class="login-title">Welcome Back</h2>
          <p class="login-subtitle">Sign in to your account to continue</p>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="admin@example.com"
              required 
              class="form-input"
              [disabled]="isLoading()">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              type="password" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="••••••••"
              required 
              class="form-input"
              [disabled]="isLoading()">
          </div>

          <div class="form-group checkbox">
            <input type="checkbox" id="remember" [(ngModel)]="rememberMe" name="rememberMe" class="checkbox-input">
            <label for="remember">Remember me</label>
          </div>

          <button type="submit" class="btn btn-login" [disabled]="isLoading()">
            {{ isLoading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="login-footer">
          <p class="demo-note">Demo Credentials:<br>Email: any@email.com | Password: any</p>
        </div>
      </div>

      <div class="login-background">
        <div class="background-shape shape-1"></div>
        <div class="background-shape shape-2"></div>
        <div class="background-shape shape-3"></div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
    }

    .background-shape {
      position: absolute;
      opacity: 0.1;
      border-radius: 50%;
    }

    .shape-1 {
      width: 500px;
      height: 500px;
      background: white;
      top: -100px;
      left: -100px;
    }

    .shape-2 {
      width: 300px;
      height: 300px;
      background: white;
      bottom: -50px;
      right: 10%;
    }

    .shape-3 {
      width: 200px;
      height: 200px;
      background: white;
      top: 50%;
      right: -50px;
    }

    .login-box {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
      padding: 3rem;
      width: 100%;
      max-width: 420px;
      z-index: 10;
      animation: slideUp 0.5s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .login-brand {
      text-align: center;
      margin-bottom: 2rem;
    }

    .brand-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .brand-name {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d3748;
    }

    .login-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d3748;
      text-align: center;
    }

    .login-subtitle {
      margin: 0 0 1.5rem 0;
      color: #718096;
      text-align: center;
      font-size: 0.9rem;
    }

    .login-form {
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
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
      border: 2px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      box-sizing: border-box;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .form-input:disabled {
      background: #f7fafc;
      color: #a0aec0;
    }

    .checkbox {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    .checkbox-input {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .btn {
      width: 100%;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.95rem;
    }

    .btn-login {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .login-footer {
      text-align: center;
      font-size: 0.8rem;
      color: #a0aec0;
      background: #f7fafc;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px dashed #cbd5e0;
    }

    .demo-note {
      margin: 0;
      line-height: 1.6;
    }

    @media (max-width: 480px) {
      .login-box {
        padding: 2rem;
        margin: 1rem;
      }

      .login-title {
        font-size: 1.25rem;
      }

      .button-group {
        flex-direction: column;
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
    // If already authenticated, redirect to dashboard
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
