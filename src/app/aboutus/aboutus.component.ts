import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonService } from '@app/_services/common.service';
import { AccountService, AlertService } from '@app/_services';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.less']
})
export class AboutusComponent implements OnInit {
  subscriptionName
  project = {};
  desc;
  descDetail;
  allProjects = [];
  productClicked = false;
  item ;
  projectName;
  resourceCount;
  projectCount;
  loading = false;
  loadingCarosel =  false;
  showCarosel =  false;


  constructor(private commonService: CommonService,
    private accountService :AccountService,
    private alertService:AlertService) {
   }
    ngAfterViewChecked() {
    if(this.projectName!=0){
      this.onProductClick(this.projectName)

    }
  }
  ngOnInit(): void {
    this.getAllProjects();
    this.getCount();
    this.subscriptionName = this.commonService.projectItem$
    .subscribe(item => {
      this.projectName = item
    })

  }
  getCount(){
    this.loading = true;
    this.accountService.getProjectResourceCount().subscribe(
      (data) => {
        this.loading = false;
        this.resourceCount =  data.ResourceCount
          this.projectCount =  data.ProjectCount


      },
      (error) => {
          this.alertService.error(error);
      }
  );
  }
  getAllProjects(){
    this.loadingCarosel = true
    
      this.accountService.getAllProjectAbout().subscribe(
          (data) => {
            this.loadingCarosel = false
            this.showCarosel = true
            this.allProjects = [...data];
          },
          (error) => {
              this.alertService.error(error);
          }
      );
    
  }
   
  onProductClick(data){  
    console.log(data)  
    this.projectName = data;
    this.productClicked = true;
    this.desc = this.allProjects.find(function(e) {
      return e.pname == data
    })
    $('.favyicon').css('display','none')
    document.getElementById(this.desc.pname).style.display = 'block'
    this.descDetail = this.desc.description;
    
  }

 }
