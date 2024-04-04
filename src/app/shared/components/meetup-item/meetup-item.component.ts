import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';

import { Meetup } from '../../interfaces/meetup';

import { environment } from '../../../../environments/environment';

import { MeetupService } from '../../services/meetup.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-meetup-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meetup-item.component.html',
  styleUrl: './meetup-item.component.scss',
})
export class MeetupItemComponent implements OnInit {
  public meetupService = inject(MeetupService);
  public userService = inject(UserService);

  public isExpanded = false;
  public subcribersNumberText = '';
  public dateText = '';
  public wasHeld!: boolean;
  public styleClasses = 'meetup ';
  public descriptionCharsNumber = 200;
  public isCurrentUserSubscribed = false;

  @Input() meetup!: Meetup;

  ngOnInit(): void {
    this.subcribersNumberText = this.getSubcribersNumberText();
    this.dateText = this.getDateText();
    this.wasHeld = Date.now() > new Date(this.meetup.time).getTime();
    this.styleClasses += this.wasHeld ? 'held' : '';

    this.isCurrentUserSubscribed =
      this.meetup.users.find(
        (user) => user.id === this.userService.currentUser!.id
      ) !== undefined;
  }

  public showMore() {
    this.isExpanded = true;
  }

  public showLess() {
    this.isExpanded = false;
  }

  public subscribeForMeetup() {
    this.meetupService
      .subscribeForMeetup(this.meetup.id, this.userService.currentUser!.id)
      .subscribe();
  }

  public unsubscribeFromMeetup() {
    this.meetupService
      .unsubscribeFromMeetup(this.meetup.id, this.userService.currentUser!.id)
      .subscribe();
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
