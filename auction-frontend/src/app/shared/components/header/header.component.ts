import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
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
          <a href="#" class="nav-link">
            👤 Profil
          </a>
          <a href="#" class="nav-link">
            📞 Kontakt
          </a>
        </nav>
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

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
      }

      .nav-menu {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class HeaderComponent {}
