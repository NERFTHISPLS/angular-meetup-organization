import { Component } from '@angular/core';

import { MeetupItemComponent } from '../../shared/components/meetup-item/meetup-item.component';
import { NewMeetupBtnComponent } from '../../shared/components/new-meetup-btn/new-meetup-btn.component';

@Component({
  selector: 'app-all-meetups',
  standalone: true,
  imports: [MeetupItemComponent, NewMeetupBtnComponent],
  templateUrl: './all-meetups.component.html',
  styleUrl: './all-meetups.component.scss',
})
export class AllMeetupsComponent {}
