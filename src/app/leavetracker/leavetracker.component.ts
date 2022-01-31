import {
  Component,
  OnInit,
  ViewChild,
  Renderer2
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
  NgbCalendar
} from '@ng-bootstrap/ng-bootstrap';
import {
  Container
} from '@angular/compiler/src/i18n/i18n_ast';
import {
  from
} from 'rxjs';
import {
  AccountService
} from '@app/_services';
import { HttpClient } from '@angular/common/http';

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
  daysSelectedLidset:any;
  todayDate;
  inBtwnDates = [];
  inBtwnDatesFormatted = [];
  found;
  notFound;
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

  backEnddata = {
      "2022": [{
          "January": [{
                  "1": {
                      "userName": "Neethu",
                      "projectName": "FHIR",
                      "photo": "fasfasdfa",
                      "leaves": [{
                              "lid": 5,
                              "fromDate": "2022-01-20",
                              "toDate": "2022-01-20"
                          },
                          {
                              "lid": 8,
                              "fromDate": "2022-01-23",
                              "toDate": "2022-01-25"
                          }
                      ]
                  }
              },
              {
                  "16": {
                      "userName": "Jonah",
                      "projectName": "FHIR",
                      "photo": "fasfasdfa",
                      "leaves": [{
                              "lid": 5,
                              "fromDate": "2022-01-20",
                              "toDate": "2022-01-20"
                          },
                          {
                              "lid": 8,
                              "fromDate": "2022-01-23",
                              "toDate": "2022-01-25"
                          }
                      ]
                  }
              },
              {
                  "17": {
                      "userName": "Test",
                      "projectName": "IBMW",
                      "photo": "fasfasdfa",
                      "leaves": [{
                              "lid": 5,
                              "fromDate": "2022-01-27",
                              "toDate": "2022-01-27"
                          },
                          {
                              "lid": 8,
                              "fromDate": "2022-02-01",
                              "toDate": "2022-02-05"
                          },
                          {
                            "lid": 4,
                            "fromDate": "2022-03-01",
                            "toDate": "2022-03-05"
                        },
                        {
                            "lid": 4,
                            "fromDate": "2022-03-01",
                            "toDate": "2022-03-05"
                        }
                      ]
                  }
              }
          ]
      }]

  }

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

  constructor(private calendar: NgbCalendar,
      private accountService: AccountService,
      private http: HttpClient,
      private renderer:Renderer2
      ) {
      this.user = this.accountService.userValue;
      this.todayDate = new Date();

      this.fromDate = calendar.getToday();
      this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
      
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
      // console.log(this.data)
  }


  ngOnInit(): void {
    let currentDate = new Date();
    let cDay = currentDate.getDate()
    let cMonth = this.month[currentDate.getMonth()]
    let cYear = currentDate.getFullYear()
     this.convertJsonData(cMonth,cYear);
     this.http.get(`/home/user/getAllLeaves`).subscribe(response=>{
       
    });
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
 
  convertJsonData(cMonth,cYear){
     //conerting data from back end to data for full calender
     for (let obj of this.backEnddata[cYear][0][cMonth]) {
         console.log(obj)
         for (let key in obj) {
             for (let leaves of obj[key]['leaves']) {
                 if (leaves.fromDate == leaves.toDate) {
                     if (key == this.user.id) {
                         this.daysSelectedLid.push({"date":leaves.fromDate,"lid":leaves.lid})
                         this.daysSelected.push(leaves.fromDate)
                         this.data.push({
                             name: obj[key]['userName'],
                             project: obj[key]['projectName'],
                             date: leaves.fromDate,
                             title: '',
                             display: 'background',
                             color: '#f27878'
                         })
                     } else {
                         this.data.push({
                             name: obj[key]['userName'],
                             project: obj[key]['projectName'],
                             date: leaves.fromDate,
                             imageUrl: '../assets/img/person.jpg'
                         })
                     }

                 } else {
                     this.listDates = this.getDates(new Date(leaves.fromDate), new Date(leaves.toDate))
                     for (var j = 0; j < this.listDates.length; j++) {
                         if (key == this.user.id) {
                            this.daysSelectedLid.push({"date":this.listDates[j].toISOString().slice(0, 10),"lid":leaves.lid})
                           this.daysSelected.push(this.listDates[j].toISOString().slice(0, 10))
                             this.data.push({
                                 name: obj[key]['userName'],
                                 project: obj[key]['projectName'],
                                 date: this.listDates[j].toISOString().slice(0, 10),
                                 title: '',
                                 display: 'background',
                                 color: '#f27878'
                             })
                         } else {
                             this.data.push({
                                 name: obj[key]['userName'],
                                 project: obj[key]['projectName'],
                                 date: this.listDates[j].toISOString().slice(0, 10),
                                 imageUrl: '../assets/img/person.jpg'
                             })

                         }

                     }
                 }

             }

         }
     }
     console.log(this.data)
  }
  calendarOptions: CalendarOptions = {
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

  //on click of next month
  nextMonth(): void {
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
      this. convertJsonData(this.currentMonth,this.currentYear)
      
  }
  calendarOptionstest: CalendarOptions = {
      initialView: 'dayGridDay',
      eventContent: this.renderEventContentForDay, // This will render the event with image
      headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridDay'
      },
      events: this.data
  };

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
  getClickedSpecificDate(arg) {
      console.log(arg.date)
      this.calendarApi.gotoDate(arg.date)

  }


  //Event Render Function
  renderEventContent(eventInfo, createElement) {
      var innerHtml;
      //Check if event has image
      if (eventInfo.event._def.extendedProps.imageUrl) {
          // Store custom html code in variable
          innerHtml = eventInfo.event._def.title + "<img style='display:inline;width:20px;height:20px;border-radius: 50%;opacity: 1;/* opacity: 8; */' src='" + eventInfo.event._def.extendedProps.imageUrl + "'>" + "<span style='color:black;color: #FFFFFF;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span>";
          //Event with rendering html
          return createElement = {
              html: innerHtml
          }
      }

      if (eventInfo.event._def.extendedProps.holiday) {
          console.log(eventInfo.event._def.extendedProps);

          innerHtml = eventInfo.event._def.title + "<span></span>";
          return createElement = {
              html: '<div style="margin-top: 29%;text-align: center;font-weight: bold;">' + eventInfo.event._def.extendedProps.description + '</div>'
          }
      }
      // else{
      //   innerHtml = eventInfo.event._def.title+"<span></span>";
      //   return createElement = { html: '<div style=" width: 96px;height: 20px;background: #BE5C5C 0% 0% no-repeat padding-box;border-radius: 4px;">'+innerHtml+'</div>' }
      // }

  }

  //Event Render Function
  renderEventContentForDay(eventInfo, createElement) {

      var innerHtml;
      //Check if event has image
      if (eventInfo.event._def.extendedProps.imageUrl) {
          // Store custom html code in variable
          innerHtml = eventInfo.event._def.title + "<div style='margin-bottom:53% !important;margin-left: 3px;display: block;width: 278px;background: #7eb9e6 0% 0% no-repeat padding-box;border-radius: 4px;'><div style='float:left'><img style='display:inline;width:28px;height:34px;border-radius: 50%;' src='" + eventInfo.event._def.extendedProps.imageUrl + "'></div>" + "<div><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span><br/><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.project + "</span></div></div>";
          //Event with rendering html
          return createElement = {
              html: innerHtml
          }
      }

      if (eventInfo.event._def.extendedProps.holiday) {
          console.log(eventInfo.event._def.extendedProps);

          innerHtml = eventInfo.event._def.title + "<span></span>";
          return createElement = {
              html: '<div style="margin-top: 29%;text-align: center;font-weight: bold;">' + eventInfo.event._def.extendedProps.description + '</div>'
          }
      }

      // else{
      //   innerHtml = eventInfo.event._def.title+"<span></span>";
      //   return createElement = { html: '<div style="width: 110px;height: 20px;background: #BE5C5C 0% 0% no-repeat padding-box;border-radius: 4px;">'+innerHtml+'</div>' }
      // }
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

  onDateSelection(date: NgbDate) {
      if (!this.fromDate && !this.toDate) {
          this.fromDate = date;
      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
          this.toDate = date;
      } else {
          this.toDate = null;
          this.fromDate = date;
      }
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
 
  updateLeaves(){

      this.updatedLeaves = [];
      this.formatedarray = [];
      this.index=0;
      console.log(this.daysSelected)

      this.daysSelectedset = new Set(this.daysSelected)
       this.daysSelected = Array.from(this.daysSelectedset)
       this.daysSelectedLidset= new Set(this.daysSelectedLid)
       this.daysSelectedLid = Array.from(this.daysSelectedLidset)
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