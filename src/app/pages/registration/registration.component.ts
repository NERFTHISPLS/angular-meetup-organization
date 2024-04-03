import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { UserService } from '../../shared/services/user.service';
import {
  RegistrationError,
  RegistrationUserData,
} from '../../shared/interfaces/user';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  private formBuilder = inject(FormBuilder);
  private location = inject(Location);
  private userService = inject(UserService);
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);

  public registrationForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public firstNameControl = this.registrationForm.controls.firstName;
  public lastNameControl = this.registrationForm.controls.lastName;
  public emailControl = this.registrationForm.controls.email;
  public passwordControl = this.registrationForm.controls.password;

  public errorMessage?: string;

  public submitRegistation() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();

      return;
    }

    this.userService
      .registerUser(<RegistrationUserData>this.registrationForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['login']);
        },

        error: (error: RegistrationError) => {
          console.error(error);

          if (error.status === 0) {
            this.errorMessage = 'Отсутствует интернет-соединение';
          } else {
            this.errorMessage = error.error.message;
          }

          this.changeDetector.detectChanges();
        },
      });
  }

  public routerReturnBack() {
    this.location.back();
  }
}
