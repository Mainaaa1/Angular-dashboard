import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../core/services/dashboard.service';
import { NotificationService } from '../../core/services/notification.service';
import { MetricCardComponent } from '../../shared/components/metric-card.component';
import { DashboardMetrics, AnalyticsData } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, MetricCardComponent],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back! Here's what's happening with your business today.</p>
      </div>

      <!-- Metrics Row -->
      <div class="metrics-grid">
        <app-metric-card #card1 [attr.data-icon]="'📊'" [attr.data-title]="'Users'" 
          [attr.data-value]="(metrics()?.totalUsers || '0') + ''" 
          [attr.data-change]="(metrics()?.usersChange || 0) + ''">
        </app-metric-card>
        <app-metric-card #card2 [attr.data-icon]="'💰'" [attr.data-title]="'Revenue'" 
          [attr.data-value]="'$' + (metrics()?.totalRevenue || 0)" 
          [attr.data-change]="(metrics()?.revenueChange || 0) + ''">
        </app-metric-card>
        <app-metric-card #card3 [attr.data-icon]="'📦'" [attr.data-title]="'Orders'" 
          [attr.data-value]="(metrics()?.totalOrders || '0') + ''" 
          [attr.data-change]="'2.5'">
        </app-metric-card>
        <app-metric-card #card4 [attr.data-icon]="'📈'" [attr.data-title]="'Growth'" 
          [attr.data-value]="(metrics()?.growthRate || '0') + '%'" 
          [attr.data-change]="'1.8'">
        </app-metric-card>
      </div>

      <!-- Charts Row -->
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
          <canvas baseChart
            [type]="lineChartType"
            [data]="(revenueChartData() || emptyChart) as never"
            [options]="lineChartOptions"
            class="chart">
          </canvas>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">User Activity</h3>
          </div>
          <canvas baseChart
            [type]="lineChartType"
            [data]="(usersChartData() || emptyChart) as never"
            [options]="lineChartOptions"
            class="chart">
          </canvas>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Sales by Category</h3>
          </div>
          <canvas baseChart
            [type]="doughnutChartType"
            [data]="(categoryChartData() || emptyChart) as never"
            [options]="doughnutChartOptions"
            class="chart">
          </canvas>
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

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .chart-card,
    .activity-card {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      padding: 1.5rem;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .chart-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #2d3748;
    }

    .chart-select {
      padding: 0.5rem 1rem;
      border: 1px solid #cbd5e0;
      border-radius: 0.25rem;
      background: white;
      cursor: pointer;
      font-size: 0.85rem;
      color: #4a5568;
    }

    .chart-select:hover {
      border-color: #a0aec0;
    }

    .chart {
      max-height: 300px;
    }

    .activity-card {
      display: flex;
      flex-direction: column;
    }

    .activity-header {
      margin-bottom: 1.5rem;
    }

    .activity-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }

    .activity-item:hover {
      background: #edf2f7;
    }

    .activity-indicator {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .activity-create {
      background: #d1fae5;
      color: #065f46;
    }

    .activity-update {
      background: #bfdbfe;
      color: #1e3a8a;
    }

    .activity-delete {
      background: #fee2e2;
      color: #7f1d1d;
    }

    .activity-export {
      background: #fef3c7;
      color: #92400e;
    }

    .activity-content {
      flex: 1;
    }

    .activity-action {
      margin: 0;
      font-weight: 600;
      color: #2d3748;
      font-size: 0.9rem;
    }

    .activity-user {
      margin: 0.25rem 0 0 0;
      font-size: 0.8rem;
      color: #718096;
    }

    .activity-time {
      font-size: 0.75rem;
      color: #a0aec0;
      flex-shrink: 0;
    }

    @media (max-width: 1024px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  readonly metrics = signal<DashboardMetrics | null>(null);
  readonly revenueChartData = signal<AnalyticsData | null>(null);
  readonly usersChartData = signal<AnalyticsData | null>(null);
  readonly categoryChartData = signal<AnalyticsData | null>(null);
  readonly recentActivities = signal<any[]>([]);

  timeFrame = 'monthly';
  lineChartType: ChartType = 'line';
  doughnutChartType: ChartType = 'doughnut';

  emptyChart = {
    labels: [],
    datasets: []
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: { usePointStyle: true, padding: 15, font: { size: 12 } }
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getMetrics().subscribe(metrics => {
      this.metrics.set(metrics);
    });

    this.dashboardService.getRevenueChart().subscribe(data => {
      this.revenueChartData.set(data);
    });

    this.dashboardService.getUsersChart().subscribe(data => {
      this.usersChartData.set(data);
    });

    this.dashboardService.getCategoryChart().subscribe(data => {
      this.categoryChartData.set(data);
    });

    this.dashboardService.getRecentActivity().subscribe(activities => {
      this.recentActivities.set(activities);
    });
  }

  onTimeFrameChange(): void {
    this.notificationService.info(\`Showing \${this.timeFrame} data\`);
    // In a real app, this would reload data based on timeframe
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return \`\${diffInMinutes}m ago\`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return \`\${diffInHours}h ago\`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return \`\${diffInDays}d ago\`;
  }
}
