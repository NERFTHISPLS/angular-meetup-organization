import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { format } from 'date-fns';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MeetupService } from '../../shared/services/meetup.service';

import { Meetup, MeetupCreateOptions } from '../../shared/interfaces/meetup';
import { FetchError } from '../../shared/interfaces/user';

@Component({
  selector: 'app-meetup-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './meetup-form.component.html',
  styleUrl: './meetup-form.component.scss',
})
export class MeetupFormComponent implements OnInit, OnDestroy {
  private meetupService = inject(MeetupService);
  private location = inject(Location);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private changeDetector = inject(ChangeDetectorRef);

  private creationSubscription: Subscription | null = null;
  private allMeetupsSubscription: Subscription | null = null;
  private editSubscription: Subscription | null = null;

  public routeMeetupToEditId = this.route.snapshot.paramMap.get('id');
  public meetupToEdit?: Meetup;

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

  public targetAudienceControl =
    this.meetupCreationForm.controls.targetAudience;
  public needToKnowControl = this.meetupCreationForm.controls.needToKnow;
  public willHappenControl = this.meetupCreationForm.controls.willHappen;
  public reasonToComeControl = this.meetupCreationForm.controls.reasonToCome;

  public errorMessage?: string;

  public isEditing = false;

  ngOnInit(): void {
    if (!this.routeMeetupToEditId) return;

    const meetupToEditId = Number(this.routeMeetupToEditId);

    if (!this.meetupService.allMeetups.length) {
      this.allMeetupsSubscription = this.meetupService
        .fetchAllMeetups()
        .subscribe({
          next: (meetups: Meetup[]) => {
            this.setFormFields(meetupToEditId, meetups);
          },
          error: (error: FetchError) => {
            this.handleFetchError(error);

            this.changeDetector.detectChanges();
          },
        });
    } else {
      this.setFormFields(meetupToEditId, this.meetupService.allMeetups);
    }

    this.isEditing = true;
  }

  public routerReturnBack() {
    this.location.back();
  }

  public createMeetup() {
    if (this.meetupCreationForm.invalid) {
      this.meetupCreationForm.markAllAsTouched();

      return;
    }

    this.creationSubscription = this.meetupService
      .createMeetup(<MeetupCreateOptions>this.meetupCreationForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error: FetchError) => {
          this.handleCreateOrEditFetchError(error);

          this.changeDetector.detectChanges();
        },
      });
  }

  public editMeetup() {
    if (this.meetupCreationForm.invalid) {
      this.meetupCreationForm.markAllAsTouched();

      return;
    }

    this.meetupService
      .editMeetup(
        +(<string>this.routeMeetupToEditId),
        <MeetupCreateOptions>this.meetupCreationForm.value
      )
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error: FetchError) => {
          this.handleCreateOrEditFetchError(error);

          this.changeDetector.detectChanges();
        },
      });
  }

  private setFormFields(id: number, meetups: Meetup[]) {
    this.meetupToEdit = this.findMeetupById(id, meetups);

    if (!this.meetupToEdit) return;

    this.setFormControlsFrom(this.meetupToEdit);
  }

  private findMeetupById(id: number, meetups: Meetup[]) {
    return meetups.find((meetup) => meetup.id === id);
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

  private setFormControlsFrom(meetup: Meetup) {
    const meetupDate = new Date(meetup.time);

    const formattedDay = format(meetupDate, 'yyyy-MM-dd');
    const time = format(meetupDate, 'hh:mm');

    this.nameControl.setValue(meetup.name);
    this.dateControl.setValue(formattedDay);
    this.timeControl.setValue(time);
    this.durationControl.setValue(meetup.duration);
    this.locationControl.setValue(meetup.location);
    this.descriptionControl.setValue(meetup.description);
    this.targetAudienceControl.setValue(meetup.target_audience);
    this.needToKnowControl.setValue(meetup.need_to_know);
    this.reasonToComeControl.setValue(meetup.reason_to_come);
  }

  private handleFetchError(error: FetchError) {
    console.error(error);

    if (error.status === 0) {
      this.errorMessage = 'Отсутствует интернет-соединение';
    } else {
      this.errorMessage = 'Что-то пошло не так :(';
    }
  }

  private handleCreateOrEditFetchError(error: FetchError) {
    console.error(error);

    if (error.status === 0) {
      this.errorMessage = 'Отсутствует интернет-соединение';
    } else {
      this.errorMessage =
        'Митап с таким названием уже есть, или Вы пытаетесь создать митап в дату, когда в это время проводится другой митап';
    }
  }

  ngOnDestroy(): void {
    if (this.creationSubscription) {
      this.creationSubscription.unsubscribe();
    }

    if (this.allMeetupsSubscription) {
      this.allMeetupsSubscription.unsubscribe();
    }
  }
}
