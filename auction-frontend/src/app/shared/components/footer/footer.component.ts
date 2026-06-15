import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>O nas</h4>
          <p>System Aukcyjny - platforma do bezpiecznych aukcji online</p>
        </div>
        <div class="footer-section">
          <h4>Szybkie linki</h4>
          <ul>
            <li><a href="#auctions">Aukcje</a></li>
            <li><a href="#rules">Zasady</a></li>
            <li><a href="#contact">Kontakt</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Kontakt</h4>
          <p>Email: info@auctions.pl</p>
          <p>Tel: +48 123 456 789</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 System Aukcyjny. Wszystkie prawa zastrzeżone.</p>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background-color: #2c3e50;
      color: #ecf0f1;
      padding: 40px 0 20px 0;
      margin-top: 60px;
      border-top: 1px solid #34495e;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 30px;
    }

    .footer-section h4 {
      margin: 0 0 15px 0;
      color: #3498db;
      font-size: 1.1em;
    }

    .footer-section p {
      margin: 10px 0;
      line-height: 1.6;
      color: #bdc3c7;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section ul li {
      margin-bottom: 8px;
    }

    .footer-section a {
      color: #bdc3c7;
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-section a:hover {
      color: #3498db;
    }

    .footer-bottom {
      text-align: center;
      padding: 20px 0;
      border-top: 1px solid #34495e;
      color: #7f8c8d;
      font-size: 0.9em;
    }

    .footer-bottom p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .footer-section h4 {
        margin-top: 20px;
      }

      .footer-section ul li {
        margin-bottom: 5px;
      }
    }
  `]
})
export class FooterComponent {}
