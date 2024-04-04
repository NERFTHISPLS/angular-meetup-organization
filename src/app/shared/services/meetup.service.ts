import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Meetup } from '../interfaces/meetup';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private httpClient = inject(HttpClient);

  public fetchAllMeetups(): Observable<Meetup[] | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/meetup`;

    return this.httpClient.get<Meetup[]>(urlToFetch);
  }
}
