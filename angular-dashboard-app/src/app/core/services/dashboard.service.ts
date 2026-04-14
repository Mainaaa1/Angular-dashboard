import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { DashboardMetrics, AnalyticsData, Product, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getMetrics(): Observable<DashboardMetrics> {
    const metrics: DashboardMetrics = {
      totalUsers: 1250,
      totalRevenue: 45680,
      totalOrders: 892,
      growthRate: 12.5,
      revenueChange: 8.2,
      usersChange: 5.3
    };
    return of(metrics).pipe(delay(300));
  }

  getRevenueChart(): Observable<AnalyticsData> {
    return of({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue',
        data: [4200, 3800, 5000, 6500, 5800, 7200, 6800, 8100, 7500, 8900, 8200, 9100],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
      }]
    }).pipe(delay(200));
  }

  getUsersChart(): Observable<AnalyticsData> {
    return of({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'New Users',
          data: [45, 52, 38, 61, 55, 48, 42],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true
        },
        {
          label: 'Active Users',
          data: [120, 155, 180, 200, 190, 175, 165],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true
        }
      ]
    }).pipe(delay(200));
  }

  getCategoryChart(): Observable<AnalyticsData> {
    return of({
      labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Other'],
      datasets: [{
        label: 'Sales by Category',
        data: [28, 22, 18, 15, 17],
        borderColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(139, 92, 246, 0.8)']
      }]
    }).pipe(delay(200));
  }

  getProducts(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Product>> {
    const products: Product[] = Array.from({ length: 50 }, (_, i) => ({
      id: `prod-${i + 1}`,
      name: `Product ${i + 1}`,
      category: ['Electronics', 'Clothing', 'Food'][Math.floor(Math.random() * 3)],
      price: Math.floor(Math.random() * 500) + 10,
      stock: Math.floor(Math.random() * 1000),
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      sales: Math.floor(Math.random() * 500),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }));

    const start = (page - 1) * limit;
    const end = start + limit;

    return of({
      data: products.slice(start, end),
      total: products.length,
      page,
      limit
    }).pipe(delay(300));
  }

  getRecentActivity(): Observable<any[]> {
    const activities = [
      { id: 1, user: 'John Doe', action: 'Created new product', timestamp: new Date(Date.now() - 5 * 60000), type: 'create' },
      { id: 2, user: 'Jane Smith', action: 'Updated user profile', timestamp: new Date(Date.now() - 15 * 60000), type: 'update' },
      { id: 3, user: 'Bob Johnson', action: 'Deleted old invoice', timestamp: new Date(Date.now() - 30 * 60000), type: 'delete' },
      { id: 4, user: 'Alice Brown', action: 'Exported sales report', timestamp: new Date(Date.now() - 45 * 60000), type: 'export' },
      { id: 5, user: 'Charlie Davis', action: 'Added new user', timestamp: new Date(Date.now() - 60 * 60000), type: 'create' }
    ];
    return of(activities).pipe(delay(200));
  }
}
