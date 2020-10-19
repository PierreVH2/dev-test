import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'app/restaurants/restaurants.models';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-restaurant-item',
  templateUrl: './restaurant-item.component.html',
  styleUrls: ['./restaurant-item.component.scss'],
})
export class RestaurantItemComponent {
  @Input()
  restaurant!: Restaurant;

  public get loggedIn$(): Observable<boolean> {
    return this.userService.loggedIn$;
  }

  constructor(private router: Router, private userService: UserService) {}

  rateRestaurant(): void {
    this.router.navigate(['/restaurants/rate'], {
      queryParams: {
        restaurant: this.restaurant.id
      }
    });
  }
}
