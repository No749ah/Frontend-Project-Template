import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {TokenInfo} from './token-info';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class FrontendAuthService {
    constructor(
        // public Auth: AuthService,
        private router: Router,
        private cookieService: CookieService
    ) {
        const tokenCookie = this.cookieService.get('auth_token');
        if (tokenCookie) {
            const tokenInfo = this.parseJwt(tokenCookie);
            if (tokenInfo) {
                this.token$.next(tokenInfo);
                this.loggedIn$.next(true);
            }
        }
    }

    loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    token$: BehaviorSubject<TokenInfo | null> = new BehaviorSubject<TokenInfo | null>(null);

    /*login(email: string, password: string): Observable<unknown> {
        return this.Auth.authControllerLogin({body: {email, password}}).pipe(
            map((response) => {
                const token = response.access_token;
                this.loggedIn$.next(true);
                const tokenInfo = this.parseJwt(token);
                this.token$.next(tokenInfo);
                this.cookieService.delete('auth_token');
                this.cookieService.set('auth_token', token);

                this.router.navigate(['/bot/dashboard']);
                return response;
            }),
            catchError((error) => {
                this.loggedIn$.next(false);
                console.error(error);
                return throwError(error);
            })
        );
    }*/

    logout() {
        this.cookieService.delete('auth_token');  // Remove token from cookie
        this.token$.next(null);
        this.loggedIn$.next(false);
        this.router.navigate(['/']);
    }

    parseJwt(token: string): TokenInfo | null {
        try {
            const info = JSON.parse(atob(token.split('.')[1]));
            return new TokenInfo(
                token,
                info.exp,
                info.iat,
                info.role,
                info.email,
                info.name
            );
        } catch (e) {
            return null;
        }
    }

    public isTokenExpired(): boolean {
        const tokenInfo = this.token$.getValue();
        if (tokenInfo) {
            return tokenInfo.isExpired();
        }
        return true;
    }

    checkTokenValidity(): void {
        if (this.isTokenExpired()) {
            this.cookieService.delete('auth_token');
            this.logout();
        }
    }

    public checkIsAdmin(): boolean {
        const tokenCookie = this.cookieService.get('auth_token');
        if (tokenCookie) {

            const tokenInfo = this.parseJwt(tokenCookie);

            return !!(tokenInfo && !this.isTokenExpired() && tokenInfo.role === 'ADMIN');
        } else {
            return false
        }
    }

    public checkIsDev(): boolean {
        const tokenCookie = this.cookieService.get('auth_token');
        if (tokenCookie) {

            const tokenInfo = this.parseJwt(tokenCookie);

            return !!(tokenInfo && !this.isTokenExpired() && (tokenInfo.role === 'DEV' || tokenInfo.role === 'ADMIN'));
        } else {
            return false
        }
    }

    public getName(): string {
        const tokenCookie = this.cookieService.get('auth_token');
        if (tokenCookie) {
            const tokenInfo = this.parseJwt(tokenCookie);
            if (tokenInfo && tokenInfo.name) {
                return tokenInfo.name
            } else {
                throw new Error('name couldnt been found (No name)');
            }
        } else {
            throw new Error('name couldnt been found (No Token)');
        }
    }
}
