import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

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
      tap((response: Meetup[]) => {
        this._allMeetups = response;
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
