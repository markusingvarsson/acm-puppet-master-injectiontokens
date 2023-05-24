import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home-page/homepage.component').then((m) => m.HomepageComponent),
  },
  {
    path: 'recipes',
    canActivate: [
      () =>
        inject(AuthService)
          .authenticate()
          .pipe(
            tap((isAuth) => {
              if (!isAuth) {
                alert('You are not authorized to view this page');
              }
            })
          ),
    ],
    loadComponent: () =>
      import('./recipe-page/recipes.component').then((m) => m.RecipesComponent),
  },
  {
    path: 'recipe/:recipeId',
    loadComponent: () =>
      import('./recipe-page/recipes.component').then(
        (m) => m.RecipeDetailComponent
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  { path: '**', redirectTo: '' },
];
