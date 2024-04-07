import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Meetup,
  MeetupCreateBody,
  MeetupCreateOptions,
  MeetupSignUpBody,
  SearchParams,
} from '../interfaces/meetup';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);

  private _allMeetups: Meetup[] = [];
  private _filteredMeetups: Meetup[] = [];

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
        this._filteredMeetups = response;
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
        this._filteredMeetups = response;
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
        this._filteredMeetups = this._filteredMeetups.map((meetup) =>
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
          this._filteredMeetups = this._filteredMeetups.map((meetup) =>
            meetup.id === response.id ? response : meetup
          );
        })
      );
  }

  public createMeetup(
    meetupInfo: MeetupCreateOptions
  ): Observable<Meetup | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/meetup`;
    const body = this.getCreateMeetupRequestBody(meetupInfo);

    return this.httpClient.post<Meetup>(urlToFetch, body);
  }

  public deleteMeetup(id: number): Observable<Meetup | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/meetup/${id}`;

    return this.httpClient.delete<Meetup>(urlToFetch).pipe(
      tap((response: Meetup) => {
        this._filteredMeetups = this._filteredMeetups.filter(
          (meetup) => meetup.id !== response.id
        );
      })
    );
  }

  public editMeetup(
    id: number,
    meetupInfo: MeetupCreateOptions
  ): Observable<Meetup | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/meetup/${id}`;

    const body = this.getCreateMeetupRequestBody(meetupInfo);

    return this.httpClient.put<Meetup>(urlToFetch, body);
  }

  public setMeetupsBy({ query, from, to }: SearchParams): void {
    if (!query && !from && !to) {
      this._filteredMeetups = this._allMeetups;
      return;
    }

    if (!from && !to) {
      this._filteredMeetups = this.getMeetupsByQuery(query);
      return;
    }

    if (from && !to) {
      this._filteredMeetups = this.getMeetupsFromDate(query, from);
      return;
    }

    if (!from && to) {
      this._filteredMeetups = this.getMeetupsTillDate(query, to);
      return;
    }

    if (from && to) {
      this._filteredMeetups = this.getMeetupsFromDateTill(query, from, to);
      return;
    }
  }

  private getMeetupsFromDateTill(
    query: string,
    from: Date,
    to: Date
  ): Meetup[] {
    const meetupsFromDate = this.getMeetupsFromDate(query, from);

    return meetupsFromDate.filter((meetup) => {
      const meetupDateMs = this.getDateMs(meetup.time);
      const toDateMs = this.getDateMs(to.toISOString());

      return toDateMs >= meetupDateMs;
    });
  }

  private getMeetupsTillDate(query: string, to: Date): Meetup[] {
    const meetupsByQuery = this.getMeetupsByQuery(query);

    return meetupsByQuery.filter((meetup) => {
      const meetupDateMs = this.getDateMs(meetup.time);
      const toDateMs = this.getDateMs(to.toISOString());

      return toDateMs >= meetupDateMs;
    });
  }

  private getMeetupsFromDate(query: string, from: Date): Meetup[] {
    const meetupsByQuery = this.getMeetupsByQuery(query);

    return meetupsByQuery.filter((meetup) => {
      const meetupDateMs = this.getDateMs(meetup.time);
      const fromDateMs = this.getDateMs(from.toISOString());

      return fromDateMs <= meetupDateMs;
    });
  }

  private getDateMs(dateStr: string) {
    const meetupDate = new Date(dateStr);
    meetupDate.setHours(0, 0, 0, 0);

    return meetupDate.getTime();
  }

  private getMeetupsByQuery(query: string): Meetup[] {
    return this._allMeetups.filter((meetup) => {
      const searchTarget = this.getMeetupSearchTargetStr(meetup).toLowerCase();

      return searchTarget.includes(query.toLowerCase());
    });
  }

  // Returns meetup's text fields combined in one string
  private getMeetupSearchTargetStr(meetup: Meetup): string {
    return `${meetup.name} ${meetup.location} ${meetup.target_audience} ${meetup.need_to_know} ${meetup.will_happen} ${meetup.reason_to_come} ${meetup.owner.fio}`;
  }

  public get allMeetupsOriginal() {
    return this._allMeetups;
  }

  public set allMeetupsOriginal(value: Meetup[]) {
    this._allMeetups = value;
  }

  public get allMeetups() {
    return this._filteredMeetups;
  }

  public set allMeetups(value: Meetup[]) {
    this._filteredMeetups = value;
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
