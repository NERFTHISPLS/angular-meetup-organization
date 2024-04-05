import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

import { Meetup } from '../../interfaces/meetup';

import { environment } from '../../../../environments/environment';

import { MeetupService } from '../../services/meetup.service';
import { UserService } from '../../services/user.service';

import { FetchError } from '../../interfaces/user';

@Component({
  selector: 'app-meetup-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meetup-item.component.html',
  styleUrl: './meetup-item.component.scss',
})
export class MeetupItemComponent implements OnInit, OnDestroy {
  public meetupService = inject(MeetupService);
  public userService = inject(UserService);
  private changeDetector = inject(ChangeDetectorRef);

  public isCurrentUserSubscribed = false;
  public isOwnMeetup = false;
  public expandedFieldsExist = true;
  public isSubscribeBtnShown = false;
  public isUnsubscribeBtnShown = false;
  public isExpanded = false;
  public wasHeld!: boolean;

  public description = '';
  public dateText = '';
  public subcribersNumberText = '';
  public styleClasses = 'meetup ';
  public readonly descriptionCharsNumber = 200;

  public errorMessage?: string;

  public subscribeForMeetupSubscription: Subscription | null = null;
  public unsubscribeFromMeetupSubscription: Subscription | null = null;
  public deleteMeetupSubscription: Subscription | null = null;

  @Input() meetup!: Meetup;

  ngOnInit(): void {
    this.subcribersNumberText = this.getSubcribersNumberText();
    this.dateText = this.getDateText();
    this.wasHeld = Date.now() > new Date(this.meetup.time).getTime();
    this.styleClasses += this.wasHeld ? 'held' : '';

    this.description = this.formatDescription();

    this.isCurrentUserSubscribed =
      this.meetup.users.find(
        (user) => user.id === this.userService.currentUser!.id
      ) !== undefined;

    this.expandedFieldsExist = this.isMeetupExpandable();

    this.isOwnMeetup =
      this.meetup.owner.id === this.userService.currentUser!.id;

    this.isSubscribeBtnShown =
      !this.wasHeld && !this.isCurrentUserSubscribed && !this.isOwnMeetup;

    this.isUnsubscribeBtnShown =
      !this.wasHeld && this.isCurrentUserSubscribed && !this.isOwnMeetup;
  }

  ngOnDestroy(): void {
    if (this.subscribeForMeetupSubscription) {
      this.subscribeForMeetupSubscription.unsubscribe();
    }

    if (this.unsubscribeFromMeetupSubscription) {
      this.unsubscribeFromMeetupSubscription.unsubscribe();
    }
  }

  public showMore() {
    this.isExpanded = true;
  }

  public showLess() {
    this.isExpanded = false;
  }

  public subscribeForMeetup() {
    this.subscribeForMeetupSubscription = this.meetupService
      .subscribeForMeetup(this.meetup.id, this.userService.currentUser!.id)
      .subscribe({
        error: (error: FetchError) => {
          this.handleFetchError(error);
          this.changeDetector.detectChanges();
        },
      });
  }

  public unsubscribeFromMeetup() {
    this.unsubscribeFromMeetupSubscription = this.meetupService
      .unsubscribeFromMeetup(this.meetup.id, this.userService.currentUser!.id)
      .subscribe({
        error: (error: FetchError) => {
          this.handleFetchError(error);
          this.changeDetector.detectChanges();
        },
      });
  }

  public deleteMeetup() {
    this.deleteMeetupSubscription = this.meetupService
      .deleteMeetup(this.meetup.id)
      .subscribe({
        error: (error: FetchError) => {
          this.handleFetchError(error);
          this.changeDetector.detectChanges();
        },
      });
  }

  private formatDescription() {
    return this.meetup.description.length > this.descriptionCharsNumber
      ? this.meetup.description.slice(0, this.descriptionCharsNumber) + '...'
      : this.meetup.description;
  }

  private isMeetupExpandable() {
    return (
      this.meetup.target_audience !== '' ||
      this.meetup.need_to_know !== '' ||
      this.meetup.will_happen !== '' ||
      this.meetup.reason_to_come !== '' ||
      this.meetup.description.length > this.descriptionCharsNumber
    );
  }

  private handleFetchError(error: FetchError) {
    console.error(error);

    this.errorMessage = 'Что-то пошло не так';
  }

  private getSubcribersNumberText() {
    const subcribersNumber = this.meetup.users.length;

    const subcribersNumberLastDigit = +String(subcribersNumber).slice(-1);

    const subcribersTextEnd =
      subcribersNumberLastDigit === 0 ||
      (subcribersNumberLastDigit >= 5 && subcribersNumberLastDigit <= 9) ||
      subcribersNumberLastDigit === 11
        ? 'ов'
        : subcribersNumberLastDigit === 1
        ? ''
        : 'а';

    return `${subcribersNumber} подписчик${subcribersTextEnd}`;
  }

  private getDateText() {
    const date = new Date(this.meetup.time);

    return new Intl.DateTimeFormat(environment.locale, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }
}
