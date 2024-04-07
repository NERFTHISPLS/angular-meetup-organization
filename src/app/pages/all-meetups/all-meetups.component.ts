import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MeetupItemComponent } from '../../shared/components/meetup-item/meetup-item.component';
import { MeetupSearchComponent } from '../../shared/components/meetup-search/meetup-search.component';

import { MeetupService } from '../../shared/services/meetup.service';

import { FetchError } from '../../shared/interfaces/user';

@Component({
  selector: 'app-all-meetups',
  standalone: true,
  imports: [
    MeetupItemComponent,
    MeetupSearchComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './all-meetups.component.html',
  styleUrl: './all-meetups.component.scss',
})
export class AllMeetupsComponent implements OnDestroy {
  public meetupService = inject(MeetupService);
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);

  private meetupsSubscription: Subscription | null = null;

  public errorMessage?: string;

  constructor() {
    if (!localStorage.getItem('userToken')) return;

    if (this.router.url === '/my-meetups') {
      this.meetupsSubscription = this.meetupService.fetchMyMeetups().subscribe({
        error: (error: FetchError) => {
          this.handleFetchError(error);

          this.changeDetector.detectChanges();
        },
      });

      return;
    }

    this.meetupsSubscription = this.meetupService.fetchAllMeetups().subscribe({
      error: (error: FetchError) => {
        this.handleFetchError(error);

        this.changeDetector.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    if (this.meetupsSubscription) {
      this.meetupsSubscription.unsubscribe();
    }

    this.meetupService.allMeetupsOriginal = [];
  }

  private handleFetchError(error: FetchError) {
    console.error(error);

    if (error.status === 0) {
      this.errorMessage = 'Отсутствует интернет-соединение';
    } else {
      this.errorMessage = 'Что-то пошло не так :(';
    }
  }
}
