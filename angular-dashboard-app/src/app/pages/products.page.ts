import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardService } from '@core/services/dashboard.service';
import { NotificationService } from '@core/services/notification.service';

import { DataTableComponent, TableColumn } from '@shared/components/data-table.component';
import { Product, PaginatedResponse } from '@core/models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  template: `
    <div class="products-page">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Products</h1>
          <p class="page-subtitle">Manage your inventory</p>
        </div>

        <button class="btn-primary" (click)="openCreateModal()">
          Add Product
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <input 
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearch()"
          placeholder="Search products..."
          class="input"
        />

        <select [(ngModel)]="categoryFilter" (change)="onCategoryFilterChange()" class="input">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Books">Books</option>
        </select>

        <select [(ngModel)]="statusFilter" (change)="onStatusFilterChange()" class="input">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <!-- Table -->
      <app-data-table 
        [columns]="tableColumns"
        [data]="displayedProducts()"
        [pagination]="paginationData()"
        (onEdit)="openEditModal($event)"
        (onDelete)="deleteProduct($event)"
        (onNextPage)="goToNextPage()"
        (onPreviousPage)="goToPreviousPage()">
      </app-data-table>

      <!-- Modal -->
      <div *ngIf="isModalOpen()" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">

          <div class="modal-header">
            <h2>{{ editingProduct() ? 'Edit Product' : 'New Product' }}</h2>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>

          <form class="modal-body" (ngSubmit)="saveProduct()">

            <div class="form-group">
              <label>Product Name</label>
              <input [(ngModel)]="formData.name" name="name" required class="input">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="formData.category" name="category" class="input">
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Food</option>
                  <option>Books</option>
                </select>
              </div>

              <div class="form-group">
                <label>Price</label>
                <input type="number" [(ngModel)]="formData.price" name="price" class="input">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Stock</label>
                <input type="number" [(ngModel)]="formData.stock" name="stock" class="input">
              </div>

              <div class="form-group">
                <label>Status</label>
                <select [(ngModel)]="formData.status" name="status" class="input">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="closeModal()">Cancel</button>

              <button type="submit" class="btn-primary" [disabled]="isSaving()">
                <span class="btn-content">
                  <span *ngIf="!isSaving()">Save</span>
                  <span *ngIf="isSaving()" class="spinner"></span>
                  <span *ngIf="isSaving()">Saving...</span>
                </span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .page-subtitle {
      font-size: 0.9rem;
      color: #64748b;
    }

    .input {
      padding: 0.6rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.9rem;
      width: 100%;
    }

    .input:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
    }

    .filters-bar {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .btn-primary {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      cursor: pointer;
    }

    .btn-secondary {
      background: #e2e8f0;
      border: none;
      padding: 0.6rem 1rem;
      border-radius: 8px;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: grid;
      place-items: center;
    }

    .modal {
      width: 100%;
      max-width: 480px;
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }

    .modal-header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
    }

    .modal-body {
      padding: 1.25rem;
    }

    .modal-footer {
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .filters-bar {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {

  readonly products = signal<Product[]>([]);
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(10);
  readonly isModalOpen = signal(false);
  readonly editingProduct = signal<Product | null>(null);
  readonly displayedProducts = signal<Product[]>([]);
  readonly paginationData = signal<any>(null);
  readonly isSaving = signal(false);

  searchQuery = '';
  categoryFilter = '';
  statusFilter = '';

  formData = {
    name: '',
    category: 'Electronics',
    price: 0,
    stock: 0,
    status: 'active' as 'active' | 'inactive'
  };

  readonly tableColumns: TableColumn[] = [
    { key: 'name', label: 'Product Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'price', label: 'Price', type: 'text', format: (v: any) => `$${v}` },
    { key: 'stock', label: 'Stock', type: 'text' },
    { key: 'sales', label: 'Sales', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.dashboardService.getProducts(this.currentPage(), this.itemsPerPage())
      .subscribe((res: PaginatedResponse<Product>) => {
        this.products.set(res.data);
        this.paginationData.set(res);
        this.applyFilters();
      });
  }

  private applyFilters(): void {
    let filtered = this.products();

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (this.categoryFilter) {
      filtered = filtered.filter(p => p.category === this.categoryFilter);
    }

    if (this.statusFilter) {
      filtered = filtered.filter(p => p.status === this.statusFilter);
    }

    this.displayedProducts.set(filtered);
  }

  onSearch() { this.applyFilters(); }
  onCategoryFilterChange() { this.applyFilters(); }
  onStatusFilterChange() { this.applyFilters(); }

  openCreateModal(): void {
    this.editingProduct.set(null);
    this.formData = { name: '', category: 'Electronics', price: 0, stock: 0, status: 'active' };
    this.isModalOpen.set(true);
  }

  openEditModal(product: Product): void {
    this.editingProduct.set(product);
    this.formData = { ...product };
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingProduct.set(null);
  }

  saveProduct(): void {
    if (!this.formData.name || this.formData.price <= 0) {
      this.notificationService.error('Invalid input');
      return;
    }

    this.isSaving.set(true);

    setTimeout(() => {
      this.notificationService.success('Saved successfully');
      this.isSaving.set(false);
      this.closeModal();
      this.loadProducts();
    }, 800);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Delete ${product.name}?`)) {
      this.notificationService.success('Deleted');
      this.loadProducts();
    }
  }

  goToNextPage(): void {
    this.currentPage.update(p => p + 1);
    this.loadProducts();
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadProducts();
    }
  }
}