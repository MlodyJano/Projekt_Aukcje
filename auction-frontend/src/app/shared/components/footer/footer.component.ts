import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      
      <div class="footer-top">
        <div class="footer-container top-flex">
          <div class="newsletter-section">
            <h3 class="footer-heading">Bądź na bieżąco z okazjami</h3>
            <p class="footer-subtext">Zapisz się do newslettera i otrzymuj najlepsze oferty z Alledrogo.</p>
            <div class="newsletter-form">
              <input type="email" placeholder="Twój adres e-mail" class="newsletter-input">
              <button class="btn-primary">Zapisz się</button>
            </div>
          </div>
          
          <div class="social-section">
            <h3 class="footer-heading">Znajdź nas</h3>
              <div class="social-icons">
              <a href="https://www.facebook.com/spedess" target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.facebook.com/dawidportus777/" target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=100005124468266" target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.facebook.com/adam.purgal.7" target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-container bottom-flex">
          <p class="copyright">
            &copy; {{ currentYear }} Alledrogo - System Aukcyjny. Wszystkie prawa zastrzeżone.
          </p>
          <div class="trust-badges">
            <span class="badge"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Bezpieczne zakupy</span>
            <span class="badge"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Wsparcie 24/7</span>
          </div>
        </div>
      </div>

    </footer>
  `,
  styles: [`
    :host {
      --color-primary: #15803d;
      --color-primary-hover: #166534;
      --color-bg-dark: #111827;
      --color-bg-darker: #030712;
      --color-text-light: #f9fafb;
      --color-text-muted: #9ca3af;
      --color-border: #374151;
      --transition: all 0.3s ease;
    }

    .app-footer {
      background-color: var(--color-bg-dark);
      color: var(--color-text-light);
      margin-top: 80px;
      font-family: 'Inter', system-ui, sans-serif;
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* --- TOP FOOTER (Newsletter & Social) --- */
    .footer-top {
      padding: 48px 0;
    }

    .top-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 32px;
    }

    .footer-heading {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--color-text-light);
    }

    .footer-subtext {
      color: var(--color-text-muted);
      font-size: 0.9rem;
      margin: 0 0 16px 0;
    }

    .newsletter-form {
      display: flex;
      gap: 8px;
      max-width: 400px;
    }

    .newsletter-input {
      flex: 1;
      padding: 10px 16px;
      border-radius: 6px;
      border: 1px solid var(--color-border);
      background-color: #1f2937;
      color: white;
      outline: none;
      transition: var(--transition);
    }

    .newsletter-input:focus {
      border-color: var(--color-primary);
      background-color: #374151;
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-primary:hover {
      background-color: var(--color-primary-hover);
    }

    .social-icons {
      display: flex;
      gap: 16px;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #1f2937;
      color: var(--color-text-light);
      transition: var(--transition);
    }

    .social-link:hover {
      background-color: var(--color-primary);
      transform: translateY(-3px);
    }

    /* --- BOTTOM FOOTER (Copyright) --- */
    .footer-bottom {
      background-color: var(--color-bg-darker);
      padding: 24px 0;
      border-top: 1px solid var(--color-border);
    }

    .bottom-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .copyright {
      color: var(--color-text-muted);
      font-size: 0.85rem;
      margin: 0;
    }

    .trust-badges {
      display: flex;
      gap: 20px;
    }

    .badge {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--color-text-muted);
      font-size: 0.85rem;
    }

    /* --- RWD (Telefony i Tablety) --- */
    @media (max-width: 768px) {
      .top-flex {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .newsletter-section {
        width: 100%;
      }
      
      .newsletter-form {
        max-width: 100%;
        flex-direction: column;
      }
      
      .bottom-flex {
        flex-direction: column;
        text-align: center;
        justify-content: center;
      }
      
      .trust-badges {
        justify-content: center;
        width: 100%;
      }
    }
  `]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}