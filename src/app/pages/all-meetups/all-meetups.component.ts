import { Component } from '@angular/core';

import { MeetupItemComponent } from '../../shared/components/meetup-item/meetup-item.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-meetups',
  standalone: true,
  imports: [MeetupItemComponent, RouterModule],
  templateUrl: './all-meetups.component.html',
  styleUrl: './all-meetups.component.scss',
})
export class AllMeetupsComponent {}
