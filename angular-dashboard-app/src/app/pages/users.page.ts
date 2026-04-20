import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '@core/services/user.service';
import { NotificationService } from '@core/services/notification.service';
import { DataTableComponent, TableColumn } from '@shared/components/data-table.component';
import { PaginatedResponse, User } from '@core/models';

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
        (onEdit)="openEditModal($event)"
        (onDelete)="deleteUser($event)"
        (onNextPage)="goToNextPage()"
        (onPreviousPage)="goToPreviousPage()">
      </app-data-table>

      <!-- Modal -->
      <div *ngIf="isModalOpen()" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
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
              <button type="submit" class="btn btn-primary">
                {{ editingUser() ? 'Update' : 'Create' }} User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-page { animation: fadeIn 0.3s ease-in; }

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
      margin: 0.5rem 0 0;
      color: #718096;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #4a5568;
    }

    .filters-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .search-input,
    .filter-select {
      padding: 0.75rem;
      border: 1px solid #cbd5e0;
      border-radius: 0.5rem;
      min-width: 180px;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal {
      background: white;
      border-radius: 0.75rem;
      width: 90%;
      max-width: 500px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-body {
      padding: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #cbd5e0;
      border-radius: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .filters-bar {
        flex-direction: column;
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
  readonly displayedUsers = signal<User[]>([]);
  readonly paginationData = signal<any>(null);
  readonly isModalOpen = signal(false);
  readonly editingUser = signal<User | null>(null);
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(10);

  searchQuery = '';
  roleFilter = '';
  statusFilter = '';

  formData: Omit<User, 'id' | 'createdAt'> = {
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  };

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getUsers(this.currentPage(), this.itemsPerPage())
      .subscribe((res: PaginatedResponse<User>) => {
        this.users.set(res.data);
        this.paginationData.set({
          page: res.page,
          limit: res.limit,
          total: res.total
        });
        this.applyFilters();
      });
  }

  private applyFilters(): void {
    let data = this.users();

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      data = data.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }

    if (this.roleFilter) {
      data = data.filter(u => u.role === this.roleFilter);
    }

    if (this.statusFilter) {
      data = data.filter(u => u.status === this.statusFilter);
    }

    this.displayedUsers.set(data);
  }

  onSearch(): void { this.applyFilters(); }
  onRoleFilterChange(): void { this.applyFilters(); }
  onStatusFilterChange(): void { this.applyFilters(); }

  openCreateModal(): void {
    this.editingUser.set(null);
    this.formData = { name: '', email: '', role: 'user', status: 'active' };
    this.isModalOpen.set(true);
  }

  openEditModal(user: User): void {
    this.editingUser.set(user);
    this.formData = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingUser.set(null);
  }

  saveUser(): void {
    if (!this.formData.name || !this.formData.email) {
      this.notificationService.error('Please fill required fields');
      return;
    }

    const payload: Omit<User, 'id' | 'createdAt'> = { ...this.formData };

    if (this.editingUser()) {
      this.userService.updateUser(this.editingUser()!.id, payload)
        .subscribe(() => {
          this.notificationService.success('User updated successfully');
          this.closeModal();
          this.loadUsers();
        });
    } else {
      this.userService.createUser(payload)
        .subscribe(() => {
          this.notificationService.success('User created successfully');
          this.closeModal();
          this.loadUsers();
        });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Delete ${user.name}?`)) {
      this.userService.deleteUser(user.id)
        .subscribe(() => {
          this.notificationService.success('User deleted');
          this.loadUsers();
        });
    }
  }

  goToNextPage(): void {
    const p = this.paginationData();
    if (p && p.page * p.limit < p.total) {
      this.currentPage.update(v => v + 1);
      this.loadUsers();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(v => v - 1);
      this.loadUsers();
    }
  }
}