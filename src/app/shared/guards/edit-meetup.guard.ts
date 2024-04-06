import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { UserService } from '../services/user.service';
import { MeetupService } from '../services/meetup.service';

export const editMeetupGuard: CanActivateFn = (route) => {
  const userService = inject(UserService);
  const meetupService = inject(MeetupService);
  const router = inject(Router);

  const [, idSegment] = route.url;
  const id = +idSegment.path;

  const isOwnMeetup =
    meetupService.allMeetups
      .filter((meetup) => meetup.owner.id === userService.currentUser?.id)
      .find((meetup) => meetup.id === id) !== undefined;

  if (!isOwnMeetup) {
    router.navigate(['']);

    return false;
  }

  return true;
};
