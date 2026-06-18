import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };
  loading = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  onSubmit(): void {
    if (!this.loginData.username || !this.loginData.password) {
      this.error = 'Wprowadź login i hasło!';
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.login(this.loginData.username, this.loginData.password).subscribe({
      next: () => {
        this.router.navigate(['/auctions']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.error?.message || 'Logowanie nie powiodło się.';
        this.cdr.detectChanges();
      }
    });
  }
}