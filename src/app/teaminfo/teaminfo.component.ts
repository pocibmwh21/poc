import {
  Component,
  OnInit
} from '@angular/core';
import {
  first
} from 'rxjs/operators';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  AccountService,
  AlertService
} from '@app/_services';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  environment
} from '@environments/environment';
import {
  HttpClient
} from '@angular/common/http';
import {
  IDropdownSettings
} from 'ng-multiselect-dropdown';
import { ExportExcelService } from '@app/_services/export-excel.service';
import { IfStmt } from '@angular/compiler';


@Component({
  selector: 'app-teaminfo',
  templateUrl: './teaminfo.component.html',
  styleUrls: ['./teaminfo.component.less']
})
export class TeaminfoComponent implements OnInit {
  
  users;
  totalSize;
  page;
  pageSize;
  public isCollapsed = false;
  teamDetails = null;
  projectlist = [];
  techlist = [];
  projectCommas;
  allSkills
  allSkillsArray 
  primarySkillArray = [];
  secondarySkillArray = [];
  certificateArray = [];
  project;
  selectedSkills
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsProject: IDropdownSettings = {};
  allProjects;
  selectedSkill =[];
  selectedProject =[];
  userInfo = null;
  allSkillsnNewLine = [];
  gotResponse = false;
  allUsers = [];
  dataForExcel = [];
  excelData = [];
   skillArray =[]
 projectArray =[];
 allCertificateArray =[];
 filterData ={};

  constructor(private accountService: AccountService,
      private modalService: NgbModal,
      private formBuilder: FormBuilder,
      private alertService: AlertService,
      private route: ActivatedRoute,
      private http: HttpClient,
      private router: Router,
      public ete: ExportExcelService) {
      this.accountService.getTeamData(0);
      this.accountService.getAllSkillSets();
  
    //   this.accountService.getAllProjects();

  }

  ngOnInit(): void {
      this.getTableData();
      this.getUserInfoDetails();
    this.getAllProjectAbout();
    this.getAllUsers();

      //dropdown setting for skill multiselect
      this.dropdownSettings = {
          idField: 'id',
          textField: 'technology',
          allowSearchFilter: true
      };

      //dropdown setting for project multiselect
      this.dropdownSettingsProject = {
          idField: 'projectID',
          textField: 'pname',
          allowSearchFilter: true

      };

      //Get All SkillSets
      this.accountService.allSkillFields.subscribe(
          (data) => {
              this.allSkillsArray = data;

              //include id in all skill array for multiselect
              this.allSkillsArray.map((obj, index) => {
                  obj.id = obj.id;
                  return obj
              })
              console.log("AllSkilnews: ", this.allSkillsArray);
          },
          (error) => {
              this.alertService.error(error);
          }
      );

      //get all certifications
      this.accountService.getAllCertifkn().subscribe(
        (data) => {
            this.allCertificateArray = data;

            //include id in all skill array for multiselect
            this.allCertificateArray.map((obj, index) => {
                obj.id = obj.id;
                return obj
            })
            console.log("Allcertnews: ", this.allCertificateArray);
        },
        (error) => {
            this.alertService.error(error);
        }
    );
          


  }
  //ngonit ends
      
  
  //Get All Projects

  getAllProjectAbout(){
    this.accountService.getAllProjectAbout().subscribe(
        (data) => {
            this.allProjects = data;
            //include id in all project array for multiselect
            this.allProjects.map((obj, index) => {
                obj.id = obj.projectID;
                return obj
            })       
            console.log(this.allProjects)
          },
        (error) => {
            this.alertService.error(error);
        }
    );
  }

  getTableData() {
      this.accountService.userInfoFields.subscribe(response => {
          this.teamDetails = response;
          this.totalSize = this.teamDetails.TotalItems;
          this.page = this.teamDetails.CurrentPage + 1;
          console.log(this.teamDetails.UserInfo)

      })
  }

  getUserInfoDetails() {
      this.accountService.teamInfoFields.subscribe(response => {
          this.gotResponse = true;
          this.userInfo = response;
          console.log(this.userInfo)
          this.userInfo.map((obj) => {
              this.projectlist = []
              obj.projects.forEach(element => {
                  this.projectlist.push(element.pname);
                  obj.projectList = this.projectlist;
                  obj.projectCommas = this.projectlist.join(', ')
                  return obj;
              });
          })
          //include project array and project commas in object
          this.userInfo.map((obj) => {
              this.primarySkillArray = [];
              this.secondarySkillArray = [];
              this.certificateArray = [];
              obj.skillSets.forEach((element) => {
                  if (element.skillCategory == 'primary') {
                      this.primarySkillArray.push(element.technology);
                      obj.primarySkill = this.primarySkillArray;
                  }
                  if (element.skillCategory == 'secondary') {
                      this.secondarySkillArray.push(element.technology);
                      obj.secondarySkill = this.secondarySkillArray;
                  }
                  this.allSkills = [...this.primarySkillArray, ...this.secondarySkillArray];
                  console.log(this.allSkills)
                  obj.allSkills = this.allSkills;

                  return obj;
              });
              obj.certifications.forEach((element) => {
                    this.certificateArray.push(element.name);
                    obj.certArray = this.certificateArray;
                    obj.certCommas = this.certificateArray.join(', ')
                return obj;
            });
              
          });
          console.log(this.userInfo)
      });

  }


