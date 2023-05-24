import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Recipe } from './recipe.model';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../app.config';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  #http = inject(HttpClient);
  #appConfig = inject(APP_CONFIG);
  #cart: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  getRecipes(): Observable<Recipe[]> {
    return this.#http.get<Recipe[]>(`${this.#appConfig.baseUrl}/recipes.json`);
  }

  getRecipe(id: number): Observable<Recipe | undefined> {
    return this.getRecipes().pipe(
      map((data) => data.find((x) => x.id === id)),
      catchError(() => of(undefined) as Observable<undefined>)
    );
  }

  getCart(): string[] {
    return this.#cart.value;
  }
  getCart$(): Observable<string[]> {
    return this.#cart.asObservable();
  }

  addToCart(item: string) {
    this.#cart.next([...this.#cart.value, item]);
  }

  clearCart() {
    this.#cart.next([]);
  }
}
