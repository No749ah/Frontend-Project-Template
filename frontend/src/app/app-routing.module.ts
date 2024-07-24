import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VorlageComponent} from "./public-pages/floorboard/vorlage.component";

const routes: Routes = [
    {path: '', component: VorlageComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
