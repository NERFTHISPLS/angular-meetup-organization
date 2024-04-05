import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MeetupService } from '../../shared/services/meetup.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { MeetupCreateOptions } from '../../shared/interfaces/meetup';

@Component({
  selector: 'app-meetup-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './meetup-form.component.html',
  styleUrl: './meetup-form.component.scss',
})
export class MeetupFormComponent {
  private meetupService = inject(MeetupService);
  private location = inject(Location);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  public meetupCreationForm = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required]],
      date: ['', [Validators.required, this.dateValidator]],
      time: ['', [Validators.required]],
      duration: [
        90,
        [Validators.required, Validators.min(15), Validators.max(120)],
      ],
      location: ['', [Validators.required]],
      description: ['', [Validators.required]],
      targetAudience: [''],
      needToKnow: [''],
      willHappen: [''],
      reasonToCome: [''],
    },
    { validators: [this.timeValidator] }
  );

  public nameControl = this.meetupCreationForm.controls.name;
  public dateControl = this.meetupCreationForm.controls.date;
  public timeControl = this.meetupCreationForm.controls.time;
  public durationControl = this.meetupCreationForm.controls.duration;
  public locationControl = this.meetupCreationForm.controls.location;
  public descriptionControl = this.meetupCreationForm.controls.description;

  public routerReturnBack() {
    this.location.back();
  }

  public createMeetup() {
    if (this.meetupCreationForm.invalid) {
      this.meetupCreationForm.markAllAsTouched();

      return;
    }

    this.meetupService
      .createMeetup(<MeetupCreateOptions>this.meetupCreationForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
      });
  }

  private dateValidator(dateControl: FormControl): ValidationErrors | null {
    const date = dateControl.value;
    const now = new Date();

    now.setHours(0, 0, 0, 0);

    if (now.getTime() > new Date(date).getTime()) {
      return { invalidDate: 'Нельзя создать митап в прошлом' };
    }

    return null;
  }

  private timeValidator(formControl: AbstractControl): ValidationErrors | null {
    const dateValue = formControl.get('date')!.value as string;
    const date = new Date(dateValue);
    date.setHours(0, 0, 0, 0);

    const timeValue = formControl.get('time')!.value as string;

    const meetupFullDate = new Date(`${dateValue}T${timeValue}`);
    const nowDate = new Date();

    nowDate.setHours(0, 0, 0, 0);

    if (
      date &&
      nowDate.getTime() === new Date(date).getTime() &&
      Date.now() > meetupFullDate.getTime()
    ) {
      return { invalidTime: 'Нельзя создать митап в прошлом' };
    }

    return null;
  }
}
