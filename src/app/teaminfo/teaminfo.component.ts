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
  projectCommas;
  allSkills
  primarySkillArray = [];
  secondarySkillArray = [];
  project;
  selectedSkills
  allskills;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsProject: IDropdownSettings = {};
  allProjects;
  selectedSkill;
  selectedProject;
  userInfo = null;
  allSkillsnNewLine = [];
  gotResponse = false;

  constructor(private accountService: AccountService,
      private modalService: NgbModal,
      private formBuilder: FormBuilder,
      private alertService: AlertService,
      private route: ActivatedRoute,
      private http: HttpClient,
      private router: Router) {
      this.accountService.getTeamData(0);
      this.accountService.getAllSkillSets();
      this.accountService.getAllProjects();

  }

  ngOnInit(): void {
      this.getTableData();
      this.getUserInfoDetails();

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

      //Get All Projects
      this.accountService.allProjectFields.subscribe(
          (data) => {
              this.allProjects = data;
              //include id in all project array for multiselect
              this.allProjects.map((obj, index) => {
                  obj.id = index;
                  return obj
              })
              console.log("AllProjectnews: ", this.allProjects);
          },
          (error) => {
              this.alertService.error(error);
          }
      );


  }
  //ngonit ends


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
      console.log(this.selectedSkill)
      console.log(this.selectedProject)
  }

  //on page change

  onPageChange(page) {
      console.log(this.selectedSkill)
      console.log(this.selectedProject)
      console.log("pageNumber", page - 1)
      this.accountService.getTeamData(page - 1);
      this.getTableData();


  }

}