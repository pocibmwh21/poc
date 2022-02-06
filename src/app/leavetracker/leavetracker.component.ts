import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  ViewChildren
} from '@angular/core';
import {
  FullCalendarComponent,
  CalendarOptions
} from '@fullcalendar/angular';
import {
  EventInput,
  Calendar
} from "@fullcalendar/core";

import {
  NgbPopover,
  NgbDate,
  NgbCalendar,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
    NgbDateStruct,
NgbDatepickerConfig
  } from '@ng-bootstrap/ng-bootstrap';
import {
  Container
} from '@angular/compiler/src/i18n/i18n_ast';
import {
  from
} from 'rxjs';
import {
  AccountService, AlertService
} from '@app/_services';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-leavetracker',
  templateUrl: './leavetracker.component.html',
  styleUrls: ['./leavetracker.component.less']
})
export class LeavetrackerComponent implements OnInit {
  // references the #calendar in the template
  @ViewChild('calendar', {
      static: false
  }) calendarComponent: FullCalendarComponent;

    // references the #calendar in the template
    @ViewChild('monthcalender', {
        static: false
    }) monthcalendarComponent: FullCalendarComponent;

  handelDateClick: any;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  hoveredDate: NgbDate | null = null;
  calendarApi: Calendar;
  monthcalenderApi: Calendar;
  totalRecords: string;
  page: number = 1;
  publicHolidayData = [];
  data = [];
  fullDates = [];
  listDates = [];
  user;
  publicHolidayDisplay = [];
  
  daysSelected: any[] = [];
  event: any;
  currentMonth;
  currentYear;
  updatedLeaves = [];
  daysSelectedLid = [];
  sorteddaysSelected = [];
  formatedarray = [];
  from;
  to;
  index;
  formatedarraySet:any;
  daysSelectedset:any;
  dataSet:any;
  todayDate;
  inBtwnDates = [];
  inBtwnDatesFormatted = [];
  found;
  notFound;
  userid;
  dataFromBackend ={};
  allLeaves = {};
  calendarOptions :CalendarOptions
  calendarOptionstest:CalendarOptions = {
    initialView: 'dayGridDay',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridDay'
    },
    
};  
base64Data;
  retrievedImage;
  deleteLeavesData = [];
  leaveLid = [];

  fromDateFormatted;
  toDateFormatted;
  markDisabled;
  leaveData;
  insideData = false;
  listDatesUser = [];
  allUserLeaves = [];
  isDisabled;
  //sample data

  public_holiday = [{
      '2022-01-26': 'Republic Day'
  }, {
      '2022-04-15': 'Good Friday'
  }, {
      '2022-05-01': 'May Day'
  }, {
      '2022-05-03': 'Ramzan'
  }, {
      '2022-08-15': 'Independence Day'
  }, {
      '2022-08-31': 'Vinayak Chathurti'
  }, {
      '2022-10-02': 'Gandhi Jayanthi'
  }, {
      '2022-10-05': 'Vijayadashami'
  }, {
      '2022-10-26': 'Deepavali'
  }, {
      '2022-11-01': 'Kannada Rajosthsava'
  }]

  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//   backEnddata = {
