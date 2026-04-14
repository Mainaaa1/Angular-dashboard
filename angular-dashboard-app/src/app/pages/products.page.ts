import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../core/services/dashboard.service';
import { NotificationService } from '../../core/services/notification.service';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table.component';
import { Product } from '../../core/models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  template: `
    <div class="products-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Product Catalog</h1>
          <p class="page-subtitle">View and manage your product inventory</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">➕ Add Product</button>
      </div>

      <div class="filters-bar">
        <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Search products..." class="search-input">
        <select [(ngModel)]="categoryFilter" (change)="onCategoryFilterChange()" class="filter-select">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Books">Books</option>
        </select>
        <select [(ngModel)]="statusFilter" (change)="onStatusFilterChange()" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <app-data-table 
        [columns]="tableColumns"
        [data]="displayedProducts()"
        [pagination]="paginationData()"
        (onEdit)="openEditModal(\$event)"
        (onDelete)="deleteProduct(\$event)"
        (onNextPage)="goToNextPage()"
        (onPreviousPage)="goToPreviousPage()">
      </app-data-table>

      <!-- Create/Edit Modal -->
      <div *ngIf="isModalOpen()" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="\$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingProduct() ? 'Edit Product' : 'Add New Product' }}</h2>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>

          <form class="modal-body" (ngSubmit)="saveProduct()">
            <div class="form-group">
              <label>Product Name</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required class="form-input">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="formData.category" name="category" class="form-input">
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food">Food</option>
                  <option value="Books">Books</option>
                </select>
              </div>

              <div class="form-group">
                <label>Price ($)</label>
                <input type="number" [(ngModel)]="formData.price" name="price" required min="0" class="form-input">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Stock</label>
                <input type="number" [(ngModel)]="formData.stock" name="stock" required min="0" class="form-input">
              </div>

              <div class="form-group">
                <label>Status</label>
                <select [(ngModel)]="formData.status" name="status" class="form-input">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ editingProduct() ? 'Update' : 'Create' }} Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
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

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #4a5568;
    }

    .btn-secondary:hover {
      background: #cbd5e0;
    }

    .filters-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .search-input,
    .filter-select {
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e0;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      background: white;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
    }

    .search-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.2s ease-in;
    }

    .modal {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
      max-width: 500px;
      width: 90%;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #2d3748;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #718096;
      transition: color 0.2s ease;
    }

    .modal-close:hover {
      color: #2d3748;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group:last-child {
      margin-bottom: 0;
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
      padding: 0.75rem;
      border: 1px solid #cbd5e0;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .modal-footer {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding: 1.5rem;
      border-top: 1px solid #e2e8f0;
      background: #f7fafc;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 1rem;
      }

      .filters-bar {
        flex-direction: column;
      }

      .search-input,
      .filter-select {
        width: 100%;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .modal-footer {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  readonly tableColumns: TableColumn[] = [
    { key: 'name', label: 'Product Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'price', label: 'Price', type: 'text', format: (v) => \`$\${v}\` },
    { key: 'stock', label: 'Stock', type: 'text' },
    { key: 'sales', label: 'Sales', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  readonly products = signal<Product[]>([]);
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(10);
  readonly isModalOpen = signal(false);
  readonly editingProduct = signal<Product | null>(null);
  
  readonly displayedProducts = signal<Product[]>([]);
  readonly paginationData = signal<any>(null);

  searchQuery = '';
  categoryFilter = '';
  statusFilter = '';
  formData = {
    name: '',
    category: 'Electronics',
    price: 0,
    stock: 0,
    status: 'active' as const
  };

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.dashboardService.getProducts(this.currentPage(), this.itemsPerPage()).subscribe(response => {
      this.products.set(response.data);
      this.paginationData.set({
        page: response.page,
        limit: response.limit,
        total: response.total
      });
      this.applyFilters();
    });
  }

  private applyFilters(): void {
    let filtered = this.products();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
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

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryFilterChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

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
      this.notificationService.error('Please fill in all required fields correctly');
      return;
    }

    this.notificationService.success(
      \`Product \${this.editingProduct() ? 'updated' : 'created'} successfully\`
    );
    this.closeModal();
    this.loadProducts();
  }

  deleteProduct(product: Product): void {
    if (confirm(\`Are you sure you want to delete \${product.name}?\`)) {
      this.notificationService.success('Product deleted successfully');
      this.loadProducts();
    }
  }

  goToNextPage(): void {
    if (this.paginationData().page * this.paginationData().limit < this.paginationData().total) {
      this.currentPage.update(p => p + 1);
      this.loadProducts();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadProducts();
    }
  }
}
