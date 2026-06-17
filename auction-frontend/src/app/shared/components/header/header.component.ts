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
        
        <!-- Logo z linkiem do strony głównej -->
        <div class="logo">
          <a routerLink="/auctions" class="logo-link">
            <img src="/LOGO_ALEDROGO.png" alt="Alledrogo" class="app-logo-img">
          </a>
        </div>

        <!-- Nawigacja -->
        <nav class="nav-menu">
          <a routerLink="/auctions" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Katalog Aukcji
          </a>
          <a routerLink="/add-auction" routerLinkActive="active" class="nav-link highlight-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Wystaw przedmiot
          </a>
        </nav>

        <!-- Sekcja Użytkownika -->
        <div class="auth-section">
          <ng-container *ngIf="currentUser; else guestTemplate">
            
            <div class="user-profile">
              <div class="user-avatar">
                {{ currentUser.username.charAt(0) | uppercase }}
              </div>
              <span class="user-info">{{ currentUser.username }}</span>
            </div>

            <button (click)="logout()" class="auth-btn logout-btn" title="Wyloguj się">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span class="btn-text">Wyloguj</span>
            </button>

          </ng-container>

          <ng-template #guestTemplate>
            <a routerLink="/login" class="auth-btn login-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
              Zaloguj się
            </a>
          </ng-template>
        </div>

      </div>
    </header>
  `,
  styles: [`
    /* Zmienne CSS dla spójności */
    :host {
      --color-primary: #15803d; /* Zgaszony, elegancki zielony pasujący do logo */
      --color-primary-light: #f0fdf4;
      --color-text-main: #1f2937;
      --color-text-muted: #6b7280;
      --color-border: #e5e7eb;
      --color-bg: #ffffff;
      --transition: all 0.2s ease-in-out;
    }

    .app-header {
      background-color: var(--color-bg);
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05); /* Bardzo delikatny, nowoczesny cień */
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .header-content {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      height: 72px; /* Stała, elegancka wysokość */
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 32px;
    }

    /* --- LOGO --- */
    .logo {
      display: flex;
      align-items: center;
    }
    
    .logo-link {
      display: flex;
      align-items: center;
      transition: opacity var(--transition);
    }

    .logo-link:hover {
      opacity: 0.85;
    }

    .app-logo-img {
      max-height: 85px; /* Idealna proporcja dla paska 72px */
      width: auto;
      display: block;
    }

    /* --- NAWIGACJA --- */
    .nav-menu {
      display: flex;
      gap: 12px;
      align-items: center;
      flex: 1; /* Pozwala nawigacji zająć wolną przestrzeń */
    }

    .nav-link {
      color: var(--color-text-muted);
      text-decoration: none;
      padding: 10px 16px;
      border-radius: 8px;
      transition: var(--transition);
      font-weight: 600;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-link svg {
      opacity: 0.7;
      transition: var(--transition);
    }

    .nav-link:hover {
      background-color: #f3f4f6;
      color: var(--color-text-main);
    }

    .nav-link:hover svg {
      opacity: 1;
    }

    .nav-link.active {
      color: var(--color-primary);
      background-color: var(--color-primary-light);
    }

    .nav-link.active svg {
      opacity: 1;
      stroke: var(--color-primary);
    }

    /* Wyróżniony link do wystawiania aukcji */
    .highlight-link {
      color: var(--color-text-main);
      border: 1px dashed var(--color-border);
    }
    .highlight-link:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background-color: transparent;
    }

    /* --- SEKCJA LOGOWANIA / UŻYTKOWNIKA --- */
    .auth-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 16px 6px 6px;
      background: #f9fafb;
      border: 1px solid var(--color-border);
      border-radius: 50px; /* Kapsułkowy kształt */
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background-color: var(--color-primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      box-shadow: 0 2px 4px rgba(21, 128, 61, 0.2);
    }

    .user-info {
      color: var(--color-text-main);
      font-weight: 600;
      font-size: 0.9rem;
    }

    .auth-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      border: none;
      cursor: pointer;
      transition: var(--transition);
      font-family: inherit;
    }

    .login-btn {
      background-color: var(--color-text-main);
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .login-btn:hover {
      background-color: #000000;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    }

    .logout-btn {
      background-color: white;
      color: var(--color-text-muted);
      border: 1px solid var(--color-border);
      padding: 10px 16px;
    }

    .logout-btn:hover {
      background-color: #fef2f2;
      color: #dc2626; /* Czerwony pojawia się dopiero po najechaniu */
      border-color: #fca5a5;
    }

    /* --- RWD (Tabelty i Telefony) --- */
    @media (max-width: 992px) {
      .btn-text { display: none; } /* Ukrywamy tekst wyloguj, zostaje ikona */
      .logout-btn { padding: 10px; }
      .nav-menu { flex: unset; }
    }

    @media (max-width: 768px) {
      .header-content {
        height: auto;
        flex-direction: column;
        padding: 16px;
        gap: 20px;
      }

      .nav-menu {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }

      .auth-section {
        width: 100%;
        justify-content: space-between;
        padding-top: 16px;
        border-top: 1px solid var(--color-border);
      }
      
      .btn-text { display: block; }
      .logout-btn { padding: 10px 20px; }
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