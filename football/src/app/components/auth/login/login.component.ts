import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = null;

    console.log('Tentative de connexion avec:', this.email);

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Connexion réussie, réponse:', response);
        this.router.navigate(['/players'])
          .then(() => console.log('Redirection effectuée'))
          .catch(err => console.error('Erreur de redirection:', err));
      },
      error: (err) => {
        console.error('Erreur de connexion:', err);
        this.errorMessage = err.error?.message ||
          err.statusText ||
          'Une erreur est survenue';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
