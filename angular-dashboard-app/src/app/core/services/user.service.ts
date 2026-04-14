import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { User, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      avatar: 'https://via.placeholder.com/40/3b82f6/ffffff?text=JD',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'editor',
      status: 'active',
      avatar: 'https://via.placeholder.com/40/10b981/ffffff?text=JS',
      createdAt: new Date('2024-02-20')
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'user',
      status: 'inactive',
      avatar: 'https://via.placeholder.com/40/f59e0b/ffffff?text=BJ',
      createdAt: new Date('2024-03-10')
    }
  ];

  constructor(private http?: HttpClient) {}

  getUsers(page: number = 1, limit: number = 10): Observable<PaginatedResponse<User>> {
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return of({
      data: this.mockUsers.slice(start, end),
      total: this.mockUsers.length,
      page,
      limit
    }).pipe(delay(300));
  }

  getUserById(id: string): Observable<User | undefined> {
    return of(this.mockUsers.find(u => u.id === id)).pipe(delay(200));
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date()
    };
    this.mockUsers.push(newUser);
    return of(newUser).pipe(delay(300));
  }

  updateUser(id: string, updates: Partial<User>): Observable<User | undefined> {
    const userIndex = this.mockUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], ...updates };
      return of(this.mockUsers[userIndex]).pipe(delay(300));
    }
    return of(undefined).pipe(delay(300));
  }

  deleteUser(id: string): Observable<boolean> {
    const userIndex = this.mockUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      this.mockUsers.splice(userIndex, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
