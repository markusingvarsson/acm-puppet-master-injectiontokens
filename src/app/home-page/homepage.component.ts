import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  template: ` <div class="content">
    <h1>Welcome to ng-recipes!</h1>
    <h2>By Puppet Master Corp.</h2>
    <p>
      Find the best recipes for any meal, any time of the day. Let's start
      cooking!
    </p>
    <a routerLink="/recipes" mat-raised-button color="accent"
      >Explore Recipes</a
    >
  </div>`,
  styles: [
    `
      .content {
        text-align: center;
        padding: 2rem;
      }

      h1 {
        color: #3f51b5;
        margin-bottom: 0;
        font-size: 1.5rem;
      }
      h2 {
        color: #3f51b5;
        margin-bottom: 1rem;
        opacity: 0.6;
        font-size: 1rem;
      }

      p {
        color: #3f51b5;
        margin-bottom: 2rem;
      }

      button {
        padding: 1rem 2rem;
      }
    `,
  ],
})
export class HomepageComponent {}
