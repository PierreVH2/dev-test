import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'restaurants',
  },
  {
    path: 'restaurants',
    loadChildren: () =>
      import('app/restaurants/restaurants.module').then(
        (m) => m.RestaurantsModule
      ),
  },
  {
    path: 'restaurants/**',
    loadChildren: () =>
      import('app/restaurants/restaurants.module').then(
        (m) => m.RestaurantsModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
