import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, AlertService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import {
  NgbDateStruct,
  NgbCalendar,
  NgbDate,
  NgbDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UserInfo } from '@app/_models/userInfo';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '@app/_services/common.service';

@Component({
  selector: 'app-myinfo',
  templateUrl: './myinfo.component.html',
  styleUrls: ['./myinfo.component.less'],
})
export class MyinfoComponent implements OnInit {
  //intialize variables
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  @ViewChild('myFileInput') myFileInput;
  userInfo: UserInfo;
  isEditForm = false;
  user;
  //fromDate: NgbDateStruct;
  //toDate: NgbDateStruct;
  editProfileForm: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  selectedItems = [];
  imageSrc: string;
  url = '';
  imagePath;
  primary = [];
  secondary = [];
  primaryEdit = [];
  secondaryEdit = [];
  primarySkillArray = [];
  secondarySkillArray = [];
  skillsObject = {};
  skillsArray = [];
  primarySkillBoolean = true;
  dropdownListPrim = [];
  dropdownListSec = [];
  selectedPrimItems = [];
  selectedSecItems = [];
  dropdownSettings: IDropdownSettings = {};
  currentLocation;
  projects = [];
  projectCommaSeparate;
  roles = [];
  formRole;
  data = {};
  skillSet = [];
  allPrimary = [];
  allSecondary = [];
  allInfos;
  allGender = [];
  techRoleList = [];
  selectedFile: File;
  retrievedImage: any;
  imageul: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  searchNewPrimarySkill;
  searchNewSecondarySkill;
  showAddNewPrimary = false;
  showAddNewSecondary = false;
  techRolesCommaSeparate;
  hoveredDate: NgbDate | null = null;
  extraPrimary = [];
  extraSecondary = [];
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  noImage;
  noImageAbbr;
  loadingImage = true;
  primarySet = [];
  secondarySet = [];
  allSkillSet = [];
  sendProject;
  location: any;
  photoId;
  fromDateFormatted;
  toDateFormatted;
  daysSelected: any[] = [];
  event: any;
  registerForm: any = FormGroup;
  leaveData;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  markDisabled;
  //intialize variables end

  //get user details on constructor
  constructor(
    private accountService: AccountService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private http: HttpClient,
    private commonService: CommonService,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig
  ) {
    this.markDisabled = (date: NgbDate) => calendar.getWeekday(date) >= 6;
    const current = new Date();
    config.minDate = {
      year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate()
    };
    //config.maxDate = { year: 2099, month: 12, day: 31 };
    config.outsideDays = 'hidden';
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.fromDateFormatted = this.fromDate.year + '-' + ('0' + (this.fromDate.month)).slice(-2) + '-' + ('0' + this.fromDate.day).slice(-2);
    this.toDateFormatted = this.toDate.year + '-' + ('0' + (this.toDate.month)).slice(-2) + '-' + ('0' + this.toDate.day).slice(-2);
  }

