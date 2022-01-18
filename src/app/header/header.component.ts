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
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import {  AlertService } from '@app/_services';


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
  minLengthError = false;
  oldNewSame=false;
  oldIncorrect=false;
  updatePswdData;
  emptyOldPswd =false;
  oldIncorrectMsg;
  constructor(private accountService: AccountService,
      private commonService: CommonService,
      private modalService: NgbModal,
      private http: HttpClient,
      private alertService: AlertService

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
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.newConfirmMisMatch = false;
    this.minLengthError = false;
    this.oldNewSame=false;
    this.oldIncorrect=false;
    this.emptyOldPswd=false;
      this.modalService.open(targetModal, {
          centered: true,
          backdrop: 'static'
      });
  }

  //save change password
  saveChangePassword() {
      if (this.newPassword.toLowerCase() === this.confirmPassword.toLowerCase()) {
          this.newConfirmMisMatch = false;
      } else {
          this.newConfirmMisMatch = true;
      }

      if (this.oldPassword.toLowerCase() === this.newPassword.toLowerCase()) {
        this.oldNewSame = true;
    } else {
      this.oldNewSame = false;
    }
    
    if (this.oldPassword=='') {
      this.emptyOldPswd = true;
  } else {
    this.emptyOldPswd = false;
  }
      if(this.newPassword.length<8){
        this.minLengthError = true;
      }
      else{
        this.minLengthError = false;

      }
      this.updatePswdData = {
        'old_password':this.oldPassword,
        'new_password':this.newPassword
      }

      if(this.newConfirmMisMatch==false&&this.minLengthError ==false&&this.oldNewSame==false&&this.emptyOldPswd==false){
        this.http
        .put(`/home/user/changepassword/${this.user.id}?oldpassword=${this.oldPassword}&newpassword=${this.newPassword}`,{})
        .subscribe((response) => {
          console.log(response)
          this.modalService.dismissAll();

          this.alertService.success('Password changed Successfully!', { keepAfterRouteChange: true });
          setTimeout (() => {
            this.alertService.clear();
         }, 3000);
         
        },
        (error) => {
          this.oldIncorrect=true;
          this.oldIncorrectMsg = error;
        });
      }
        
      

  }


  ngOnDestroy(): void {
      this.subscriptionName.unsubscribe();
  }
}