import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Restaurant } from '../restaurants.models';
import { RestaurantsService } from '../restaurants.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-restaurant-rating',
  templateUrl: './restaurant-rating.component.html',
  styleUrls: ['./restaurant-rating.component.scss'],
})
export class RestaurantRatingComponent implements OnInit {
  public get loggedIn$(): Observable<boolean> {
    return this.userService.loggedIn$;
  }

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private restaurantsService: RestaurantsService
  ) {}

  private restaurant: Restaurant | undefined;

  public get restaurantName(): string {
    return this.restaurant ? this.restaurant.name : 'NO RESTAURANT SELECTED';
  }

  public get isDisabled(): boolean {
    return !this.restaurant;
  }

  public get initialRating(): string {
    return this.restaurant ? this.restaurant.rating.toFixed(2) : '0';
  }

  public errorMessage = '';

  ngOnInit(): void {
    if (!this.userService.isLoggedIn) {
      alert('User not logged in');
      this.router.navigate(['/restaurants']);
      return;
    }

    this.route.queryParamMap.pipe(
      map(queryParams => +(queryParams.get('restaurant') || '0')),
      filter(restaurantId => restaurantId > 0),
      switchMap(restaurantId => this.restaurantsService.getRestaurants().pipe(
        map(restaurants => restaurants.find(restaurant => restaurant.id === restaurantId))
      ))
    ).subscribe(restaurant => {
      this.restaurant = restaurant;
    });
  }

  submitRating(inputRating: string): void {
    const rating = Number.isNaN(Number(inputRating)) ? 0 : Number(inputRating);
    if (rating < 1 || rating > 5) {
      alert('Invalid rating');
      return;
    }
    if (!this.restaurant) {
      alert('No restaurant specified');
      this.router.navigate(['/restaurants']);
      return;
    }
    this.restaurantsService.addRating(
      this.restaurant.id, this.userService.userEmail, rating
    ).subscribe(() => {
      this.router.navigate(['/restaurants']);
    }, httpError => {
      this.restaurant = undefined;
      const status = httpError && httpError.status ? +httpError.status : 0;
      switch (status) {
        case 401:
          this.errorMessage = 'Error setting rating for restaurant - user not logged in';
          break;
        case 403:
          this.errorMessage = 'Error setting rating for restaurant - user rating already submitted';
          break;
        case 404:
          this.errorMessage = 'Error setting rating for restaurant - restaurant does not exist';
          break;
        default:
          this.errorMessage = 'Error setting rating for restaurant - unknown error occurred';
      }
    });
  }

  cancelRating(): void {
    this.router.navigate(['/restaurants']);
  }
}
