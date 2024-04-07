import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '../../shared/services/user.service';

import { FetchError, LoginUserData } from '../../shared/interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  public userService = inject(UserService);

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);

  private loginSubscription: Subscription | null = null;

  public errorMessage?: string;

  public loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public emailControl = this.loginForm.controls.email;
  public passwordControl = this.loginForm.controls.password;

  public submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    this.loginSubscription = this.userService
      .loginUser(<LoginUserData>this.loginForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },

        error: (error: FetchError) => {
          console.error(error);

          if (error.status === 0) {
            this.errorMessage = 'Отсутствует интернет-соединение';
          } else if (Array.isArray(error.error)) {
            this.errorMessage = error.error[0];
          } else {
            this.errorMessage = error.error.message;
          }

          this.changeDetector.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }

    this.userService.wasJustRegistered = false;
  }
}
