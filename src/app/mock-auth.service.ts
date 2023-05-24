import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockAuthService {
  constructor() {}

  authenticate(): Observable<boolean> {
    return of(true);
  }
}
