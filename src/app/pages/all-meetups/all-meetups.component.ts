import { Component } from '@angular/core';

import { MeetupItemComponent } from '../../shared/components/meetup-item/meetup-item.component';

@Component({
  selector: 'app-all-meetups',
  standalone: true,
  imports: [MeetupItemComponent],
  templateUrl: './all-meetups.component.html',
  styleUrl: './all-meetups.component.scss',
})
export class AllMeetupsComponent {}
