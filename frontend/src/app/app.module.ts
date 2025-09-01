import ProjectModeValue from "../../project_mode/mode/projectmode";
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {RouterOutlet} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {MatIconModule} from "@angular/material/icon";
import {CookieService} from "ngx-cookie-service";
import {DatePipe, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app-routing.module";
import {TokenInterceptor} from "./functional-modules/auth/token-ineceptor.service";
import {VorlageComponent} from "./public-pages/floorboard/vorlage.component";

let rootUrl;

if (ProjectModeValue == 'testing') {
    rootUrl = "http://localhost:3000"
} else if (ProjectModeValue == 'docker') {
    rootUrl = "http://vorlage-api:3000"
} else if (ProjectModeValue == 'production') {
    rootUrl = "https://api.mydomain.com"
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({ declarations: [
        AppComponent,
        VorlageComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        MatIconModule,
        RouterOutlet], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        CookieService,
        DatePipe,
        {
            provide: LocationStrategy, useClass: HashLocationStrategy
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {
}
