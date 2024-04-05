import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MeetupItemComponent } from '../../shared/components/meetup-item/meetup-item.component';

import { MeetupService } from '../../shared/services/meetup.service';

import { FetchError } from '../../shared/interfaces/user';
import { Meetup } from '../../shared/interfaces/meetup';

@Component({
  selector: 'app-all-meetups',
  standalone: true,
  imports: [MeetupItemComponent, RouterModule, CommonModule],
  templateUrl: './all-meetups.component.html',
  styleUrl: './all-meetups.component.scss',
})
export class AllMeetupsComponent implements OnDestroy {
  public meetupService = inject(MeetupService);
  private changeDetector = inject(ChangeDetectorRef);

  private allMeetupsSubscription: Subscription | null = null;

  public errorMessage?: string;

  constructor() {
    if (!localStorage.getItem('userToken')) return;

    this.allMeetupsSubscription = this.meetupService
      .fetchAllMeetups()
      .subscribe({
        error: (error: FetchError) => {
          console.error(error);

          if (error.status === 0) {
            this.errorMessage = 'Отсутствует интернет-соединение';
          } else {
            this.errorMessage = 'Что-то пошло не так :(';
          }

          this.changeDetector.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.allMeetupsSubscription) {
      this.allMeetupsSubscription.unsubscribe();
    }
  }
}
