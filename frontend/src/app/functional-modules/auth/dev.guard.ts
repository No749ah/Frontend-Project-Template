import {map} from "rxjs/operators";
import {FrontendAuthService} from "./frontendAuth.service";
import {inject} from "@angular/core";
import {CanActivateFn, Router} from "@angular/router";
import {CookieService} from 'ngx-cookie-service';

export const devGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(FrontendAuthService);
    const cookieService = inject(CookieService);

    return authService.loggedIn$
        .pipe(
            map(() => {
                const token = cookieService.get('auth_token');

                if (token) {
                    const tokenInfo = authService.parseJwt(token);

                    if (tokenInfo && !authService.isTokenExpired() && (tokenInfo.role === 'DEV' || tokenInfo.role === 'ADMIN')) {
                        return true;
                    }
                }

                const pathAfterBaseHref = window.location.hash;
                const path = pathAfterBaseHref.startsWith('#') ? pathAfterBaseHref.substring(1) : pathAfterBaseHref;
                router.navigate(['/auth/login'], {queryParams: {returnUrl: path}});
                return false;
            })
        );
};
