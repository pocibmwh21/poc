import { Component, OnInit } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, AlertService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TeamInfo } from '@app/_models/teamInfo';

@Component({
  selector: 'app-teaminfo',
  templateUrl: './teaminfo.component.html',
  styleUrls: ['./teaminfo.component.less'],
})
export class TeaminfoComponent implements OnInit {
  users;
  totalSize;
  page;
  pageSize;
  public isCollapsed = false;
  teamDetails: TeamInfo;
  projectlist = [];
  projectCommas;
  primarySkillArray = [];
  secondarySkillArray = [];
  project;
  selectedSkills;
  allSkills;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsProject: IDropdownSettings = {};
  allProjects;
  selectedSkill;
  selectedProject;

  constructor(
    private accountService: AccountService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {

    this.getAllData();
  }

  ngOnInit(): void {
    //sample data
    this.allSkills = [
      {
        technology: 'Spring Data',
        skillCategory: 'primary',
      },
      {
        technology: 'Spring sec',
        skillCategory: 'primary',
      },
      {
        technology: 'Angular',
        skillCategory: 'secondary',
      },
      {
        technology: 'Javascript',
        skillCategory: 'secondary',
      },
    ];
    this.allProjects = [
      {
        pid: '61b03c0bfae8004836d03e4a',
        pname: 'IBMWatson',
        description: 'FHIR Project',
        status: true,
        startdate: null,
        enddate: null,
      },
      {
        pid: '61b03c0bfae8004836d03e4b',
        pname: 'Health_Insight',
        description: 'Health_Insight Projects',
        status: true,
        startdate: null,
        enddate: null,
      },
    ];

    //include id in all skill array for multiselect
    this.allSkills.map((obj, index) => {
      obj.id = index;
      return obj;
    });

    //include id in all project array for multiselect
    this.allProjects.map((obj, index) => {
      obj.id = index;
      return obj;
    });

    //dropdown setting for skill multiselect
    this.dropdownSettings = {
      idField: 'id',
      textField: 'technology',
    };

    //dropdown setting for project multiselect

    this.dropdownSettingsProject = {
      idField: 'id',
      textField: 'pname',
    };

    //include project array and project commas in object
    this.teamDetails.UserInfo.map((obj) => {
      this.projectlist = [];
      obj.projects.forEach((element) => {
        this.projectlist.push(element.pname);
        obj.projectList = this.projectlist;
        obj.projectCommas = this.projectlist.join(', ');
        return obj;
      });
    });

    //include project array and project commas in object
    this.teamDetails.UserInfo.map((obj) => {
      this.primarySkillArray = [];
      this.secondarySkillArray = [];
      obj.skillSets.forEach((element) => {
        if (element.skillCategory == 'primary') {
          this.primarySkillArray.push(element.technology);
          obj.primarySkill = this.primarySkillArray;
          // obj.skillCommas = this.allSkills[0]
        }
        if (element.skillCategory == 'secondary') {
          this.secondarySkillArray.push(element.technology);
          obj.secondarySkill = this.secondarySkillArray;
          // obj.skillCommas = this.allSkills[0]
        }
        return obj;
      });
    });
  }

  getAllData() {
    //Get TeamInfo table Data
    this.accountService
      .getTeamData()
      .pipe(map((data) => (this.teamDetails = <TeamInfo>data)))
      .subscribe(
        (data) => {
          this.totalSize = data.TotalItems;
          this.page = data.CurrentPage + 1;
          this.pageSize = data.TotalPages + 1;
        },
        (error) => {
          this.alertService.error(error);
        }
      );

    //Get All SkillSets
    this.accountService.getAllSkillSets().subscribe(
      (data) => {
    //   this.allSkills = data;
        console.log("AllSkils: ",this.allSkills);
      },
      (error) => {
        this.alertService.error(error);
      }
    );

     //Get All Projects
     this.accountService.getAllProjects().subscribe(
      (data) => {
    //   this.allProjects = data;
        console.log("AllProjects: ",this.allProjects);
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  //apply filter
  applyFilter() {
    console.log(this.selectedSkill);
    console.log(this.selectedProject);
  }

  //on page change

  onPageChange(page) {
    console.log(this.selectedSkill);
    console.log(this.selectedProject);
    console.log('pageNumber', page - 1);
  }
}
