import { Injectable } from '@angular/core';
import { OAuthService, UserInfo } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from 'app/auth.config';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private email = new BehaviorSubject<string>('');

  public get isLoggedIn(): boolean {
      return !!this.email.getValue();
  }

  public get userEmail(): string {
      return this.email.getValue();
  }

  public get loggedIn$(): Observable<boolean> {
    return this.email.asObservable().pipe(
      map(email => !!email)
    );
  }

  public get userEmail$(): Observable<string> {
      return this.email.asObservable();
  }

  constructor(private oauthService: OAuthService) {}

  public initialise(): void {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
        this.oauthService.loadUserProfile().then((userInfo: UserInfo) => {
            this.email.next(userInfo.name || '');
        }).catch(() => {
            this.email.next('');
        });
    }).catch(() => {
        this.email.next('');
    });
  }

  public signIn(): void {
    this.oauthService.initCodeFlow();
  }

  public signOut(): void {
    this.oauthService.logOut();
  }
}
