import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environments';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  role: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: LoginRequest): Observable<string> {
    return this.http.post(`${this.API_URL}/login`, credentials, { responseType: 'text' }).pipe(
      tap(token => {
        localStorage.setItem(this.TOKEN_KEY, token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp && payload.exp > now;
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiUrl}/profile`);
  }

  register(data: { username: string; email: string; password: string }) {
    return this.http.post(`${environment.apiUrl}/auth/register`, data, {
      responseType: 'text'
    });
  }
  
}
