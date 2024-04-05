import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('userToken');

  const isUrlCorrect = req.url.startsWith(environment.apiUrl);

  if (isUrlCorrect && token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
