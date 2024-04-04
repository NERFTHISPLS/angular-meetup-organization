import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MeetupItemComponent } from '../../shared/components/meetup-item/meetup-item.component';

import { MeetupService } from '../../shared/services/meetup.service';

@Component({
  selector: 'app-all-meetups',
  standalone: true,
  imports: [MeetupItemComponent, RouterModule, CommonModule],
  templateUrl: './all-meetups.component.html',
  styleUrl: './all-meetups.component.scss',
})
export class AllMeetupsComponent {
  public meetupService = inject(MeetupService);

  constructor() {
    if (!localStorage.getItem('userToken')) return;

    this.meetupService.fetchAllMeetups().subscribe();
  }
}
