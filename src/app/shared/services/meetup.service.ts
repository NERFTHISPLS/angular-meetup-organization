import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, reduce, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Meetup } from '../interfaces/meetup';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private httpClient = inject(HttpClient);

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
        console.log(response);
      })
    );
  }

  public get allMeetups() {
    return this._allMeetups;
  }

  public set allMeetups(value: Meetup[]) {
    this._allMeetups = value;
  }
}
