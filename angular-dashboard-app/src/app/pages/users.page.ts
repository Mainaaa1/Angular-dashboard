import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table.component';
import { User } from '../../core/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  template: `
    <div class="users-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">User Management</h1>
          <p class="page-subtitle">Manage and monitor all system users</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">➕ Add User</button>
      </div>

      <div class="filters-bar">
        <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Search users..." class="search-input">
        <select [(ngModel)]="roleFilter" (change)="onRoleFilterChange()" class="filter-select">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="user">User</option>
        </select>
        <select [(ngModel)]="statusFilter" (change)="onStatusFilterChange()" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <app-data-table 
        [columns]="tableColumns"
        [data]="displayedUsers()"
        [pagination]="paginationData()"
        (onEdit)="openEditModal(\$event)"
        (onDelete)="deleteUser(\$event)"
        (onNextPage)="goToNextPage()"
        (onPreviousPage)="goToPreviousPage()">
      </app-data-table>

      <!-- Create/Edit Modal -->
      <div *ngIf="isModalOpen()" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="\$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingUser() ? 'Edit User' : 'Add New User' }}</h2>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>

          <form class="modal-body" (ngSubmit)="saveUser()">
            <div class="form-group">
              <label>Name</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required class="form-input">
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="formData.email" name="email" required class="form-input">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Role</label>
                <select [(ngModel)]="formData.role" name="role" class="form-input">
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
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
              <button type="submit" class="btn btn-primary">{{ editingUser() ? 'Update' : 'Create' }} User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-page {
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
export class UsersComponent implements OnInit {
  readonly tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'role', label: 'Role', type: 'badge' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  readonly users = signal<User[]>([]);
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(10);
  readonly isModalOpen = signal(false);
  readonly editingUser = signal<User | null>(null);
  
  readonly displayedUsers = signal<User[]>([]);
  readonly paginationData = signal<any>(null);

  searchQuery = '';
  roleFilter = '';
  statusFilter = '';
  formData = {
    name: '',
    email: '',
    role: 'user' as const,
    status: 'active' as const
  };

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getUsers(this.currentPage(), this.itemsPerPage()).subscribe(response => {
      this.users.set(response.data);
      this.paginationData.set({
        page: response.page,
        limit: response.limit,
        total: response.total
      });
      this.applyFilters();
    });
  }

  private applyFilters(): void {
    let filtered = this.users();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
      );
    }

    if (this.roleFilter) {
      filtered = filtered.filter(u => u.role === this.roleFilter);
    }

    if (this.statusFilter) {
      filtered = filtered.filter(u => u.status === this.statusFilter);
    }

    this.displayedUsers.set(filtered);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onRoleFilterChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  openCreateModal(): void {
    this.editingUser.set(null);
    this.formData = { name: '', email: '', role: 'user', status: 'active' };
    this.isModalOpen.set(true);
  }

  openEditModal(user: User): void {
    this.editingUser.set(user);
    this.formData = { ...user };
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingUser.set(null);
  }

  saveUser(): void {
    if (!this.formData.name || !this.formData.email) {
      this.notificationService.error('Please fill in all required fields');
      return;
    }

    if (this.editingUser()) {
      this.userService.updateUser(this.editingUser()!.id, this.formData).subscribe(() => {
        this.notificationService.success('User updated successfully');
        this.closeModal();
        this.loadUsers();
      });
    } else {
      this.userService.createUser(this.formData).subscribe(() => {
        this.notificationService.success('User created successfully');
        this.closeModal();
        this.loadUsers();
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(\`Are you sure you want to delete \${user.name}?\`)) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.notificationService.success('User deleted successfully');
        this.loadUsers();
      });
    }
  }

  goToNextPage(): void {
    if (this.paginationData().page * this.paginationData().limit < this.paginationData().total) {
      this.currentPage.update(p => p + 1);
      this.loadUsers();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadUsers();
    }
  }
}
