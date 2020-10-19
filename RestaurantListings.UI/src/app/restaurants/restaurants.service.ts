import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Restaurant } from 'app/restaurants/restaurants.models';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  constructor(private http: HttpClient) {}

  /**
   * Gets the available restaurants.
   */
  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>('/api/restaurants');
  }

  addRating(restaurantId: number, inputUserEmail: string, inputRating: number): Observable<Restaurant> {
    return this.http.post<Restaurant>(`/api/restaurants/rate/${restaurantId}`, {
      userEmail: inputUserEmail,
      rating: inputRating
    });
  }
}
