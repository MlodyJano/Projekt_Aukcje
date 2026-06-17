import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerData = {
    username: '',
    email: '',
    password: ''
  };
  loading = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
      this.error = 'Wypełnij wszystkie pola!';
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.register(this.registerData.username, this.registerData.email, this.registerData.password).subscribe({
      next: () => {
      this.loading = false;
      this.router.navigate(['/auctions']);
    },
      error: (err: any) => {
        this.loading = false;
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Rejestracja nie powiodła się.';
        }
        console.error(err);
      }
    });
  }
}