  //apply filter
  applyFilter() {
    console.log(this.allSkillsArray)
    this.skillArray = [];
    this.projectArray = [];
    for(let i=0;i<this.selectedProject.length;i++){
      this.projectArray.push({"projectID":this.selectedProject[i].projectID})
    }
    
    for(let i=0;i<this.selectedSkill.length;i++){
      for(let j =0;j<this.allSkillsArray.length;j++){
        console.log(this.selectedSkill[i])
        console.log(this.allSkillsArray[j].technology)
        if(this.selectedSkill[i]==this.allSkillsArray[j].technology){
          this.skillArray.push({"id":this.allSkillsArray[j].id})
          break;
        }
      }
      // this.skillArray.push({"id":this.selectedSkill[i].id})
    }
       this.filterData = {'skills':this.skillArray,'projects':this.projectArray}
       this.filterDisplayData(this.filterData,this.page-1)
     
  }

filterDisplayData(filterData,page){
  if(this.skillArray.length == 0 && this.projectArray.length ==0){
    this.accountService.getTeamData(page);
    this.getTableData();
  }
  else{
    this.accountService.getFilterTableData(filterData,page).subscribe(
      (data) => {
        console.log(data);
        this.userInfo =data.UserInfo;
        this.totalSize = data.TotalItems;
        this.page = data.CurrentPage + 1;
  
        // this.allSkillSet.push(...data);
  
        // console.log('AllSkills:', this.allSkillSet);
      },
      (error) => {
        this.alertService.error(error);
      }
    );

  }
  
}
 
  //on page change

  onPageChange(page) {
      console.log(this.selectedSkill)
      console.log(this.selectedProject)
      console.log("pageNumber", page - 1)
      if(Object.entries(this.filterData).length === 0){
        this.accountService.getTeamData(page - 1);
        this.getTableData();
      }
      else{
        this.filterDisplayData(this.filterData,page-1)
      }


  }

  getAllUsers(){
    this.accountService.getAllUsers().subscribe(
      (data) => {
       console.log("all",data)
        this.allUsers =  [...data]

        this.allUsers.map((obj) => {
            this.projectlist = []
            if(obj.hasOwnProperty('projects')){
              obj.projects.forEach(element => {
                this.projectlist.push(element.pname);
                obj.projectList = this.projectlist;
                obj.projectCommas = this.projectlist.join(', ')
                return obj;
            });
            }
            
        })

        this.allUsers.map((obj) => {
          if(obj.mobileNo!=undefined)
         obj.mobile = obj.mobileNo.toString();
      })
      this.allUsers.map((obj) => {
        if(obj.empId!=undefined)
       obj.empIdString = obj.empId.toString();
    })

        this.allUsers.map((obj) => {
            this.techlist = []
            obj.techRoles.forEach(element => {
                this.techlist.push(element.title);
                obj.roleCommas = this.techlist.join(', ')
                return obj;
            });
        })

        this.allUsers.map((obj) => {
            this.primarySkillArray = [];
            this.secondarySkillArray = [];
            
            obj.skillSets.forEach((element) => {
                if (element.skillCategory == 'primary') {
                    this.primarySkillArray.push(element.technology);
                    obj.primarySkill = this.primarySkillArray.join(', ');
                }
                if (element.skillCategory == 'secondary') {
                    this.secondarySkillArray.push(element.technology);
                    obj.secondarySkill = this.secondarySkillArray.join(', ');;
                }
                this.allSkills = [...this.primarySkillArray, ...this.secondarySkillArray];
                console.log(this.allSkills)
                obj.allSkills = this.allSkills;

                return obj;
            });
        });
        console.log(this.allUsers)
      },
      (error) => {
          // this.alertService.error(error);
      }
  );
    
}
  //table to excel export
  excelToExport(){
      this.excelData = [];
      this.dataForExcel = [];
    for(let user of this.allUsers){
        this.excelData.push({Emp_Id:user.empIdString,FirstName:user.firstName,LastName:user.lastName,Project:user.projectCommas,Roles:user.roleCommas,Primary_Skill:user.primarySkill,Secondary_Skill:user.secondarySkill,Email:user.email,Designation:user.designation.title,Location:user.location.name,Gender:user.gender,Mobile_No:user.mobile})

    }
      console.log(this.excelData)
      console.log(this.allUsers)

    this.excelData.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })
  
      let reportData = {
        title: 'IBMW Team Information',
        data: this.dataForExcel,
        headers: Object.keys(this.excelData[0])
      }
  
      this.ete.exportExcel(reportData);
  }

}