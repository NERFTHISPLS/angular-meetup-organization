import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { UserFetchData } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private httpClient = inject(HttpClient);

  private _allUsers: UserFetchData[] = [];

  public fetchAllUsers(): Observable<UserFetchData[] | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/user`;

    return this.httpClient.get<UserFetchData[]>(urlToFetch).pipe(
      tap((response: UserFetchData[]) => {
        this._allUsers = response;
      })
    );
  }

  public get allUsers() {
    return this._allUsers;
  }
}
