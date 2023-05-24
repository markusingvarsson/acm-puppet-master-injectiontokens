import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #USER_DATA_URL = 'assets/users.json';
  #http = inject(HttpClient);

  #getUsers(): Observable<User[]> {
    return this.#http.get<User[]>(this.#USER_DATA_URL);
  }

  authenticate(): Observable<boolean> {
    const username = 'username';
    const password = 'password';
    return this.#getUsers().pipe(
      map((users) => {
        for (let user of users) {
          if (user.username === username && user.password === password) {
            return true;
          }
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }
}
