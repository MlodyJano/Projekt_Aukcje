import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRegister } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Używamy względnego endpointu aby proxy deweloperskie przekazywało żądania do backendu
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  /**
   * Pobiera wszystkich użytkowników
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Pobiera użytkownika po ID
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Rejestruje nowego użytkownika
   */
  registerUser(user: UserRegister): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * Aktualizuje dane użytkownika
   */
  updateUser(id: number, user: UserRegister): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  /**
   * Usuwa użytkownika
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
