import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  AccountService
} from '@app/_services';
import {
  User
} from '@app/_models';
import {
  Subscription
} from 'rxjs';
import {
  CommonService
} from '@app/_services/common.service';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';

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
  oldPassword: String;
  newPassword: String;
  confirmPassword: String;
  newConfirmMisMatch = false;

  constructor(private accountService: AccountService,
      private commonService: CommonService,
      private modalService: NgbModal,
  ) {
      this.user = this.accountService.userValue;
      this.noImageAbbr = this.user.userInfo.firstName[0].toUpperCase() + this.user.userInfo.lastName[0].toUpperCase();
      this.subscriptionName = this.commonService.getUpdate().subscribe(item => {
          this.retrievedImage = item;
      });
  }


  ngOnInit(): void {}

  logout() {
      this.accountService.logout();
  }

  //open add Leave model
  openModal(targetModal) {
      this.modalService.open(targetModal, {
          centered: true,
          backdrop: 'static'
      });
  }

  //save change password
  saveChangePassword() {
      console.log(this.oldPassword)
      console.log(this.newPassword)
      console.log(this.confirmPassword)

      if (this.newPassword === this.confirmPassword) {
          this.newConfirmMisMatch = false;
      } else {
          this.newConfirmMisMatch = true;
      }

  }


  ngOnDestroy(): void {
      this.subscriptionName.unsubscribe();
  }
}