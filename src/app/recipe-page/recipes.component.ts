import { Component, Input, OnInit, DestroyRef } from '@angular/core';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';
import {
  AsyncPipe,
  DatePipe,
  NgFor,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { Observable, of } from 'rxjs';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import confetti from 'canvas-confetti';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    NgFor,
    AsyncPipe,
    NgIf,
    MatStepperModule,
    MatButtonModule,
    NgTemplateOutlet,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  template: `
    <div *ngIf="recipe$ | async as recipe">
      <h2>{{ recipe.title }}</h2>
      <form [formGroup]="formGroup">
        <mat-horizontal-stepper [animationDuration]="'200ms'" linear #stepper>
          <mat-step *ngFor="let step of recipe.steps; let i = index">
            <ng-template matStepLabel>Step {{ i + 1 }}</ng-template>
            <mat-checkbox [formControlName]="'step' + i"
              ><span>{{ step }}</span></mat-checkbox
            >
          </mat-step>
        </mat-horizontal-stepper>
        <button
          mat-button
          (click)="previous(stepper)"
          [disabled]="stepper.selectedIndex === 0"
        >
          Back
        </button>
        <button
          mat-button
          (click)="next(stepper)"
          [disabled]="recipe.steps.length - 1 === stepper.selectedIndex"
        >
          Next
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      h2 {
        text-align: center;
        margin-bottom: 2rem;
      }
    `,
  ],
})
export class RecipeDetailComponent implements OnInit {
  recipe$!: Observable<Recipe | undefined>;
  formGroup = new FormGroup({});
  #recipeService: RecipeService = inject(RecipeService);
  #route: ActivatedRoute = inject(ActivatedRoute);
  #destroyRef = inject(DestroyRef);

  next(stepper: MatStepper) {
    stepper.next();
  }

  previous(stepper: MatStepper) {
    stepper.previous();
  }

  ngOnInit() {
    const id = Number(this.#route.snapshot.paramMap.get('recipeId'));
    this.recipe$ = this.#recipeService.getRecipe(id);
    this.recipe$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((recipe) => {
        if (recipe) {
          recipe.steps.forEach((step, index) => {
            this.formGroup.addControl(
              `step${index}`,
              new FormControl(false, [Validators.requiredTrue])
            );
          });
        }
      });

    this.formGroup.statusChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((status) => {
        if (status === 'VALID') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      });
  }
}

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [MatCardModule, NgFor, RouterLink, MatRippleModule, DatePipe],
  template: `
    <mat-card matRipple style="cursor: pointer;">
      <mat-card-title>{{ recipe.title }}</mat-card-title>
      <mat-card-subtitle
        >Posted on: {{ recipe.timestamp | date }}</mat-card-subtitle
      >
      <mat-card-content>
        <h3>Ingredients:</h3>
        <ul>
          <li *ngFor="let ingredient of recipe.ingredients">
            {{ ingredient }}
          </li>
        </ul>
        <h3><a [routerLink]="['/recipe', recipe.id]">Details</a></h3>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="addToCart()">Add to Cart</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        margin-bottom: 1rem;
        box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18),
          0 4px 15px 0 rgba(0, 0, 0, 0.15);
      }
    `,
  ],
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;
  #recipeService = inject(RecipeService);

  addToCart() {
    this.recipe.ingredients.forEach((ingredient) => {
      this.#recipeService.addToCart(ingredient);
    });
  }
}

@Component({
  selector: 'app-recipe-page',
  standalone: true,
  imports: [RecipeCardComponent, NgFor, AsyncPipe],
  template: `
    <div>
      <app-recipe-card
        *ngFor="let recipe of recipes$ | async"
        [recipe]="recipe"
      ></app-recipe-card>
    </div>
  `,
  styles: [``],
})
export class RecipesComponent {
  recipes$: Observable<Recipe[]> = inject(RecipeService).getRecipes();
}
