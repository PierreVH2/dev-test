import { Component } from '@angular/core';

import { UserService } from './restaurants/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private userService: UserService) {
    this.userService.initialise();
  }

  get authenticated(): boolean {
    return this.userService.isLoggedIn;
  }

  onSignIn(): void {
    this.userService.signIn();
  }

  onSignOut(): void {
    this.userService.signOut();
  }
}
