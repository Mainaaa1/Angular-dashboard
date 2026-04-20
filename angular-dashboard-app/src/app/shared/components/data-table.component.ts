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
    <div class="table-wrapper">

      <div class="table-container">

        <table class="data-table">

          <thead>
            <tr>
              <th *ngFor="let column of columns()" [style.width]="column.width">
                {{ column.label }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let row of data(); let idx = index">

              <td *ngFor="let column of columns()" (click)="onRowClick.emit(row)">

                <!-- TEXT -->
                <span *ngIf="column.type === 'text'">
                  {{ row[column.key] }}
                </span>

                <!-- DATE -->
                <span *ngIf="column.type === 'date'">
                  {{ formatDate(row[column.key]) }}
                </span>

                <!-- BADGE -->
                <span
                  *ngIf="column.type === 'badge'"
                  class="badge"
                  [ngClass]="getBadgeClass(row[column.key])"
                >
                  {{ row[column.key] }}
                </span>

                <!-- ACTIONS -->
                <div *ngIf="column.type === 'actions'" class="actions">
                  <button class="btn-icon edit"
                          (click)="onEdit.emit(row); $event.stopPropagation()">
                    ✏
                  </button>

                  <button class="btn-icon delete"
                          (click)="onDelete.emit(row); $event.stopPropagation()">
                    🗑
                  </button>
                </div>

              </td>

            </tr>

            <tr *ngIf="data().length === 0">
              <td [attr.colspan]="columns().length" class="empty">
                No records found
              </td>
            </tr>

          </tbody>
        </table>

      </div>

      <!-- PAGINATION -->
      <div class="footer" *ngIf="pagination() as p">

        <div class="info">
          Showing {{ (p.page - 1) * p.limit + 1 }}
          to {{ Math.min(p.page * p.limit, p.total) }}
          of {{ p.total }}
        </div>

        <div class="pager">
          <button (click)="onPreviousPage.emit()" [disabled]="p.page === 1">
            Prev
          </button>

          <span>Page {{ p.page }}</span>

          <button
            (click)="onNextPage.emit()"
            [disabled]="p.page * p.limit >= p.total"
          >
            Next
          </button>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .table-wrapper {
      width: 100%;
    }

    .table-container {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 600px;
    }

    thead {
      position: sticky;
      top: 0;
      background: #f9fafb;
      z-index: 1;
    }

    th {
      text-align: left;
      padding: 14px;
      font-size: 12px;
      text-transform: uppercase;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
      letter-spacing: 0.05em;
    }

    td {
      padding: 14px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
      color: #374151;
      vertical-align: middle;
    }

    tr:hover td {
      background: #f9fafb;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      border: none;
      background: transparent;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      transition: 0.2s;
    }

    .btn-icon:hover {
      background: #f3f4f6;
    }

    .edit { color: #2563eb; }
    .delete { color: #dc2626; }

    .badge {
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }

    .b-active { background: #dcfce7; color: #166534; }
    .b-inactive { background: #fee2e2; color: #991b1b; }
    .b-admin { background: #ede9fe; color: #5b21b6; }
    .b-user { background: #e0f2fe; color: #075985; }
    .b-editor { background: #fff7ed; color: #9a3412; }

    .empty {
      text-align: center;
      padding: 30px;
      color: #9ca3af;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      flex-wrap: wrap;
      gap: 10px;
    }

    .pager {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .pager button {
      border: 1px solid #e5e7eb;
      background: white;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
    }

    .pager button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      td, th {
        padding: 10px;
        font-size: 13px;
      }

      .footer {
        flex-direction: column;
        align-items: flex-start;
      }
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

  getBadgeClass(value: string): string {
    if (!value) return '';
    return 'b-' + value.toString().toLowerCase().replace(/\s+/g, '');
  }

  formatDate(date: any): string {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return String(date);
    }
  }
}