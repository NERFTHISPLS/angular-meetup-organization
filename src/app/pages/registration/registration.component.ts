import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  public isFormSubmitted = false;

  public submitRegistation() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();

      return;
    }

    console.log(this.registrationForm.controls);
  }

  public routerReturnBack() {
    this.location.back();
  }
}
