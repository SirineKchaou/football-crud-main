import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  username: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.email, this.password, this.username).subscribe({
      next: (data) => {
        console.log('Registration successful', data);
        this.router.navigate(['/login']); // <-- Redirection vers /login
      },
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
