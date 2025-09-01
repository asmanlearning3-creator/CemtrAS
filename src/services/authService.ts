import type { User } from '../types';

export class AuthService {
  // Simple name-based authentication
  static async authenticateWithName(name: string): Promise<User> {
    const userId = `user_${Date.now()}`;
    const user: User = {
      id: userId,
      name: name.trim(),
      isAuthenticated: true,
      entryDate: new Date()
    };

    // Save to localStorage for persistence
    this.saveCurrentUser(user);
    return user;
  }

  // Get current user from localStorage
  static getCurrentUser(): User | null {
    const userData = localStorage.getItem('cemtras_current_user');
    return userData ? JSON.parse(userData) : null;
  }

  // Save current user to localStorage
  static saveCurrentUser(user: User): void {
    localStorage.setItem('cemtras_current_user', JSON.stringify(user));
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem('cemtras_current_user');
  }

  // Validate name (minimum 2 characters)
  static isValidName(name: string): boolean {
    return name.trim().length >= 2;
  }
}