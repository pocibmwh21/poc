import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { User } from '@app/_models';
import { Subscription } from 'rxjs';
import { CommonService } from '@app/_services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: User;
  retrievedImage: any;
  private subscriptionName: Subscription;
  noImageAbbr;

  constructor(private accountService: AccountService,
    private commonService: CommonService) {
    this.user = this.accountService.userValue;
 //   this.retrievedImage = localStorage.getItem("imgSrc");
    localStorage.removeItem("imgSrc");
    this.noImageAbbr = this.user.userInfo.firstName[0].toUpperCase()+this.user.userInfo.lastName[0].toUpperCase();
    this.subscriptionName = this.commonService.getUpdate().subscribe
      (item => {
        this.retrievedImage = item;
      });
  }


  ngOnInit(): void {
  }

  logout() {
    this.accountService.logout();
  }

  ngOnDestroy(): void {
    this.subscriptionName.unsubscribe();
  }
}
