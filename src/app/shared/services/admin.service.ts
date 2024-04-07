import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import {
  ChangeRoleBody,
  ChangeRoleResponse,
  Role,
  UserEditBody,
  UserEditData,
  UserEditResponse,
  UserFetchData,
} from '../interfaces/user';

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
      map((response: UserFetchData[]) => response.sort((a, b) => a.id - b.id)),
      tap((response: UserFetchData[]) => {
        this._allUsers = response;
      })
    );
  }

  public deleteUser(id: number): Observable<UserFetchData | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/user/${id}`;

    return this.httpClient.delete<UserFetchData>(urlToFetch).pipe(
      tap((response: UserFetchData) => {
        this._allUsers = this._allUsers.filter(
          (user) => user.id !== response.id
        );
      })
    );
  }

  public editUser(
    userInfo: UserEditData
  ): Observable<UserEditResponse | never> {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/user/${userInfo.id}`;

    const body: UserEditBody = {
      email: userInfo.email,
      fio: userInfo.fio,
    };

    return this.httpClient.put<UserEditResponse>(urlToFetch, body).pipe(
      tap((response: UserEditResponse) => {
        let updatedUser = this._allUsers.find(
          (user) => user.id === response.id
        );

        if (!updatedUser) return;

        updatedUser = {
          ...updatedUser,
          email: response.email,
          fio: response.fio,
        };

        this._allUsers = this._allUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      })
    );
  }

  public changeRole(id: number, role: string) {
    const { apiUrl } = environment;
    const urlToFetch = `${apiUrl}/user/role`;

    const body: ChangeRoleBody = {
      name: role,
      userId: id,
    };

    return this.httpClient.put<ChangeRoleResponse>(urlToFetch, body).pipe(
      tap((response: ChangeRoleResponse) => {
        let updatedUser = this._allUsers.find(
          (user) => user.id === response.userId
        );

        if (!updatedUser) return;

        const newRole: Role = {
          name: response.name,
        };

        updatedUser = {
          ...updatedUser,
          roles: [...updatedUser.roles, newRole],
        };

        this._allUsers = this._allUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      })
    );
  }

  public get allUsers() {
    return this._allUsers;
  }

  public set allUsers(value: UserFetchData[]) {
    this._allUsers = value;
  }
}
