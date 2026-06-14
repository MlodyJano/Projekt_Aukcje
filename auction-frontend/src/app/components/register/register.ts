import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  private apiUrl = 'https://localhost:7185/api/users/register';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
      alert('Wszystkie pola są wymagane!');
      return;
    }

    this.http.post(this.apiUrl, this.registerData).subscribe({
      next: (response: any) => {
        alert('Konto zostało utworzone pomyślnie!');
        this.router.navigate(['/auctions']);
      },
      error: (err: any) => {
        console.error(err);
        alert('Rejestracja nie powiodła się: ' + (err.error?.message || err.statusText));
      }
    });
  }
}