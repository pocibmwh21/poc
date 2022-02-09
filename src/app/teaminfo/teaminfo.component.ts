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
  primarySkillArray = [];
  secondarySkillArray = [];
  project;
  selectedSkills
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsProject: IDropdownSettings = {};
  allProjects;
  selectedSkill;
  selectedProject;
  userInfo = null;
  allSkillsnNewLine = [];
  gotResponse = false;
  allUsers = [];
  dataForExcel = [];
  excelData = [];

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
          idField: 'id',
          textField: 'pname',
          allowSearchFilter: true

      };

      //Get All SkillSets
      this.accountService.allSkillFields.subscribe(
          (data) => {
              this.allSkills = data;

              //include id in all skill array for multiselect
              this.allSkills.map((obj, index) => {
                  obj.id = index;
                  return obj
              })
              console.log("AllSkilnews: ", this.allSkills);
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
                obj.id = index;
                return obj
            })        },
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
          });
          console.log(this.userInfo)
      });

  }


  //apply filter
  applyFilter() {
      var skillArray = this.selectedSkill.map(item => item.technology);
      var projectArray = this.selectedProject.map(item => item.pname);
      console.log(skillArray)
      console.log(projectArray)
      var data = {'skills':skillArray,'projects':projectArray}
      console.log(data)
  }

  //on page change

  onPageChange(page) {
      console.log(this.selectedSkill)
      console.log(this.selectedProject)
      console.log("pageNumber", page - 1)
      this.accountService.getTeamData(page - 1);
      this.getTableData();


  }

  getAllUsers(){
    this.accountService.getAllUsers().subscribe(
      (data) => {
       console.log("all",data)
        this.allUsers =  [...data]

        this.allUsers.map((obj) => {
            this.projectlist = []
            obj.projects.forEach(element => {
                this.projectlist.push(element.pname);
                obj.projectList = this.projectlist;
                obj.projectCommas = this.projectlist.join(', ')
                return obj;
            });
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
        this.excelData.push({Emp_Id:user.empId,FirstName:user.firstName,LastName:user.lastName,Project:user.projectCommas,Roles:user.roleCommas,Primary_Skill:user.primarySkill,Secondary_Skill:user.secondarySkill,Email:user.email,Designation:user.designation.title,Location:user.location.name,Gender:user.gender,Mobile_No:user.mobileNo})

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