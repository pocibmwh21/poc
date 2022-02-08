import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonService } from '@app/_services/common.service';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.less']
})
export class AboutusComponent implements OnInit {
  subscriptionName
  project;
  desc;
  descDetail;
  allProjects = [];
  productClicked = false;
  constructor(private commonService: CommonService,
    private accountService :AccountService) {
    this.subscriptionName = this.commonService.getProjectUpdate().subscribe(item => {
      this.project = item;
      console.log(this.project)

    });   
    this.accountService.getAllProjects();

   }
  
  ngOnInit(): void {
     //Get All Projects
     this.accountService.allProjectFields.subscribe(
      (data) => {
          this.allProjects = data;
          //include id in all project array for multiselect
         
          console.log("AllProjectnews: ", this.allProjects);
      },
      (error) => {
          // this.alertService.error(error);
      }
  );

  }

   
  onProductClick(data){    
    this.desc = this.allProjects.find(function(e) {
      return e.projectID == data
    })
    this.productClicked = true;
    $('.favyicon').css('display','none')
    document.getElementById(this.desc.pname).style.display = 'block'
    this.descDetail = this.desc.description;
    
  }

 }