//       "2022": [{
//           "January": [{
//                   "1": {
//                       "userName": "Neethu",
//                       "projectName": "FHIR",
//                       "photo": "fasfasdfa",
//                       "leaves": [{
//                               "lid": 5,
//                               "fromDate": "2022-01-20",
//                               "toDate": "2022-01-20"
//                           },
//                           {
//                               "lid": 8,
//                               "fromDate": "2022-01-23",
//                               "toDate": "2022-01-25"
//                           }
//                       ]
//                   }
//               },
//               {
//                   "16": {
//                       "userName": "Jonah",
//                       "projectName": "FHIR",
//                       "photo": "fasfasdfa",
//                       "leaves": [{
//                               "lid": 5,
//                               "fromDate": "2022-01-20",
//                               "toDate": "2022-01-20"
//                           },
//                           {
//                               "lid": 8,
//                               "fromDate": "2022-01-23",
//                               "toDate": "2022-01-25"
//                           }
//                       ]
//                   }
//               },
//               {
//                   "17": {
//                       "userName": "Test",
//                       "projectName": "IBMW",
//                       "photo": "fasfasdfa",
//                       "leaves": [{
//                               "lid": 5,
//                               "fromDate": "2022-01-27",
//                               "toDate": "2022-01-27"
//                           },
//                           {
//                               "lid": 8,
//                               "fromDate": "2022-02-01",
//                               "toDate": "2022-02-05"
//                           },
//                           {
//                             "lid": 4,
//                             "fromDate": "2022-03-01",
//                             "toDate": "2022-03-05"
//                         },
//                         {
//                             "lid": 4,
//                             "fromDate": "2022-03-01",
//                             "toDate": "2022-03-05"
//                         }
//                       ]
//                   }
//               }
//           ]
//       }]

