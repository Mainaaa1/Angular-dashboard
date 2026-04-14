import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  type?: 'text' | 'badge' | 'date' | 'actions';
  format?: (value: any) => string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table class="data-table">
        <thead class="table-header">
          <tr>
            <th *ngFor="let column of columns()" [style.width]="column.width">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr *ngFor="let row of data(); let idx = index" class="table-row" [class.clickable]="onRowClick.observers.length > 0">
            <td *ngFor="let column of columns()" [style.width]="column.width" (click)="onRowClick.emit(row)">
              <span *ngIf="column.type === 'text'" class="cell-content">
                {{ row[column.key] }}
              </span>
              <span *ngIf="column.type === 'date'" class="cell-content">
                {{ formatDate(row[column.key]) }}
              </span>
              <span *ngIf="column.type === 'badge'" [class]="'badge badge-' + row[column.key]">
                {{ row[column.key] }}
              </span>
              <span *ngIf="column.type === 'actions'" class="cell-actions">
                <button class="action-btn edit-btn" title="Edit" (click)="onEdit.emit(row); $event.stopPropagation()">
                  ✏️
                </button>
                <button class="action-btn delete-btn" title="Delete" (click)="onDelete.emit(row); $event.stopPropagation()">
                  🗑️
                </button>
              </span>
            </td>
          </tr>
          <tr *ngIf="data().length === 0" class="table-empty">
            <td [attr.colspan]="columns().length" class="empty-state">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer" *ngIf="pagination">
      <div class="pagination-info">
        Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to 
        {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }}
      </div>
      <div class="pagination">
        <button [disabled]="pagination.page === 1" (click)="onPreviousPage.emit()">← Previous</button>
        <span class="page-number">Page {{ pagination.page }}</span>
        <button [disabled]="pagination.page * pagination.limit >= pagination.total" (click)="onNextPage.emit()">Next →</button>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .table-header {
      background: #f7fafc;
      border-bottom: 2px solid #e2e8f0;
    }

    .table-header th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #4a5568;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .table-body tr {
      border-bottom: 1px solid #e2e8f0;
      transition: background-color 0.2s ease;
    }

    .table-body tr:hover {
      background-color: #f7fafc;
    }

    .table-row.clickable {
      cursor: pointer;
    }

    .table-body td {
      padding: 1rem;
      color: #4a5568;
      font-size: 0.9rem;
    }

    .cell-content {
      display: block;
    }

    .cell-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      font-size: 1rem;
      transition: all 0.2s ease;
      border-radius: 0.25rem;
    }

    .action-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .edit-btn {
      color: #3b82f6;
    }

    .delete-btn {
      color: #ef4444;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .badge-active,
    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-inactive {
      background: #fee2e2;
      color: #7f1d1d;
    }

    .badge-editor {
      background: #dbeafe;
      color: #1e3a8a;
    }

    .badge-admin {
      background: #fce7f3;
      color: #831843;
    }

    .badge-user {
      background: #f3e8ff;
      color: #4c1d95;
    }

    .table-empty {
      text-align: center;
    }

    .empty-state {
      padding: 2rem !important;
      color: #a0aec0;
      font-size: 0.95rem;
    }

    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-top: 1px solid #e2e8f0;
      background: #f7fafc;
    }

    .pagination-info {
      font-size: 0.85rem;
      color: #718096;
    }

    .pagination {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .pagination button {
      padding: 0.5rem 1rem;
      border: 1px solid #cbd5e0;
      background: white;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }

    .pagination button:hover:not(:disabled) {
      background: #edf2f7;
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-number {
      font-size: 0.85rem;
      color: #4a5568;
      font-weight: 600;
    }
  `]
})
export class DataTableComponent {
  columns = input<TableColumn[]>([]);
  data = input<any[]>([]);
  pagination = input<any>(null);

  onRowClick = output<any>();
  onEdit = output<any>();
  onDelete = output<any>();
  onNextPage = output<void>();
  onPreviousPage = output<void>();

  Math = Math;

  formatDate(date: any): string {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return date;
    }
  }
}
