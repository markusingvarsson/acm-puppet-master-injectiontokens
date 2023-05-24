import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import confetti from 'canvas-confetti';
import { RecipeService } from '../recipe-page/recipe.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
  ],
  template: `
    <mat-horizontal-stepper [animationDuration]="'200ms'" #stepper>
      <mat-step
        [stepControl]="billingFormGroup"
        [completed]="billingFormGroup.valid"
      >
        <form [formGroup]="billingFormGroup">
          <ng-template matStepLabel>Billing</ng-template>
          <input formControlName="name" placeholder="Your name" />
          <input formControlName="address" placeholder="Your address" />
        </form>
      </mat-step>
      <mat-step
        [stepControl]="shippingFormGroup"
        [completed]="shippingFormGroup.valid"
      >
        <form [formGroup]="shippingFormGroup">
          <ng-template matStepLabel>Shipping</ng-template>
          <input formControlName="method" placeholder="Shipping method" />
          <input formControlName="address" placeholder="Shipping address" />
        </form>
      </mat-step>
      <mat-step>
        <ng-template matStepLabel>Review</ng-template>
        <h2>Your order:</h2>
        <ul>
          <li *ngFor="let item of items">{{ item }}</li>
        </ul>
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
      [disabled]="stepper.steps.length - 1 === stepper.selectedIndex"
    >
      Next
    </button>
    <button
      mat-button
      (click)="onBuy(stepper)"
      [disabled]="!allFormsValid(stepper)"
    >
      Buy
    </button>
  `,
  styles: [
    `
      input {
        display: block;
        margin-bottom: 1rem;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
    `,
  ],
})
export class CheckoutComponent implements OnInit {
  billingFormGroup!: FormGroup;
  shippingFormGroup!: FormGroup;
  items: string[] = [];

  #formBuilder: FormBuilder = inject(FormBuilder);
  #recipeService: RecipeService = inject(RecipeService);

  ngOnInit() {
    this.billingFormGroup = this.#formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
    });
    this.shippingFormGroup = this.#formBuilder.group({
      method: ['', Validators.required],
      address: ['', Validators.required],
    });
    this.items = this.#recipeService.getCart();
  }

  next(stepper: MatStepper) {
    stepper.next();
  }

  previous(stepper: MatStepper) {
    stepper.previous();
  }

  allFormsValid(stepper: MatStepper): boolean {
    return (
      this.billingFormGroup.valid &&
      this.shippingFormGroup.valid &&
      stepper.steps.length - 1 === stepper.selectedIndex
    );
  }

  onBuy(stepper: MatStepper) {
    if (this.allFormsValid(stepper)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }
}
