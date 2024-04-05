import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MeetupService } from '../../shared/services/meetup.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MeetupCreateOptions } from '../../shared/interfaces/meetup';

@Component({
  selector: 'app-meetup-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './meetup-form.component.html',
  styleUrl: './meetup-form.component.scss',
})
export class MeetupFormComponent {
  private meetupService = inject(MeetupService);
  private location = inject(Location);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  public meetupCreationForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    date: ['', [Validators.required]],
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
  });

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
}
