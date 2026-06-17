import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserDto } from '../../models/user.dto';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <h1 class="app-title">🔨 System Aukcyjny</h1>
        </div>
        <nav class="nav-menu">
          <a routerLink="/auctions" routerLinkActive="active" class="nav-link">
            📋 Aukcje
          </a>
          <a routerLink="/add-auction" routerLinkActive="active" class="nav-link">
            ➕ Wystaw aukcję
          </a>
        </nav>
        <div class="auth-section">
          <span *ngIf="currentUser" class="user-info">
            👤 {{ currentUser.username }}
          </span>
          <button *ngIf="currentUser" (click)="logout()" class="auth-btn logout-btn">
            Wyloguj się
          </button>
          <a *ngIf="!currentUser" routerLink="/login" class="auth-btn login-btn">
            Zaloguj się
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background-color: #2c3e50;
      color: white;
      padding: 15px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5em;
      font-weight: bold;
    }

    .nav-menu {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .nav-link {
      color: #ecf0f1;
      text-decoration: none;
      padding: 8px 15px;
      border-radius: 4px;
      transition: all 0.3s;
      font-weight: 500;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .nav-link.active {
      background-color: #3498db;
      color: white;
    }

    .auth-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-info {
      color: #ecf0f1;
      font-weight: 500;
    }

    .auth-btn {
      padding: 8px 15px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
    }

    .login-btn {
      background-color: #27ae60;
      color: white;
    }

    .login-btn:hover {
      background-color: #229954;
    }

    .logout-btn {
      background-color: #e74c3c;
      color: white;
    }

    .logout-btn:hover {
      background-color: #c0392b;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
      }

      .nav-menu {
        width: 100%;
        justify-content: center;
      }

      .auth-section {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: UserDto | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

