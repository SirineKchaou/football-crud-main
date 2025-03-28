import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUser = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      email,
      password
    };

    return this.http.post<any>(
      `${this.apiUrl}/login_check`,
      body,
      { headers, observe: 'response' }
    ).pipe(
      tap(response => {
        if (response.body?.token) {
          this.handleLoginSuccess(response.body);
        }
      }),
      catchError(error => {
        return this.handleError(error);
      })
    );
  }


  register(email: string, password: string, username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password, username })
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser.asObservable();
  }

  private handleLoginSuccess(response: any): void {
    localStorage.setItem('auth_token', response.token);

    if (response.user) {
      localStorage.setItem('current_user', JSON.stringify(response.user));
      this.currentUser.next(response.user);
    }

    this.router.navigate(['/players']);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Full error:', error);

    let errorMessage = 'An error occurred';
    if (error.status === 401) {
      errorMessage = error.error?.message || 'Invalid email or password. Please try again.';
    } else if (error.status === 0) {
      errorMessage = 'Network error - please check your internet connection';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
