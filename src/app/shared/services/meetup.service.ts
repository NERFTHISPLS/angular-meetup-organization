import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Meetup,
  MeetupCreateBody,
  MeetupCreateOptions,
  MeetupSignUpBody,
} from '../interfaces/meetup';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);

  private _allMeetups: Meetup[] = [];

  public fetchAllMeetups(): Observable<Meetup[] | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/meetup`;

    return this.httpClient.get<Meetup[]>(urlToFetch).pipe(
      map((response: Meetup[]) => {
        const meetupsNotHeld = response.filter(
          (item) => Date.now() <= new Date(item.time).getTime()
        );
        const meetupsHeld = response.filter(
          (item) => Date.now() > new Date(item.time).getTime()
        );

        meetupsNotHeld.sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        meetupsHeld.sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );

        return [...meetupsNotHeld, ...meetupsHeld];
      }),
      tap((response: Meetup[]) => {
        this._allMeetups = response;
      })
    );
  }

  public fetchMyMeetups(): Observable<Meetup[] | never> {
    return this.fetchAllMeetups().pipe(
      map((response: Meetup[]) =>
        response.filter(
          (item) => item.owner.id === this.userService.currentUser!.id
        )
      ),
      tap((response: Meetup[]) => {
        this._allMeetups = response;
      })
    );
  }

  public subscribeForMeetup(
    idMeetup: number,
    idUser: number
  ): Observable<Meetup | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/meetup`;

    const body: MeetupSignUpBody = {
      idMeetup,
      idUser,
    };

    return this.httpClient.put<Meetup>(urlToFetch, body).pipe(
      tap((response: Meetup) => {
        this._allMeetups = this._allMeetups.map((meetup) =>
          meetup.id === response.id ? response : meetup
        );
      })
    );
  }

  public unsubscribeFromMeetup(
    idMeetup: number,
    idUser: number
  ): Observable<Meetup | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/meetup`;

    const body: MeetupSignUpBody = {
      idMeetup,
      idUser,
    };

    return this.httpClient
      .delete<Meetup>(urlToFetch, {
        body,
      })
      .pipe(
        tap((response: Meetup) => {
          this._allMeetups = this._allMeetups.map((meetup) =>
            meetup.id === response.id ? response : meetup
          );
        })
      );
  }

  public createMeetup(meetupInfo: MeetupCreateOptions) {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/meetup`;
    const body = this.getCreateMeetupRequestBody(meetupInfo);

    return this.httpClient.post<Meetup>(urlToFetch, body);
  }

  public get allMeetups() {
    return this._allMeetups;
  }

  public set allMeetups(value: Meetup[]) {
    this._allMeetups = value;
  }

  private getCreateMeetupRequestBody(
    meetupInfo: MeetupCreateOptions
  ): MeetupCreateBody {
    const camelToSnakeCase = (str: string) =>
      str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

    const meetupInfoEntries: [string, string | number][] =
      Object.entries(meetupInfo);

    const bodyEntries = meetupInfoEntries
      .filter((entry) => {
        const [key] = entry;

        return key !== 'date';
      })
      .map((entry) => {
        const [key, value] = entry;

        const keySnakeCase = camelToSnakeCase(key);

        if (key === 'time')
          return [
            keySnakeCase,
            new Date(`${meetupInfo.date}T${meetupInfo.time}`).toISOString(),
          ];

        return [keySnakeCase, value];
      });

    const body: MeetupCreateBody = Object.fromEntries(bodyEntries);

    return body;
  }
}
