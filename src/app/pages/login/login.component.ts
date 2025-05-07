import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  loginError = '';
  isRegisterMode = false;
  userName!: string;
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  loadUserName(): string {
    const token = this.auth.getToken();
    console.log("token", token);
    if (!token) return 'Anonimo';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    if (this.isRegisterMode) {
      const { username, email, password } = this.registerForm.value;
      this.auth.register({ username, email, password }).subscribe({
        next: () => {
          this.isRegisterMode = false;
          this.loginForm.reset();
          this.loading = false;
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { message: 'Usuario registrado con éxito', type: 'success' },
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: "success"
          });
        },
        error: () => {
          this.loading = false;
          this.loginError = 'No se pudo completar el registro. Intenta con otro email.';
        }
      });
    } else {
      const { email, password } = this.loginForm.value;
      this.auth.login({ email, password }).subscribe({
        next: () => {
          setTimeout(() => {
            this.loading = false;
            this.snackbar.openFromComponent(SnackbarComponent, {
              data: { message: `Bienvenido ${this.loadUserName()}`, type: 'info' },
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: "info"
            });
            this.router.navigate(['/user-panel'])
          }, 2000);
        },
        error: () => {
          this.loading = false;

          this.loginError = 'Error al iniciar sesión';
        }
      });
    }
  }


  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.loginError = '';
  }

  get form() {
    return this.isRegisterMode ? this.registerForm : this.loginForm;
  }
}
