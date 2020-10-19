import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantsComponent } from 'app/restaurants/restaurants.component';
import { RestaurantRatingComponent } from './restaurant-rating/restaurant-rating.component';

const routes: Routes = [
  {
    path: '',
    component: RestaurantsComponent,
  },
  {
    path: 'rate',
    component: RestaurantRatingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantsRoutingModule {}
