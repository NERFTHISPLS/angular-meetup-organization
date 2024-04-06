import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserService } from '../services/user.service';

export const logoutNavigationGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.currentUser) {
    router.navigate(['login']);

    return false;
  }

  return true;
};
