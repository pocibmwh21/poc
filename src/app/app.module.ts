import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction';;
import { HeaderComponent } from './header/header.component' ;
import { MyinfoComponent } from './myinfo/myinfo.component';
import { TeaminfoComponent } from './teaminfo/teaminfo.component'
import { LeavetrackerComponent } from './leavetracker/leavetracker.component'
import { AboutusComponent } from './aboutus/aboutus.component'
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgxPaginationModule} from 'ngx-pagination'; 
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';

import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule} from '@angular/material/core';




FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin
]);


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule,
        FullCalendarModule,
        FormsModule,
        MatTooltipModule,
        NgxPaginationModule,
        NgMultiSelectDropDownModule.forRoot(),
       IvyCarouselModule,
       MatDatepickerModule,
       MatInputModule,
       MatMenuModule,
       MatNativeDateModule

        ],
    declarations: [
        AppComponent,
        AlertComponent,
        HeaderComponent,
        MyinfoComponent,
        TeaminfoComponent,
        LeavetrackerComponent,
        AboutusComponent
      ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };