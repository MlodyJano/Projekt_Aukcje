import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent { // <-- ZMIENIONE Z 'Login' NA 'LoginComponent'
  loginData = {
    username: '',
    password: ''
  };

  private apiUrl = 'http://localhost:5026/api/users/login';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    if (!this.loginData.username || !this.loginData.password) {
      alert('Wprowadź login i hasło!');
      return;
    }

    // Wysyłamy czyste dane z formularza (username i password pisane z małych liter)
    this.http.post(this.apiUrl, this.loginData).subscribe({
      next: (response: any) => {
        // Zapisujemy dane sesji użytkownika w pamięci podręcznej przeglądarki
        localStorage.setItem('username', response.username || this.loginData.username);
        if (response.id) {
          localStorage.setItem('userId', response.id.toString());
        }
        
        alert('Zalogowano pomyślnie!');
        this.router.navigate(['/auctions']).then(() => {
          window.location.reload(); // Odświeżenie strony, aby menu główne wykryło sesję
        });
      },
      error: (err: any) => {
        console.error(err);
        alert('Logowanie nie powiodło się. Sprawdź wpisane dane.');
      }
    });
  }
}