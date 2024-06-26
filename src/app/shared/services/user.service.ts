import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import {
  LoginRequestBody,
  LoginResponse,
  LoginUserData,
  RegistrationRequestBody,
  RegistrationResponse,
  RegistrationUserData,
  User,
} from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);

  private _wasJustRegistered = false;
  private _token: string | null = localStorage.getItem('userToken');

  private _currentUser: User | null = this._token
    ? this.parseJwt(this._token)
    : null;

  private _isCurrentUserAdmin: boolean = this._currentUser
    ? this.checkUserAdmin(this._currentUser)
    : false;

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

    return this.httpClient.post<RegistrationResponse>(urlToFetch, body).pipe(
      tap(() => {
        this.wasJustRegistered = true;
      })
    );
  }

  public loginUser({
    email,
    password,
  }: LoginUserData): Observable<User | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/auth/login`;

    const body: LoginRequestBody = {
      email,
      password,
    };

    return this.httpClient.post<LoginResponse>(urlToFetch, body).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('userToken', response.token);

        this._token = response.token;
      }),
      map((response: LoginResponse): User => this.parseJwt(response.token)),
      tap((user: User) => {
        this._currentUser = user;

        if (user) {
          this._isCurrentUserAdmin = this.checkUserAdmin(user);
        }
      })
    );
  }

  public logout() {
    localStorage.removeItem('userToken');

    this._currentUser = null;
  }

  private parseJwt(token: string): User {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  private checkUserAdmin(user: User) {
    return user.roles.some((role) => role.name === 'ADMIN');
  }

  public get wasJustRegistered() {
    return this._wasJustRegistered;
  }

  public set wasJustRegistered(value: boolean) {
    this._wasJustRegistered = value;
  }

  public get token() {
    return this._token;
  }

  public get currentUser() {
    return this._currentUser;
  }

  public set currentUser(value: User | null) {
    this._currentUser = value;
  }

  public get isCurrentUserAdmin() {
    return this._isCurrentUserAdmin;
  }
}
