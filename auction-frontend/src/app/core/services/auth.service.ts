import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDto } from '../../shared/models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/users';
  private currentUserSubject = new BehaviorSubject<UserDto | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  login(username: string, password: string): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/login`, { username, password })
      .pipe(map(response => {
        if (response && response.id) {
          localStorage.setItem('userId', response.id.toString());
          localStorage.setItem('username', response.username);
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        }
        return response;
      }));
  }

  register(username: string, email: string, password: string): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}`, { username, email, password })
      .pipe(map(response => {
        if (response && response.id) {
          localStorage.setItem('userId', response.id.toString());
          localStorage.setItem('username', response.username);
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        }
        return response;
      }));
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  updateCurrentUser(user: UserDto): void {
    localStorage.setItem('username', user.username);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getUserFromStorage(): UserDto | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
}

