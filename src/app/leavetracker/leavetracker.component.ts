import {
  Component,
  OnInit,
  ViewChild
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

  handelDateClick: any;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  hoveredDate: NgbDate | null = null;
  calendarApi: Calendar;
  totalRecords: string;
  page: number = 1;
  publicHolidayData = [];
  data = [];
  fullDates = [];
  listDates = [];
  user;
  publicHolidayDisplay = [];
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
                              "fromDate": "2022-01-01",
                              "toDate": "2022-01-05"
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
      private accountService: AccountService) {
      this.user = this.accountService.userValue;
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
                  color: '#649615 0% 0% no-repeat padding-box'
              })
          }
      }
      this.data.push(...this.publicHolidayData)
      // console.log(this.data)
  }


  ngOnInit(): void {
      // Usage
      let currentDate = new Date();
      let cDay = currentDate.getDate()
      let cMonth = this.month[currentDate.getMonth()]
      let cYear = currentDate.getFullYear()

      //conerting data from back end to data for full calender
      for (let obj of this.backEnddata[cYear][0][cMonth]) {
          console.log(obj)
          for (let key in obj) {
              for (let leaves of obj[key]['leaves']) {
                  if (leaves.fromDate == leaves.toDate) {
                      if (key == this.user.id) {
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
  ngAfterViewChecked() {
      this.calendarApi = this.calendarComponent.getApi();
  }


  calendarOptions: CalendarOptions = {
      initialView: 'dayGridMonth',
      dayMaxEventRows: 4, // allow "more" link when too many events
      eventContent: this.renderEventContent, // This will render the event with image 
      events: this.data,

      dateClick: this.getClickedSpecificDate.bind(this)
  };


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
          innerHtml = eventInfo.event._def.title + "<div style='margin-bottom:53% !important;margin-left: 3px;display: block;width: 278px;background: #7eb9e6 0% 0% no-repeat padding-box;border-radius: 4px;padding: 2px;'><div style='float:left'><img style='display:inline;width:28px;height:34px;border-radius: 50%;' src='" + eventInfo.event._def.extendedProps.imageUrl + "'></div>" + "<div><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span><br/><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.project + "</span></div></div>";
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
}