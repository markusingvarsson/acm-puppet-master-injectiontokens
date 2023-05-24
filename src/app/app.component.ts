import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge'; // import MatBadgeModule
import { RecipeService } from './recipe-page/recipe.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatToolbarModule,
    MatBadgeModule, // add MatBadgeModule here
  ],
  template: `
    <mat-toolbar color="primary">
      <span>ng-recipes</span>
      <span class="spacer"></span>
      <nav>
        <ul style="display: flex; gap: 2rem">
          <li><a routerLink="/">Home</a></li>
          <li><a routerLink="/recipes">Recipes</a></li>
          <li>
            <a routerLink="/checkout">
              <mat-icon
                matBadge="{{ cartItemCount$ | async }}"
                matBadgeColor="accent"
                >shopping_cart</mat-icon
              >
            </a>
          </li>
        </ul>
      </nav>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      a {
        color: white;
      }
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class AppComponent {
  cartItemCount$: Observable<number> = inject(RecipeService)
    .getCart$()
    .pipe(map((items) => items.length));
}