  ngOnInit(): void {
    this.user = this.accountService.userValue;
    this.userInfo = this.user.userInfo;
    console.log(this.userInfo);
    this.getImage();
    this.allInfos = {
      commonInfo: {
        locations: ['Bangalore', 'Kochi', 'Trivandrum', 'Hyderabad', 'Pune'],
        skillSets: [],
      },
    };

    this.accountService.getAllSkillSets();
    this.allGender = ['Male', 'Female', 'Others'];
    this.accountService.allSkillFields.subscribe(
      (data) => {
        console.log(data);
        this.allSkillSet = [];

        this.allSkillSet.push(...data);

        console.log('AllSkills:', this.allSkillSet);
      },
      (error) => {
        this.alertService.error(error);
      }
    );

    this.id = this.user.id;
    this.isAddMode = !this.id;
    this.userInfo = this.user.userInfo;
    this.noImageAbbr =
      this.userInfo.firstName[0].toUpperCase() +
      this.userInfo.lastName[0].toUpperCase();

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    //get project array and comma seprated
    for (let k = 0; k < this.userInfo.projects.length; k++) {
      this.projects.push(this.userInfo.projects[k]['pname']);
      console.log(this.projects);
      this.projectCommaSeparate = this.projects.join(', ');
    }
    //get roles array and comma seprated
    for (let k = 0; k < this.userInfo.techRoles.length; k++) {
      this.roles.push(this.userInfo.techRoles[k]['title']);
      this.techRolesCommaSeparate = this.roles.join(', ');
    }

    this.getSelectedPrimnSec(); //get the primary secondary slected and all skills


    //initalise form controls
    this.editProfileForm = this.formBuilder.group({
      empId: ['', Validators.required],
      username: ['', Validators.required],
      techstack: ['',
        [Validators.required,
        Validators.maxLength(20),
        ]
      ],
      mobileNo: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ],
      ],
      gender: ['', Validators.required],
      project: ['', Validators.required],
      location: [this.user.location, Validators.required],
      selectedPrim: [this.selectedPrimItems],
      selectedSec: [this.selectedSecItems],
    });

    //Add User form validations
    this.registerForm = this.formBuilder.group({
      imageInput: ['', [Validators.required]],

    });
  }

  //ngOnit ends

  //date range selection
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.fromDateFormatted = this.fromDate.year + '-' + ('0' + (this.fromDate.month)).slice(-2) + '-' + ('0' + this.fromDate.day).slice(-2);
      this.toDateFormatted = this.toDate.year + '-' + ('0' + (this.toDate.month)).slice(-2) + '-' + ('0' + this.toDate.day).slice(-2);
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.fromDateFormatted = this.fromDate.year + '-' + ('0' + (this.fromDate.month)).slice(-2) + '-' + ('0' + this.fromDate.day).slice(-2);
      this.toDateFormatted = this.toDate.year + '-' + ('0' + (this.toDate.month)).slice(-2) + '-' + ('0' + this.toDate.day).slice(-2);

    } else {
      this.toDate = null;
      this.fromDate = date;
      this.fromDateFormatted = this.fromDate.year + '-' + ('0' + (this.fromDate.month)).slice(-2) + '-' + ('0' + this.fromDate.day).slice(-2);
      this.toDateFormatted = null

    }

  }

  //on click of save in add leaves
  onLeaveUpdateSave() {
    console.log(this.fromDateFormatted)
    console.log(this.toDateFormatted)
    this.modalService.dismissAll();
    this.leaveData = { "fromDate": this.fromDateFormatted, "toDate": this.toDateFormatted, "user": { "id": this.user.id } }
    this.http
      .post(`/home/user/addleave`, this.leaveData)
      .subscribe((response) => {
        if (response) {
          this.alertService.success('Leaves updated saved successfully', { keepAfterRouteChange: false });
          setTimeout(() => {
            this.alertService.clear();
          }, 3000);
        }


      },
        (error) => {
          console.log(error)
          this.alertService.error(error, { keepAfterRouteChange: false });
        });


  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  // Function to get the primary secondary selected and all skills
  getSelectedPrimnSec() {
    this.dropdownListPrim = [];
    this.dropdownListSec = [];
    this.allPrimary = [];
    this.allSecondary = [];

    // //retrieve All skills
    for (let j = 0; j < this.allSkillSet.length; j++) {
      // for (let i = 0; i < this.allSkillSet[j].length; i++) {
      if (this.allSkillSet[j].skillCategory == 'primary') {
        this.allPrimary.push(this.allSkillSet[j].technology);
      }
      if (this.allSkillSet[j].skillCategory == 'secondary') {
        this.allSecondary.push(this.allSkillSet[j].technology);
      }
      // }
    }

    //making dropdown array for ng-multiseelect
    for (var j = 0; j < this.allPrimary.length; j++) {
      var objDrop = {};
      objDrop['skillId'] = j;
      objDrop['skill'] = this.allPrimary[j];

      this.dropdownListPrim.push(objDrop);
    }
    for (var j = 0; j < this.allSecondary.length; j++) {
      var objDrop = {};
      objDrop['skillId'] = j;
      objDrop['skill'] = this.allSecondary[j];
      this.dropdownListSec.push(objDrop);
    }

    //retrieve selected primary skills
    for (let i = 0; i < this.userInfo.skillSets.length; i++) {
      if (this.userInfo.skillSets[i].skillCategory == 'primary') {
        this.primary.push(this.userInfo.skillSets[i].technology);
        this.primaryEdit.push(this.userInfo.skillSets[i].technology);
      }
      if (this.userInfo.skillSets[i].skillCategory == 'secondary') {
        this.secondary.push(this.userInfo.skillSets[i].technology);
        this.secondaryEdit.push(this.userInfo.skillSets[i].technology);
      }
    }

    console.log(this.dropdownListPrim)
    for (var j = 0; j < this.primary.length; j++) {
      for (var k = 0; k < this.dropdownListPrim.length; k++) {
        if (this.primary[j] == this.dropdownListPrim[k].skill) {
          this.selectedPrimItems.push(this.dropdownListPrim[k]);
        }
      }
    }
    for (var j = 0; j < this.secondary.length; j++) {
      for (var k = 0; k < this.dropdownListSec.length; k++) {
        if (this.secondary[j] == this.dropdownListSec[k].skill) {
          this.selectedSecItems.push(this.dropdownListSec[k]);
        }
      }
    }

  }
  //function get the primary secondary slected and all skills ends

  //get the values of form fields using f
  get f() {
    return this.editProfileForm.controls;
  }

  //edit Form
  editForm() {
    this.dropdownSettings = {
      idField: 'skillId',
      textField: 'skill',
      allowSearchFilter: true,
      itemsShowLimit: 5,
      limitSelection: 5,
    };
    console.log(this.selectedPrimItems)
    console.log(this.selectedSecItems)

    this.primarySkillBoolean = true;
    this.isEditForm = true;
    this.showAddNewPrimary = false;
    this.showAddNewSecondary = false;
    if (this.userInfo.gender == null) {
      this.userInfo.gender = '';
    }
    if (this.userInfo.location.name == null) {
      this.userInfo.location.name = '';
    }
    this.editProfileForm.patchValue({
      empId: this.userInfo.empId,
      username: this.userInfo.email,
      techstack: this.listOfTechRoles(this.userInfo.techRoles),
      mobileNo: this.userInfo.mobileNo,
      project: this.listOfProjects(this.userInfo.projects),
      gender: this.userInfo.gender,
      location: this.userInfo.location.name,
      selectedPrim: [this.selectedPrimItems],
      selectedSec: [this.selectedSecItems],
    });
    this.selectedPrimItems = [];
    this.selectedSecItems = [];
    this.primary = [];
    this.secondary = [];
    this.primaryEdit = [];
    this.secondaryEdit = [];
    this.allPrimary = [];
    this.allSecondary = [];
    // this.primarySkillBoolean = true;
    this.getSelectedPrimnSec();


  }

  listOfProjects(item: any) {
    let list: string[] = [];

    item.forEach((element) => {
      list.push(element.pname);
    });

    return list;
  }

  listOfTechRoles(item: any) {
    let list: string[] = [];

    item.forEach((element) => {
      list.push(element.title);
    });

    return list;
  }

  //on  primary skill skill select on edit
  onItemSelectPrimary(item: any) {
    this.primaryEdit.push(item.skill);
  }

  //on  secondary skill skill select on edit
  onItemSelectSecondary(item: any) {
    this.secondaryEdit.push(item.skill);
  }

  //on  primary skill skill deselect on edit
  onItemDeSelectPrimary(item: any) {
    this.primaryEdit = this.primaryEdit.filter((el) => el !== item.skill);
  }

  //on  primary skill skill deselect on edit
  onItemDeSelectSecondary(item: any) {
    this.secondaryEdit = this.secondaryEdit.filter((el) => el !== item.skill);
  }

  //click on add Primary skill
  addPrimarySkill() {
    this.primarySkillBoolean = true;
  }

  //click on add secondary skill
  addSecondarySkill() {
    this.primarySkillBoolean = false;
  }
  //delete primary skill
  deletePrimarySkill(skill, i) {
    var id = 'prim' + i;
    this.selectedPrimItems = this.selectedPrimItems.filter(
      (el) => el.skill !== skill
    );
    document.getElementById(id).style.display = 'none';
    this.editProfileForm.patchValue({
      selectedPrim: this.selectedPrimItems,
    });
  }
  //delete secondary skill
  deleteSecondarySkill(secskill, j) {
    this.selectedSecItems = this.selectedSecItems.filter(
      (el) => el.skill !== secskill
    );
    var id = 'sec' + j;
    document.getElementById(id).style.display = 'none';
    this.editProfileForm.patchValue({
      selectedSec: this.selectedSecItems,
    });
  }

  //get text typed in search multiselect skills Primary
  onFilterChangPrimaryeSearch(event) {
    const component = this;
    $('.added').remove();
    this.searchNewPrimarySkill = event.replace(/\w\S*/g, (w) =>
      w.replace(/^\w/, (c) => c.toUpperCase())
    );

    if (
      this.allPrimary.indexOf(this.searchNewPrimarySkill) !== -1 ||
      event == ''
    ) {
      this.showAddNewPrimary = false;
    } else {
      // this.showAddNewPrimary = true;

      $('.prim-drop .filter-textbox').append(
        '<span style="margin-left:5%;margin-top:4%;display:inline-block;color: #909192;" class="added skill-text">No such skill please add new skill</span><img style="margin-top:4%" class="added float-right add-new-skill" src="../assets/img/plus-icon.png">'
      );
      //  document.getElementsByClassName("filter-textbox")[0].appendChild(btn)
    }
    $('.add-new-skill').click(function () {
      component.addNewPrimarySkills();
    });
  }

  //get text typed in search multiselect skills secondary
  onFilterChangSecondarySearch(event) {
    $('.addedsec').remove();
    const componentsec = this;
    this.searchNewSecondarySkill = event.replace(/\w\S*/g, (w) =>
      w.replace(/^\w/, (c) => c.toUpperCase())
    );

    if (
      this.allSecondary.indexOf(this.searchNewSecondarySkill) !== -1 ||
      event == ''
    ) {
      this.showAddNewSecondary = false;
    } else {
      // this.showAddNewSecondary = true;
      $('.sec-drop .filter-textbox').append(
        '<span style="margin-left:5%;margin-top:4%;display:inline-block;color: #909192;" class="addedsec skill-text">No such skill please add new skill</span><img style="margin-top:4%" class="addedsec float-right add-new-skill" src="../assets/img/plus-icon.png">'
      );
      //  document.getElementsByClassName("filter-textbox")[0].appendChild(btn)
    }
    $('.add-new-skill').click(function () {
      componentsec.addNewSecondarySkills();
    });
  }

  //on dropdown close primary
  onDropDownClosePrimary() {
    this.showAddNewPrimary = false;
    $('.added').remove();
  }

  //on dropdown close secondary
  onDropDownCloseSecondary() {
    $('.addedsec').remove();
    this.showAddNewSecondary = false;
  }

  //on click of + button to add new skills primary
  addNewPrimarySkills() {
    if (this.searchNewPrimarySkill != '')
      this.primaryEdit.push(this.searchNewPrimarySkill);
    this.extraPrimary.push({
      technology: this.searchNewPrimarySkill,
      skillCategory: 'primary',
    });
  }

  //on click of + button to add new skills secondary
  addNewSecondarySkills() {
    if (this.searchNewSecondarySkill != '')
      this.secondaryEdit.push(this.searchNewSecondarySkill);
    this.extraSecondary.push({
      technology: this.searchNewSecondarySkill,
      skillCategory: 'secondary',
    });
  }

  onSubmit() {
    this.submitted = true;
    this.skillSet = [];
    for (let i = 0; i < this.selectedPrimItems.length; i++) {
      this.skillSet.push({
        technology: this.selectedPrimItems[i].skill,
        skillCategory: 'primary',
      });
    }
    for (let j = 0; j < this.selectedSecItems.length; j++) {
      this.skillSet.push({
        technology: this.selectedSecItems[j].skill,
        skillCategory: 'secondary',
      });
    }

    this.skillSet = this.skillSet.concat(this.extraPrimary);
    this.skillSet = this.skillSet.concat(this.extraSecondary);
    this.primarySet = this.skillSet.filter((obj) => {
      return obj.skillCategory === 'primary';
    });
    this.secondarySet = this.skillSet.filter((obj) => {
      return obj.skillCategory === 'secondary';
    });

    this.techRoleList = this.f.techstack.value.toString().split(',');
    this.techRoleList = this.f.techstack.value.toString().split(',');
    var techRoleListJson = [];
    if (this.techRoleList.length > 0) {
      for (let i = 0; i < this.techRoleList.length; i++) {
        techRoleListJson.push({
          title: this.techRoleList[i],
        });
      }
    }

    this.location = {
      name: this.f.location.value,
    };

    // stop here if form is invalid
    if (
      this.editProfileForm.invalid ||
      this.primarySet.length == 0 ||
      this.secondarySet.length == 0
    ) {
      return;
    } else {
      this.isEditForm = false;
      this.data = {
        userInfo: {
          id: this.userInfo.id,
          firstName: this.userInfo.firstName,
          middleName: this.userInfo.middleName,
          lastName: this.userInfo.lastName,
          email: this.userInfo.email,
          empId: this.userInfo.empId,
          gender: this.f.gender.value,
          designation: this.userInfo.designation,
          mobileNo: this.f.mobileNo.value,
          location: this.location,
          techRoles: techRoleListJson,
          projects: this.userInfo.projects,
          skillSets: this.skillSet,
        },
      };
      console.log('data', this.data);
      this.accountService
        .update(this.user.id, this.data)
        .pipe(first())
        .subscribe(
          (data) => {
            console.log(data)
            this.alertService.success('Your changes are saved successfully', { keepAfterRouteChange: true });
            setTimeout(() => {
              this.alertService.clear();
            }, 5000);

            //   this.router.navigate(['/home', { relativeTo: this.route }]);
            // this.alertService.success('Your changes are saved successfully');

            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate([this.router.url]);

            //this.router.navigate(['/home']);
            //  this.modalService.dismissAll();
          },
          (error) => {
            console.log(error);
            this.alertService.error(error);
            this.loading = false;
          }
        );
    }
  }

  //cancel edit
  cancelEdit() {
    this.isEditForm = false;
    if (this.userInfo.gender == '') {
      this.userInfo.gender = null;
    }
    if (this.userInfo.location.name == '') {
      this.userInfo.location.name = null;
    }
  }

  //open add Leave model
  openModal(targetModal, user) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    });
  }

  //on project click
  onProjectSelect(project) {
    console.log(project);
    this.sendProject = project;
    this.commonService.sendUpdate(this.sendProject);
    this.router.navigateByUrl('/aboutus');
  }
  onFileChanged($event: any) {

    this.selectedFile = $event.target.files[0];

    if ($event.target.files && $event.target.files[0]) {
      let file = $event.target.files[0];

      if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/jpg") {
        this.upload();
      }

      else {
        this.myFileInput.nativeElement.value = '';
        this.alertService.error('please upload valid format', { keepAfterRouteChange: false });
      }

      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 2) {
        this.alertService.error('File size exceeds 2 MB', { keepAfterRouteChange: false });
      }
    }

  }
  upload() {
    this.myFileInput.nativeElement.value = '';
    this.alertService.error(null);
    console.log('file: ', this.selectedFile);
    const uploadImageData: FormData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile);
    uploadImageData.append('id', this.user.id);

    this.http
      .post(`/home/upload`, uploadImageData, {
        observe: 'response',
      })
      .subscribe((response) => {
        if (response.status === 200) {
          this.getImage();
          this.message = 'Image uploaded successfully';
        } else {
          this.message = 'Image not uploaded successfully';
        }
      });
  }
  //remove photo
  removePhoto() {
    this.retrieveResonse = null;
    this.retrievedImage = '';
    this.noImage = true;
    document.getElementById('hovering').style.background = '#d5e3ea';
    document.getElementById('remove-photo').style.display = 'none';
    console.log(this.photoId);
    this.accountService.deleteImage(this.photoId).subscribe((res) => {
      this.commonService.sendUpdate(this.retrieveResonse);
    });
  }
  getImage() {
    this.loadingImage = true;
    this.http
      .get(`/home/getphoto/` + this.user.id)
      .subscribe(
        (res) => {
          this.loadingImage = false;

          this.retrieveResonse = res;
          console.log(this.retrieveResonse);
          if (this.retrieveResonse == null) {
            this.noImage = true;
            document.getElementById('hovering').style.background = '#d5e3ea';
            document.getElementById('remove-photo').style.display = 'none';
          } else {
            this.photoId = this.retrieveResonse.id;
            this.noImage = false;
            document.getElementById('remove-photo').style.display =
              'inline-block';

            this.base64Data = this.retrieveResonse.data;
            console.log(this.base64Data);
            this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
            this.commonService.sendUpdate(this.retrievedImage);
          }
        },
        (error) => {
          this.noImage = true;
          document.getElementById('hovering').style.background = '#d5e3ea';
          document.getElementById('remove-photo').style.display = 'none';
          this.loading = false;
        }
      );
  }

  isSelected = (event: any) => {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    return this.daysSelected.find(x => x == date) ? "selected" : null;
  };

  select(event: any, calendardate: any) {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    const index = this.daysSelected.findIndex(x => x == date);
    if (index < 0) this.daysSelected.push(date);
    else this.daysSelected.splice(index, 1);

    calendardate.updateTodaysDate();
  }
  // addLeaves(){
  //   console.log(this.daysSelected)
  //    this.sorteddaysSelected= this.daysSelected.sort((a, b) => b > a ? 1: -1);

  // }
}
