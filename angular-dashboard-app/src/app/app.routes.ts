import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout.component';
import { LoginComponent } from './pages/login.page';
import { DashboardComponent } from './pages/dashboard.page';
import { UsersComponent } from './pages/users.page';
import { ProductsComponent } from './pages/products.page';
import { SettingsComponent } from './pages/settings.page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'analytics',
        component: DashboardComponent  // Reuse dashboard for analytics
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
