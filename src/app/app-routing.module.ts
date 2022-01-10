import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyinfoComponent } from './myinfo/myinfo.component';
import { TeaminfoComponent } from './teaminfo/teaminfo.component'
import { LeavetrackerComponent } from './leavetracker/leavetracker.component'
import { AboutusComponent } from './aboutus/aboutus.component'

import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);

const routes: Routes = [
    { path: '', component: MyinfoComponent, canActivate: [AuthGuard]},
    { path: 'home', component: MyinfoComponent, canActivate: [AuthGuard]},
    { path: 'teaminfo', component: TeaminfoComponent, canActivate: [AuthGuard]},
    { path: 'leavetracker', component: LeavetrackerComponent, canActivate: [AuthGuard]},
    { path: 'aboutus', component: AboutusComponent, canActivate: [AuthGuard]},
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes,{
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',           
        onSameUrlNavigation: 'reload'

          })],
    exports: [RouterModule]
})
export class AppRoutingModule { }