//   }

  tableData = [

      {
          date: '15-18-Oct 2021'
      },
      {
          date: '15-19-Oct 2021'
      },
      {
          date: '15-19-Oct 2021'
      },
      {
          date: '15-19-Oct 2021'
      },
      {
          date: '15-19-Oct 2021'
      },
      {
          date: '15-19-Oct 2021'
      },
      {
          date: '15-19-Oct 2021'
      },
      {
          date: '15-19-Oct 2021'
      },
      {
          date: '15-19-Oct 2021'
      },
      {
          date: '15-20-Oct 2021'
      }

  ];

  date: {year: number, month: number};
  
  disabledDates: NgbDateStruct[] = [ 
    {year: 2050, month:4, day:10},
  
  ]
  @ViewChildren('deleteItem') item;
  selectedIds = [];
  constructor(private calendar: NgbCalendar,
      private accountService: AccountService,
      private http: HttpClient,
      private renderer:Renderer2,
      private modalService: NgbModal,
      private alertService: AlertService,
      private config: NgbDatepickerConfig,
      private route: ActivatedRoute,
      private router: Router,
      ) {
      this.user = this.accountService.userValue;
      this.markDisabled = (date: NgbDate) =>{
        calendar.getWeekday(date) >= 6;
      } 
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
      
     
   
      // console.log(this.data)
  }


  ngOnInit(): void {
    let currentDate = new Date();
      let cDay = currentDate.getDate()
      let cMonthName = this.month[currentDate.getMonth()].toUpperCase();
      let cMonth = currentDate.getMonth()+1
      let cYear = currentDate.getFullYear();
      this.getAllLeaves();
      this.getLeaveData(cMonth,cYear,cMonthName)
  }
  ngAfterViewChecked() {
      this.calendarApi = this.calendarComponent.getApi();
      this.monthcalenderApi =  this.monthcalendarComponent.getApi();
    // this.calendarApi.next();
  }
  ngAfterViewInit() {
    const monthPrevBtn = document.querySelectorAll(
      '.mat-calendar-previous-button'
    );
    const monthNextBtn = document.querySelectorAll('.mat-calendar-next-button');

    if (monthPrevBtn) {
      Array.from(monthPrevBtn).forEach((button) => {
        this.renderer.listen(button, 'click', (event) => {
         console.log("pre",event)
        });
      });
    }

    if (monthNextBtn) {
      Array.from(monthNextBtn).forEach((button) => {
        this.renderer.listen(button, 'click', (event) => {
            console.log("net",event)

        });
      });
    }
  }

  //get leave data from api
  getLeaveData(cMonth,cYear,cMonthName){
    this.insideData =false;

    this.accountService.getAllLeavesByMonthYear(cMonth,cYear).subscribe(
        (data) => {
            this.dataFromBackend = {...data};
            this.insideData =true;
            this.convertJsonData(cMonthName,cYear);

    
        },
        (error) => {
            // this.alertService.error(error);
        }
    );
  }
  getAllLeaves(){
    this.accountService.getAllLeaves().subscribe(
      (data) => {
          this.allLeaves = {...data};
          this.processAllLeaves()
        console.log(this.allLeaves)
  
      },
      (error) => {
          // this.alertService.error(error);
      }
  );
}
processAllLeaves(){
  for(let yearkey in this.allLeaves){

    for(let monthkey in this.allLeaves[yearkey]){
      for(let idkey in this.allLeaves[yearkey][monthkey]){
        if(idkey == this.user.id){
          console.log(this.allLeaves[yearkey][monthkey][idkey]['leaves'])
          for(let item of this.allLeaves[yearkey][monthkey][idkey]['leaves']){

            this.allUserLeaves.push(item)
          }

        }
      }
    }
  }
  console.log(this.allUserLeaves)
  this.convertUserLeaveNgbDateArray();
}
convertUserLeaveNgbDateArray(){
  for(var leaves of  this.allUserLeaves){
    if(!(leaves.hasOwnProperty('toDate'))){
      console.log(new Date(leaves.fromDate).getFullYear(),new Date(leaves.fromDate).getMonth()+1,new Date(leaves.fromDate).getDate());
      console.log({year:new Date(leaves.fromDate).getFullYear(),month:new Date(leaves.fromDate).getMonth()+1,day:new Date(leaves.fromDate).getDate()})
      this.disabledDates.push({year:new Date(leaves.fromDate).getFullYear(),month:new Date(leaves.fromDate).getMonth()+1,day:new Date(leaves.fromDate).getDate()})
    }
    else{
      this.listDatesUser = this.getDates(new Date(leaves.fromDate), new Date(leaves.toDate))
      for(var list=0;list<this.listDatesUser.length;list++){
        this.disabledDates.push({year:new Date(this.listDatesUser[list]).getFullYear(),month:new Date(this.listDatesUser[list]).getMonth()+1,day:new Date(this.listDatesUser[list]).getDate()})
      }

    }
  }
  this.isDisabled = (date: NgbDateStruct,dates:NgbDate, current: {month: number,year: number})=> {

    return this.disabledDates.find(x => NgbDate.from(x).equals(date)) || this.calendar.getWeekday(dates) >= 6? true: false;
  }

  console.log(this.disabledDates)
}
  convertJsonData(cMonth,cYear){
      this.data = [];
      this.publicHolidayData = [];
      this.deleteLeavesData = [];
         //push public holiday data to main data of full calender and convert date to display
         for (let obj of this.public_holiday) {
            console.log("object:", obj);
            for (let key in obj) {
                var day = new Date(key);
                console.log(day)
                var date = day.getDate() + ' ' + this.month[day.getMonth()] + ' ' + day.getFullYear();
                this.publicHolidayDisplay.push({
                    'date': date,
                    'description': obj[key]
                })
                this.publicHolidayData.push({
                    date: key,
                    title: '',
                    extendedProps: {
                        holiday: 'true',
                        description: obj[key]
                    },
                    display: 'background',
                    color: '#649615'
                })
            }
        }
        this.data.push(...this.publicHolidayData)


     //conerting data from back end to data for full calender
         for (let key in this.dataFromBackend[cMonth]) {
             console.log(this.dataFromBackend[cMonth][key]['leaves'])
             for (let leaves of this.dataFromBackend[cMonth][key]['leaves']) {
                 console.log(leaves)
                 if (key == this.user.id) {
                    if(!(leaves.hasOwnProperty('toDate'))){
                      leaves['toDate'] = leaves.fromDate
                    }
                    // var fromDateday = new Date(leaves.fromDate);
                    // var toDateday = new Date(leaves.toDate);

                    // console.log(day)
                    // leaves.fromDate = fromDateday.getDate() + ' ' + this.month[fromDateday.getMonth()].substring(0,3) + ' ' + fromDateday.getFullYear();
                    // leaves.toDate = toDateday.getDate() + ' ' + this.month[toDateday.getMonth()].substring(0,3) + ' ' + toDateday.getFullYear();

                     this.deleteLeavesData.push(leaves)
                 }
                 if (leaves.fromDate == leaves.toDate|| !(leaves.hasOwnProperty('toDate'))) {
                     if (key == this.user.id) {
                         this.daysSelectedLid.push({"date":leaves.fromDate,"lid":leaves.lid})
                         this.daysSelected.push(leaves.fromDate)
                         this.data.push({
                             name: this.dataFromBackend[cMonth][key]['userName'],
                             project: this.dataFromBackend[cMonth][key]['projectName'],
                             date: leaves.fromDate,
                             title: '',
                             display: 'background',
                             color: '#0072C7'
                         })
                     } else {
                        this.base64Data =  this.dataFromBackend[cMonth][key]['photo'];
                        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
                         this.data.push({
                             name: this.dataFromBackend[cMonth][key]['userName'],
                             project: this.dataFromBackend[cMonth][key]['projectName'],
                             date: leaves.fromDate,
                             imageUrl: this.retrievedImage
                         })
                     }

                 } else {
                     this.listDates = this.getDates(new Date(leaves.fromDate), new Date(leaves.toDate))
                     for (var j = 0; j < this.listDates.length; j++) {
                         if (key == this.user.id) {
                           console.log(new Date(this.listDates[j]).getDay())
                            this.daysSelectedLid.push({"date":this.listDates[j].toISOString().slice(0, 10),"lid":leaves.lid})
                           this.daysSelected.push(this.listDates[j].toISOString().slice(0, 10))
                           if(new Date(this.listDates[j]).getDay()!=6 && new Date(this.listDates[j]).getDay()!=0){
                             this.data.push({
                                 name: this.dataFromBackend[cMonth][key]['userName'],
                                 project: this.dataFromBackend[cMonth][key]['projectName'],
                                 date: this.listDates[j].toISOString().slice(0, 10),
                                 title: '',
                                 display: 'background',
                                 color: '#0072C7'
                             })
                            }
                         } else {
                            this.base64Data =  this.dataFromBackend[cMonth][key]['photo'];
                            this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
                           
                           
                          //  if(this.base64Data != undefined ){
                            if(new Date(this.listDates[j]).getDay()!=6 && new Date(this.listDates[j]).getDay()!=0){

                             this.data.push({
                                 name: this.dataFromBackend[cMonth][key]['userName'],
                                 project: this.dataFromBackend[cMonth][key]['projectName'],
                                 date: this.listDates[j].toISOString().slice(0, 10),
                                 imageUrl: this.retrievedImage
                             })
                            }
                          //  }

                          //  else{
                          //   console.log(this.dataFromBackend[cMonth][key]['userName'])
                          //   if(new Date(this.listDates[j]).getDay()!=6 && new Date(this.listDates[j]).getDay()!=0){

                          //     this.data.push({
                          //         name: this.dataFromBackend[cMonth][key]['userName'],
                          //         project: this.dataFromBackend[cMonth][key]['projectName'],
                          //         date: this.listDates[j].toISOString().slice(0, 10),
                          //             nophoto: 'true',
                                
                          //     })
                          //    }
                          //  }
                            
                          

                         }

                     }
                 }

             }

         }

         //remove duplicates
        this.dataSet= new Set(this.data)
        console.log(this.dataSet)
        this.data = Array.from(this.dataSet)
        console.log(this.data)     
         
        // update calender
        this.calendarOptions = {
            initialView: 'dayGridMonth',
            dayMaxEventRows: 4, // allow "more" link when too many events
            eventContent: this.renderEventContent, // This will render the event with image 
            events: this.data,
            customButtons: {
              next: {
                  click: this.nextMonth.bind(this),
              },
              prev: {
                  click: this.prevMonth.bind(this),
              }
          },
            dateClick: this.getClickedSpecificDate.bind(this)
        };

        this.calendarOptionstest = {
            eventContent: this.renderEventContentForDay, // This will render the event with image
            events: this.data
        };

        
  }
  getClickedSpecificDate(arg) {
    console.log(arg.date)
    console.log(this.data)
    this.calendarApi.gotoDate(arg.date)
   

}



  //on click of next month
  nextMonth(): void {
    console.log(this.data)

    this.monthcalenderApi.next();
    this.getCurrentMonthYear(this.monthcalenderApi.currentData.viewTitle.split(" "))
    this.updateData()
   


  }
  //on click of prev month
  prevMonth(): void {
    this.monthcalenderApi.prev();
    this.getCurrentMonthYear(this.monthcalenderApi.currentData.viewTitle.split(" "))
    this.updateData()

  }

  getCurrentMonthYear(arrayMonthYear){
    for(var i=0;i<arrayMonthYear.length;i++){
        this.currentMonth = arrayMonthYear[0]
        this.currentYear = arrayMonthYear[1]

    }
  }

  updateData(){
      console.log(this.currentMonth);
      console.log(this.currentYear);
      let cMonthName = this.currentMonth.toUpperCase();
      let curentMonthIndex = (element) => element == this.currentMonth;
      let cMonth = this.month.findIndex(curentMonthIndex)+1
      let cYear = this.currentYear
      this.getLeaveData(cMonth,cYear,cMonthName)

      
  }
  deleteLeaves(){

    // this.leaveLid.push(lid)
    // console.log(this.leaveLid)
    this.modalService.dismissAll();
    this.accountService.deleteLeave(this.selectedIds).subscribe((res) => {
          
        setTimeout(() => {
          this.alertService.clear();
        }, 5000);
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([this.router.url]);
          this.alertService.success('Leaves deleted successfully', { keepAfterRouteChange: false });


    },
      (error) => {
        console.log(error)
        this.alertService.error(error, { keepAfterRouteChange: false });
      });
  }
