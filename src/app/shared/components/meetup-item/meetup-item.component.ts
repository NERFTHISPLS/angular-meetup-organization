import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { Meetup } from '../../interfaces/meetup';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-meetup-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meetup-item.component.html',
  styleUrl: './meetup-item.component.scss',
})
export class MeetupItemComponent implements OnInit {
  public isExpanded = false;
  public subcribersNumberText = '';
  public dateText = '';
  public wasHeld!: boolean;
  public styleClasses = 'meetup ';

  @Input() meetup!: Meetup;

  ngOnInit(): void {
    this.subcribersNumberText = this.getSubcribersNumberText();
    this.dateText = this.getDateText();
    this.wasHeld = Date.now() > new Date(this.meetup.time).getTime();
    this.styleClasses += this.wasHeld ? 'held' : '';
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

  public showMore() {
    this.isExpanded = true;
  }

  public showLess() {
    this.isExpanded = false;
  }
}
