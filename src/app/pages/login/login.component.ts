import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);

  public wasJustRegistered = this.userService.wasJustRegistered;

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

    console.log(this.loginForm.value);
  }

  ngOnDestroy(): void {
    this.userService.wasJustRegistered = false;
  }
}
