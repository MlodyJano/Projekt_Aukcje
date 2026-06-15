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

  private apiUrl = 'http://localhost:5026/api/users';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    // POPRAWIONE: Używamy bezpośrednio wstrzykniętego HttpClient (this.http) zamiast nieistniejącego authService
    this.http.post(this.apiUrl, this.registerData).subscribe({
      next: (response: any) => {
        alert('Zarejestrowano pomyślnie!');
        // Po udanej rejestracji automatycznie przenosimy użytkownika do strony logowania
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.log('Pełny błąd z backendu:', err);
        
        // 1. Sprawdzamy, czy backend zwrócił automatyczne błędy walidacji z DTO (np. [StringLength], [EmailAddress])
        if (err.error && err.error.errors) {
          let errorMessages = '';
          
          for (const key in err.error.errors) {
            if (err.error.errors.hasOwnProperty(key)) {
              errorMessages += `${err.error.errors[key].join('\n')}\n`;
            }
          }
          alert(errorMessages); // Wyświetli np. "Hasło musi mieć minimum 6 znaków."
        } 
        // 2. Sprawdzamy, czy to nasz własny błąd rzucony ręcznie z kontrolera (np. zajęty login lub email)
        else if (err.error && err.error.message) {
          alert(err.error.message); // Wyświetli np. "Nazwa użytkownika jest już zajęta."
        } 
        // 3. Każdy inny błąd (np. brak połączenia z serwerem)
        else {
          alert('Rejestracja nie powiodła się: Wystąpił nieznany błąd.');
        }
      }
    });
  }
}