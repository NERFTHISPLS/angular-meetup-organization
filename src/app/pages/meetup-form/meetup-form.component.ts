import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
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

import {
  Meetup,
  MeetupCreateOptions,
  MeetupCreationForm,
} from '../../shared/interfaces/meetup';
import { FetchError } from '../../shared/interfaces/user';

@Component({
  selector: 'app-meetup-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './meetup-form.component.html',
  styleUrl: './meetup-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private deleteSubscription: Subscription | null = null;

  public routeMeetupToEditId = this.route.snapshot.paramMap.get('id');
  public meetupToEdit: Meetup | undefined | null = null;

  public readonly defaultMeetupDuration = 90;

  public meetupCreationForm!: MeetupCreationForm;

  public nameControl!: FormControl<string>;
  public dateControl!: FormControl<string>;
  public timeControl!: FormControl<string>;
  public durationControl!: FormControl<number>;
  public locationControl!: FormControl<string>;
  public descriptionControl!: FormControl<string>;

  public errorMessage?: string;

  public isEditing = false;

  ngOnInit(): void {
    if (!this.routeMeetupToEditId) {
      this.initFormFrom(null, this.meetupService.allMeetups);

      return;
    }

    const meetupToEditId = Number(this.routeMeetupToEditId);

    if (!this.meetupService.allMeetups.length) {
      this.allMeetupsSubscription = this.meetupService
        .fetchAllMeetups()
        .subscribe({
          next: (meetups: Meetup[]) => {
            this.initFormFrom(meetupToEditId, meetups);
          },
          error: (error: FetchError) => {
            this.handleFetchError(error);

            this.changeDetector.detectChanges();
          },
        });
    } else {
      this.initFormFrom(meetupToEditId, this.meetupService.allMeetups);
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

    this.editSubscription = this.meetupService
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

  public deleteMeetup() {
    this.deleteSubscription = this.meetupService
      .deleteMeetup(+(<string>this.routeMeetupToEditId))
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error: FetchError) => {
          this.handleFetchError(error);

          this.changeDetector.detectChanges();
        },
      });
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

  private initFormFrom(id: number | null, meetups: Meetup[]) {
    this.meetupToEdit = id !== null ? this.findMeetupById(id, meetups) : null;

    this.initFormGroup();
    this.initRequiredFormControls(this.meetupCreationForm);
  }

  private initFormGroup() {
    const meetupDate = this.meetupToEdit
      ? new Date(this.meetupToEdit.time)
      : null;

    this.meetupCreationForm = this.formBuilder.nonNullable.group(
      {
        name: [this.meetupToEdit?.name || '', [Validators.required]],
        date: [
          meetupDate ? format(meetupDate, 'yyyy-MM-dd') : '',
          [Validators.required, this.dateValidator],
        ],
        time: [
          meetupDate ? format(meetupDate, 'HH:mm') : '',
          [Validators.required],
        ],
        duration: [
          this.meetupToEdit?.duration || this.defaultMeetupDuration,
          [Validators.required, Validators.min(15), Validators.max(120)],
        ],
        location: [this.meetupToEdit?.location || '', [Validators.required]],
        description: [
          this.meetupToEdit?.description || '',
          [Validators.required],
        ],
        targetAudience: [this.meetupToEdit?.target_audience || ''],
        needToKnow: [this.meetupToEdit?.need_to_know || ''],
        willHappen: [this.meetupToEdit?.will_happen || ''],
        reasonToCome: [this.meetupToEdit?.reason_to_come || ''],
      },
      { validators: [this.timeValidator] }
    );
  }

  private initRequiredFormControls(form: MeetupCreationForm) {
    this.nameControl = form.controls.name;
    this.dateControl = form.controls.date;
    this.timeControl = form.controls.time;
    this.durationControl = form.controls.duration;
    this.locationControl = form.controls.location;
    this.descriptionControl = form.controls.description;
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

    if (this.editSubscription) {
      this.editSubscription.unsubscribe();
    }

    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }
}
