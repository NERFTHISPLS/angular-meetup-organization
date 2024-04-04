import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MeetupItemComponent } from '../../shared/components/meetup-item/meetup-item.component';

import { MeetupService } from '../../shared/services/meetup.service';
import { Meetup } from '../../shared/interfaces/meetup';

@Component({
  selector: 'app-all-meetups',
  standalone: true,
  imports: [MeetupItemComponent, RouterModule],
  templateUrl: './all-meetups.component.html',
  styleUrl: './all-meetups.component.scss',
})
export class AllMeetupsComponent implements OnInit {
  public meetupService = inject(MeetupService);

  ngOnInit(): void {
    if (!localStorage.getItem('userToken')) return;

    this.meetupService.fetchAllMeetups().subscribe({
      next: (meetups: Meetup[]) => {
        console.log(meetups);
      },
    });
  }
}
