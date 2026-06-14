import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  private apiUrl = 'https://localhost:7185/api/users/login';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    if (!this.loginData.username || !this.loginData.password) {
      alert('Wprowadź login i hasło!');
      return;
    }

    this.http.post(this.apiUrl, this.loginData).subscribe({
      next: (response: any) => {
        localStorage.setItem('username', this.loginData.username);
        alert('Zalogowano pomyślnie!');
        this.router.navigate(['/auctions']);
      },
      error: (err: any) => {
        console.error(err);
        alert('Logowanie nie powiodło się. Sprawdź dane.');
      }
    });
  }
}