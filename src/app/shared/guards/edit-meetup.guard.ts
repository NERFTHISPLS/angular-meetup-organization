import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { MeetupService } from '../services/meetup.service';
import { Meetup } from '../interfaces/meetup';

export const editMeetupGuard: CanActivateFn = (route) => {
  const meetupService = inject(MeetupService);
  const router = inject(Router);

  const [, idSegment] = route.url;
  const id = +idSegment.path;

  let myMeetupsSubscription: Subscription | null = null;

  if (!meetupService.allMeetups.length) {
    myMeetupsSubscription = meetupService.fetchMyMeetups().subscribe({
      next: (response: Meetup[]) => {
        return isMeetupOwn(id, response, router);
      },
    });
  } else {
    return isMeetupOwn(id, meetupService.allMeetups, router);
  }

  return true;
};

function isMeetupOwn(meetupId: number, meetups: Meetup[], router: Router) {
  const isOwnMeetup =
    meetups.find((meetup) => meetup.id === meetupId) !== undefined;

  if (!isOwnMeetup) {
    router.navigate(['']);

    return false;
  }

  return true;
}
