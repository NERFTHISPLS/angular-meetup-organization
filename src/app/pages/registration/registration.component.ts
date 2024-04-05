import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '../../shared/services/user.service';

import { FetchError, RegistrationUserData } from '../../shared/interfaces/user';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnDestroy {
  private formBuilder = inject(FormBuilder);
  private location = inject(Location);
  private userService = inject(UserService);
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);

  private registrationSubscription: Subscription | null = null;

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

    this.registrationSubscription = this.userService
      .registerUser(<RegistrationUserData>this.registrationForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['login']);
        },

        error: (error: FetchError) => {
          console.error(error);

          if (error.status === 0) {
            this.errorMessage = 'Что-то пошло не так';
          } else if (!Array.isArray(error.error)) {
            this.errorMessage = error.error.message;
          }

          this.changeDetector.detectChanges();
        },
      });
  }

  public routerReturnBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.registrationSubscription) {
      this.registrationSubscription.unsubscribe();
    }
  }
}
