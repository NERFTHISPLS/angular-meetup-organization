import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserService } from '../services/user.service';

export const logoutNavigationGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const MS_IN_SECOND = 1000;

  if (!userService.currentUser) {
    router.navigate(['login']);

    return false;
  }

  if (Date.now() > userService.currentUser.exp * MS_IN_SECOND) {
    localStorage.removeItem('userToken');
    userService.currentUser = null;
    router.navigate(['login']);

    return false;
  }

  return true;
};
