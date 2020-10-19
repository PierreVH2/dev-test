import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Restaurant } from 'app/restaurants/restaurants.models';
import { RestaurantsService } from 'app/restaurants/restaurants.service';
import { RestaurantFilter } from './restaurant-filters/restaurant-filters.component';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss'],
})
export class RestaurantsComponent implements OnInit {
  private availableTags: string[] = [];
  private restaurantsList: Restaurant[] = [];
  private filter$ = new BehaviorSubject<RestaurantFilter>({
    search: '',
    tagList: [],
    familyFriendly: false,
    vegan: false
  } as RestaurantFilter);

  public get tags(): string[] {
    return this.availableTags;
  }

  public get restaurants(): Restaurant[] {
    return this.restaurantsList.filter(restaurant => this.restaurantMatchesFilter(restaurant, this.filter$.getValue()));
  }

  constructor(private restaurantsService: RestaurantsService) {}

  ngOnInit(): void {
    this.restaurantsService.getRestaurants().subscribe(restaurants => {
      this.restaurantsList = restaurants;

      const tagsSet = restaurants.reduce((accumTags, nextRestaurant) => {
        nextRestaurant.tags.forEach(tag => accumTags.add(tag));
        return accumTags;
      }, new Set<string>());
      this.availableTags = [...tagsSet.values()].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    });
  }

  onFiltersChange(filters: RestaurantFilter): void {
    console.log(filters);
    this.filter$.next(filters);
  }

  private restaurantMatchesFilter(restaurant: Restaurant, filter: RestaurantFilter): boolean {
    const nameMatches = !filter.search || restaurant.name.toUpperCase().indexOf(filter.search.toUpperCase()) >= 0;
    const tagMatches = filter.tagList.length <= 0 || filter.tagList.reduce((allTagsMatched, nextTag) => {
      return allTagsMatched && (restaurant.tags.indexOf(nextTag) >= 0);
    }, true as boolean);
    const otherMatches = (!filter.vegan || restaurant.veganFriendly) && (!filter.familyFriendly || restaurant.familyFriendly);
    return nameMatches && tagMatches && otherMatches;
  }
}
