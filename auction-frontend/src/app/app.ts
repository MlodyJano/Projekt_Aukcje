import { Component } from '@angular/core';
<<<<<<< HEAD
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
=======
import { RouterOutlet, RouterLink } from '@angular/router';
>>>>>>> 116236605183957f39815e5bf995c8b4e803760a

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <app-header></app-header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      background-color: #f5f5f5;
      padding: 20px 0;
    }
  `]
})
export class App {}

=======
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}
>>>>>>> 116236605183957f39815e5bf995c8b4e803760a
