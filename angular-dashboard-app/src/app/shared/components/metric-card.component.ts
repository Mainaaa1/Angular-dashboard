import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metric-card">
      <div class="card-header">
        <h3 class="metric-title">{{ title }}</h3>
        <span class="metric-icon">{{ icon }}</span>
      </div>
      
      <div class="card-body">
        <div class="metric-value">{{ value }}</div>
        <div class="metric-change" [class.positive]="changePercentage > 0" [class.negative]="changePercentage < 0">
          <span class="change-arrow">{{ changePercentage > 0 ? '↑' : '↓' }}</span>
          <span class="change-text">{{ Math.abs(changePercentage) }}% vs last month</span>
        </div>
      </div>

      <div class="card-footer">
        <span class="footer-text">{{ subtitle }}</span>
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      padding: 1.5rem;
      transition: all 0.3s ease;
      border: 1px solid #e2e8f0;
    }

    .metric-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .metric-title {
      margin: 0;
      font-size: 0.9rem;
      color: #718096;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .metric-icon {
      font-size: 1.75rem;
      opacity: 0.8;
    }

    .card-body {
      margin-bottom: 1.5rem;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .metric-change {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .metric-change.positive {
      color: #10b981;
    }

    .metric-change.negative {
      color: #ef4444;
    }

    .card-footer {
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .footer-text {
      font-size: 0.8rem;
      color: #a0aec0;
    }
  `]
})
export class MetricCardComponent {
  title = 'Metric';
  icon = '📊';
  value = '0';
  subtitle = 'This month';
  changePercentage = 0;
  Math = Math;
}
