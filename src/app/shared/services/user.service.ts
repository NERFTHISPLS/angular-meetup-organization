import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import {
  RegistrationRequestBody,
  RegistrationResponse,
  RegistrationUserData,
} from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);

  public registerUser({
    firstName,
    lastName,
    email,
    password,
  }: RegistrationUserData): Observable<RegistrationResponse | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/auth/registration`;
    const fio = `${firstName} ${lastName}`;

    const body: RegistrationRequestBody = {
      email,
      password,
      fio,
    };

    return this.httpClient.post<RegistrationResponse>(urlToFetch, body);
  }
}
