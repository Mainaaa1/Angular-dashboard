import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '@core/services/dashboard.service';
import { NotificationService } from '@core/services/notification.service';
import { MetricCardComponent } from '@shared/components/metric-card.component';
import { DashboardMetrics } from '@core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MetricCardComponent],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      <!-- Metrics -->
      <div class="metrics-grid">
        <app-metric-card
          [attr.data-icon]="'📊'"
          [attr.data-title]="'Users'"
          [attr.data-value]="(metrics()?.totalUsers || 0) + ''"
          [attr.data-change]="(metrics()?.usersChange || 0) + ''"
        ></app-metric-card>

        <app-metric-card
          [attr.data-icon]="'💰'"
          [attr.data-title]="'Revenue'"
          [attr.data-value]="'$' + (metrics()?.totalRevenue || 0)"
          [attr.data-change]="(metrics()?.revenueChange || 0) + ''"
        ></app-metric-card>

        <app-metric-card
          [attr.data-icon]="'📦'"
          [attr.data-title]="'Orders'"
          [attr.data-value]="(metrics()?.totalOrders || 0) + ''"
          [attr.data-change]="'2.5'"
        ></app-metric-card>

        <app-metric-card
          [attr.data-icon]="'📈'"
          [attr.data-title]="'Growth'"
          [attr.data-value]="(metrics()?.growthRate || 0) + '%'"
          [attr.data-change]="'1.8'"
        ></app-metric-card>
      </div>

      <!-- Charts Row 1 -->
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Revenue Trend</h3>
            <select [(ngModel)]="timeFrame" (change)="onTimeFrameChange()" class="chart-select">
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div class="chart-placeholder">
            <div class="chart-bar" style="height: 40%"></div>
            <div class="chart-bar" style="height: 60%"></div>
            <div class="chart-bar" style="height: 80%"></div>
            <div class="chart-bar" style="height: 50%"></div>
            <div class="chart-bar" style="height: 70%"></div>
            <div class="chart-bar" style="height: 90%"></div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">User Activity</h3>
          </div>

          <div class="chart-placeholder line">
            <svg viewBox="0 0 300 150" class="line-chart">
              <polyline
                fill="none"
                stroke="#4f46e5"
                stroke-width="2"
                points="0,120 50,100 100,80 150,60 200,40 250,20 300,10"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Charts Row 2 -->
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Sales by Category</h3>
          </div>

          <div class="pie-wrapper"></div>
        </div>

        <div class="activity-card">
          <div class="activity-header">
            <h3 class="chart-title">Recent Activity</h3>
          </div>

          <div class="activity-list">
            <div *ngFor="let activity of recentActivities()" class="activity-item">
              <span class="activity-indicator" [class]="'activity-' + activity.type"></span>

              <div class="activity-content">
                <p class="activity-action">{{ activity.action }}</p>
                <p class="activity-user">by {{ activity.user }}</p>
              </div>

              <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a202c;
    }

    .page-subtitle {
      color: #64748b;
      font-size: 0.95rem;
      margin-top: 0.5rem;
    }

    /* Metrics */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    /* Charts */
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .chart-card,
    .activity-card {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      padding: 1.25rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: 0.2s;
    }

    .chart-card:hover,
    .activity-card:hover {
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .chart-title {
      font-size: 1rem;
      font-weight: 600;
    }

    .chart-select {
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
    }

    .chart-placeholder {
      height: 220px;
      display: flex;
      align-items: flex-end;
      gap: 8px;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
    }

    .chart-placeholder.line {
      align-items: center;
      justify-content: center;
    }

    .chart-bar {
      flex: 1;
      background: linear-gradient(180deg, #6366f1, #4f46e5);
      border-radius: 6px 6px 0 0;
    }

    .line-chart {
      width: 100%;
      height: 100%;
    }

    /* Pie */
    .pie-wrapper {
      width: 180px;
      height: 180px;
      margin: auto;
      border-radius: 50%;
      background: conic-gradient(
        #3b82f6 0% 28%,
        #10b981 28% 50%,
        #f59e0b 50% 68%,
        #ef4444 68% 83%,
        #8b5cf6 83% 100%
      );
    }

    /* Activity */
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 8px;
    }

    .activity-item:hover {
      background: #f1f5f9;
    }

    .activity-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .activity-create { background: #10b981; }
    .activity-update { background: #3b82f6; }
    .activity-delete { background: #ef4444; }
    .activity-export { background: #f59e0b; }

    .activity-content { flex: 1; }

    .activity-time {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .dashboard {
        padding: 1rem;
      }

      .chart-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .chart-select {
        width: 100%;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  readonly metrics = signal<DashboardMetrics | null>(null);
  readonly recentActivities = signal<any[]>([]);
  timeFrame = 'monthly';

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getMetrics().subscribe((metrics) => {
      this.metrics.set(metrics);
    });

    this.dashboardService.getRecentActivity().subscribe((activities) => {
      this.recentActivities.set(activities);
    });
  }

  onTimeFrameChange(): void {
    this.notificationService.info(`Showing ${this.timeFrame} data`);
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 60000);

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;

    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;

    return `${Math.floor(hours / 24)}d ago`;
  }
}