import { Component } from '@angular/core';
import { CommunicationService } from '@app/_services';

import { AccountService } from './_services';
import { User } from './_models';
import { Subscription } from 'rxjs';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    user: User;
    messages: any[] = [];
    subscription: Subscription;

    constructor(private accountService: AccountService,
        private communicationService: CommunicationService
        ) {
        // this.subscription = this.communicationService.getHighlightedSection().subscribe(message => {
        //     if (message) {
        //       this.messages.push(message);
        //       console.log(this.messages)
        //     } else {
        //       // clear messages when empty message received
        //       this.messages = [];
        //     }
        //   });
        this.accountService.user.subscribe(x => 
            {
                
            this.user = x
        console.log(this.user)});
    }
    logout() {
        this.accountService.logout();
    }

}