//open add Leave model
openModal(targetModal) {
  this.selectedIds = [];
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    });

  }

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
      this.toDateFormatted = this.fromDateFormatted
  
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
 

  //delete leaves
  OnCheckboxSelect(id, event) {
    if (event.target.checked === true) {
      this.selectedIds.push(id);
      console.log('Selected Ids ', this.selectedIds);
    }
    if (event.target.checked === false) {
      this.selectedIds = this.selectedIds.filter((item) => item !== id);
    }
  }
   //on click of save in add leaves
   onLeaveUpdateSave() {
    console.log(this.fromDateFormatted)
    console.log(this.toDateFormatted)
    this.modalService.dismissAll();
    this.leaveData = { "fromDate": this.fromDateFormatted, "toDate": this.toDateFormatted, "user": { "id": this.user.id } }
    this.http
      .post(`/home/leave/addleave`, this.leaveData)
      .subscribe((response) => {
        if (response) {
          
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate([this.router.url]);
            this.alertService.success('Leaves updated saved successfully', { keepAfterRouteChange: false });

          
        }


      },
        (error) => {
          console.log(error)
          this.alertService.error(error, { keepAfterRouteChange: false });
        });


  }
  // Returns an array of dates between the two dates
  getDates(startDate, endDate) {
      const dates = []
      let currentDate = startDate
      const addDays = function(days) {
          const date = new Date(this.valueOf())
          date.setDate(date.getDate() + days)
          return date
      }
      while (currentDate <= endDate) {
          dates.push(currentDate)
          currentDate = addDays.call(currentDate, 1)
      }
      return dates
  }

  //on calender date click navigate the right calender date aswell
 


  //Event Render Function
  renderEventContent(eventInfo, createElement) {
      var innerHtml;
      //Check if event has image
      if (eventInfo.event._def.extendedProps.holiday) {
        console.log(eventInfo.event._def.extendedProps);

        innerHtml = eventInfo.event._def.title + "<span></span>";
        return createElement = {
            html: '<div style="margin-top: 29%;text-align: center;font-weight: bold;">' + eventInfo.event._def.extendedProps.description + '</div>'
        }
    }
      if (eventInfo.event._def.extendedProps.imageUrl && eventInfo.event._def.extendedProps.imageUrl!="data:image/jpeg;base64,undefined") {
          // Store custom html code in variable
          innerHtml = eventInfo.event._def.title + "<img style='display:inline;width:20px;height:20px;border-radius: 50%;opacity: 1;/* opacity: 8; */' src='" + eventInfo.event._def.extendedProps.imageUrl + "'>" + "<span style='color:black;color: #FFFFFF;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span>";
          //Event with rendering html
          return createElement = {
              html: innerHtml
          }
      }
      
      if (eventInfo.event._def.extendedProps.imageUrl && eventInfo.event._def.extendedProps.imageUrl=="data:image/jpeg;base64,undefined"){

        console.log(eventInfo.event._def.extendedProps.name.substring(eventInfo.event._def.extendedProps.name.indexOf(' ') + 1)[0].toUpperCase())
        // Store custom html code in variable
        innerHtml = eventInfo.event._def.title + '<div style="background:red;display:inline;width: 72px;height: 57px;border-radius: 50%;opacity: 1;font-size: 13px;/* font-weight: bold; */padding: 4px;background: #d5e3ea;height: 40px;width: 40px;border-radius: 45px;text-align: center;line-height: 38px;color: #274750;margin-right:2px">' + eventInfo.event._def.extendedProps.name[0].toUpperCase()+eventInfo.event._def.extendedProps.name.substring(eventInfo.event._def.extendedProps.name.indexOf(' ') + 1)[0].toUpperCase() + '</div>'+ "<span style='color:black;color: #FFFFFF;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span>";;
        //Event with rendering html
        return createElement = {
            html: innerHtml
        }
    }

      

    //   else{
    //     innerHtml = eventInfo.event._def.title+"<span></span>";
    //     return createElement = { html: '<div style=" width: 96px;height: 20px;background: #BE5C5C 0% 0% no-repeat padding-box;border-radius: 4px;">'+innerHtml+'</div>' }
    //   }

  }

  //Event Render Function
  renderEventContentForDay(eventInfo, createElement) {
console.log(eventInfo)
      var innerHtml;
      //Check if event has image
      if (eventInfo.event._def.extendedProps.imageUrl && eventInfo.event._def.extendedProps.imageUrl!="data:image/jpeg;base64,undefined") {
        // Store custom html code in variable
        innerHtml = eventInfo.event._def.title + "<div style='margin-bottom:53% !important;margin-left: 3px;display: block;width: 278px;background: #7eb9e6 0% 0% no-repeat padding-box;border-radius: 4px;'><div style='float:left'><img style='display:inline;width:28px;height:34px;border-radius: 50%;' src='" + eventInfo.event._def.extendedProps.imageUrl + "'></div>" + "<div><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span><br/><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.project + "</span></div></div>";
        //Event with rendering html
        return createElement = {
            html: innerHtml
        }
    }
    
    if (eventInfo.event._def.extendedProps.imageUrl && eventInfo.event._def.extendedProps.imageUrl=="data:image/jpeg;base64,undefined"){

      console.log(eventInfo.event._def.extendedProps.name.substring(eventInfo.event._def.extendedProps.name.indexOf(' ') + 1)[0].toUpperCase())
      // Store custom html code in variable
      innerHtml = eventInfo.event._def.title + "<div style='margin-bottom:53% !important;margin-left: 3px;display: block;width: 278px;background: #7eb9e6 0% 0% no-repeat padding-box;border-radius: 4px;'><div style='float:left'><span style='margin-left:5px;background:red;display:inline;width: 72px;height: 57px;border-radius: 50%;opacity: 1;font-size: 11px;font-weight: bold;padding: 2px;background: #d5e3ea;height: 40px;width: 40px;border-radius: 45px;text-align: center;line-height: 38px;color: #274750;'>" + eventInfo.event._def.extendedProps.name[0].toUpperCase()+eventInfo.event._def.extendedProps.name.substring(eventInfo.event._def.extendedProps.name.indexOf(' ') + 1)[0].toUpperCase() +"</span></div>" + "<div><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span><br/><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.project + "</span></div></div>";

      // innerHtml = eventInfo.event._def.title + '<div style="background:red;display:inline;width: 72px;height: 57px;border-radius: 50%;opacity: 1;font-size: 11px;font-weight: bold;padding: 2px;background: #d5e3ea;height: 40px;width: 40px;border-radius: 45px;text-align: center;line-height: 38px;color: #274750;">' + eventInfo.event._def.extendedProps.name[0].toUpperCase()+eventInfo.event._def.extendedProps.name.substring(eventInfo.event._def.extendedProps.name.indexOf(' ') + 1)[0].toUpperCase() + '</div>';
      //Event with rendering html
      return createElement = {
          html: innerHtml
      }
  }
      // if (eventInfo.event._def.extendedProps.imageUrl) {
      //     // Store custom html code in variable
      //     innerHtml = eventInfo.event._def.title + "<div style='margin-bottom:53% !important;margin-left: 3px;display: block;width: 278px;background: #7eb9e6 0% 0% no-repeat padding-box;border-radius: 4px;'><div style='float:left'><img style='display:inline;width:28px;height:34px;border-radius: 50%;' src='" + eventInfo.event._def.extendedProps.imageUrl + "'></div>" + "<div><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span><br/><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.project + "</span></div></div>";
      //     //Event with rendering html
      //     return createElement = {
      //         html: innerHtml
      //     }
      // }

      if (eventInfo.event._def.extendedProps.holiday) {
          console.log(eventInfo.event._def.extendedProps);

          innerHtml = eventInfo.event._def.title + "<span></span>";
          return createElement = {
              html: '<div style="margin-top: 29%;text-align: center;font-weight: bold;">' + eventInfo.event._def.extendedProps.description + '</div>'
          }
      }

      else{
        // innerHtml = eventInfo.event._def.title+"<span>"+eventInfo.event._def.extendedProps.name+"</span>";
        return createElement = { html: '<div style="color: white;font-weight: 500;text-align: center;">'+eventInfo.event._def.extendedProps.name+'</div>' }
      }
  }

  

  // isHovered(date: NgbDate) {
  //     return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  // }

  // isInside(date: NgbDate) {
  //     return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  // }
  // isRange(date: NgbDate) {
  //     return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  // }

  
  //date range selection
  // onDateSelection(date: NgbDate) {
  //   if (!this.fromDate && !this.toDate) {
  //     this.fromDate = date;
  //     this.fromDateFormatted = this.fromDate.year + '-' + ('0' + (this.fromDate.month)).slice(-2) + '-' + ('0' + this.fromDate.day).slice(-2);
  //     this.toDateFormatted = this.toDate.year + '-' + ('0' + (this.toDate.month)).slice(-2) + '-' + ('0' + this.toDate.day).slice(-2);
  //   } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
  //     this.toDate = date;
  //     this.fromDateFormatted = this.fromDate.year + '-' + ('0' + (this.fromDate.month)).slice(-2) + '-' + ('0' + this.fromDate.day).slice(-2);
  //     this.toDateFormatted = this.toDate.year + '-' + ('0' + (this.toDate.month)).slice(-2) + '-' + ('0' + this.toDate.day).slice(-2);

  //   } else {
  //     this.toDate = null;
  //     this.fromDate = date;
  //     this.fromDateFormatted = this.fromDate.year + '-' + ('0' + (this.fromDate.month)).slice(-2) + '-' + ('0' + this.fromDate.day).slice(-2);
  //     this.toDateFormatted = null

  //   }

  // }


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
 
  updateLeaves(){

      this.updatedLeaves = [];
      this.formatedarray = [];
      this.index=0;
      console.log(this.daysSelected)

      this.daysSelectedset = new Set(this.daysSelected)
       this.daysSelected = Array.from(this.daysSelectedset)
      //  this.daysSelectedLidset= new Set(this.daysSelectedLid)
      //  this.daysSelectedLid = Array.from(this.daysSelectedLidset)
      this.sorteddaysSelected = this.daysSelected.sort((a, b) => b < a ? 1: -1);
      var j,i
      console.log(this.sorteddaysSelected)
      for(i=this.index;i<this.sorteddaysSelected.length;i++){
          console.log(this.index)
          i=this.index;
        this.from = this.sorteddaysSelected[i]
        var count=0;
        var first_iteration = true;
          for( j=this.index;j<this.sorteddaysSelected.length;j++){
            count++
            console.log(new Date(this.sorteddaysSelected[j+1]).getDate())
            console.log(new Date(this.sorteddaysSelected[i]).getDate()+count);
            if(new Date(this.sorteddaysSelected[j+1]).getDate()== new Date(this.sorteddaysSelected[i]).getDate()+count){
                this.to = this.sorteddaysSelected[j+1]
                first_iteration = false;
            }
           
         else if(first_iteration ==true && new Date(this.sorteddaysSelected[j+1]).getDate()!= new Date(this.sorteddaysSelected[i]).getDate()+count){
            this.to=this.from;
            this.formatedarray.push({"fromDate":this.from,"toDate":this.to})
            break;
         }           
         else{
            this.formatedarray.push({"fromDate":this.from,"toDate":this.to})
            break;
        }
         

          }

          this.index =this.sorteddaysSelected.indexOf(this.to)+1

          console.log(this.index)

          
      }
       this.formatedarraySet = new Set(this.formatedarray)
       this.formatedarray = Array.from(this.formatedarraySet)
      
    console.log(this.formatedarray)
    console.log(this.daysSelectedLid)
    for(var k=0;k<this.formatedarray.length;k++){
        this.inBtwnDates = this.getDates(new Date(this.formatedarray[k].fromDate),new Date(this.formatedarray[k].toDate))
        this.inBtwnDatesFormatted = [];
        for(var l=0;l<this.inBtwnDates.length;l++){
            this.inBtwnDatesFormatted.push(this.inBtwnDates[l].toISOString().slice(0, 10))
        }

        // console.log(this.inBtwnDatesFormatted)
        // this.daysSelectedLid.filter(function(item) {
        //     return item.indexOf(this.inBtwnDatesFormatted) === -1;
        // });
            for(var w=0;w<this.daysSelectedLid.length;w++){
                this.found =0;
                this.notFound =0;
                console.log(this.daysSelectedLid[w].lid)
                for(var f=0;f<this.inBtwnDatesFormatted.length;f++){
                    if(this.inBtwnDatesFormatted[f].indexOf(this.daysSelectedLid[w].date) > -1){
                        this.found++;
                        this.formatedarray[k]['lid'] = this.daysSelectedLid[w].lid
                        break;
                       }
                       else{
                         this.notFound++
                       }
                       if(this.notFound+1==this.daysSelectedLid.length){
                           this.formatedarray[k]['lid'] = null
                       }
                       
                }
            }
            
           
        
    }
    console.log(this.formatedarray)
    // var day = new Date(key);
    // console.log(day)
    // var date = day.getDate() + ' ' + this.month[day.getMonth()] + ' ' + day.getFullYear();

  }

  weekendsDatesFilter = (d: Date): boolean => {
    const day = d.getDay();

    /* Prevent Saturday and Sunday for select. */
    return day !== 0 && day !== 6 ;
}
}