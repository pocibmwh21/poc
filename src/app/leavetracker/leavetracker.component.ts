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
  formatedarraySet: any;
  daysSelectedset: any;
  dataSet: any;
  todayDate;
  inBtwnDates = [];
  inBtwnDatesFormatted = [];
  found;
  notFound;
  userid;
  dataFromBackend = {};
  allLeaves = {};
  calendarOptions: CalendarOptions
  calendarOptionstest: CalendarOptions = {
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
  leaveData;
  insideData = false;
  listDatesUser = [];
  allUserLeaves = [];
  isDisabled;
  dayData = [];
  today: NgbDate;
  holidays: { month: number, day: number, text: string }[] = [
    { month: 1, day: 26, text: 'New Years Day' },
    { month: 4, day: 15, text: 'Good Friday (hi, Alsace!)' },
    { month: 5, day: 1, text: 'Labour Day' },
    { month: 5, day: 3, text: 'V-E Day' },
    { month: 8, day: 31, text: 'Bastille Day' },
    { month: 10, day: 2, text: 'Assumption Day' },
    { month: 10, day: 5, text: 'All Saints Day' },
    { month: 10, day: 26, text: 'Armistice Day' },
    { month: 11, day: 1, text: 'Christmas Day' }
  ];
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

  date: { year: number, month: number };

  disabledDates: NgbDateStruct[] = [
    { year: 2050, month: 4, day: 10 },

  ]
  @ViewChildren('deleteItem') item;
  selectedIds = [];

  //constructor
  constructor(private calendar: NgbCalendar,
    private accountService: AccountService,
    private http: HttpClient,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private alertService: AlertService,
    private config: NgbDatepickerConfig,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.user = this.accountService.userValue;
    this.markDisabled = this.markDisabled.bind(this);
    const current = new Date();
    config.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    config.outsideDays = 'hidden';
    this.today = calendar.getToday();

    this.fromDate = this.getFirstAvailableDate(this.today);
    this.toDate = this.getFirstAvailableDate(this.today);
    this.fromDateFormatted = this.fromDate.year + '-' + ('0' + (this.fromDate.month)).slice(-2) + '-' + ('0' + this.fromDate.day).slice(-2);
    this.toDateFormatted = this.toDate.year + '-' + ('0' + (this.toDate.month)).slice(-2) + '-' + ('0' + this.toDate.day).slice(-2);

  }
  //constructor ends

  ngOnInit(): void {
    let currentDate = new Date();
    let cDay = currentDate.getDate()
    let cMonthName = this.month[currentDate.getMonth()].toUpperCase();
    let cMonth = currentDate.getMonth() + 1
    let cYear = currentDate.getFullYear();
    this.getAllLeaves();
    this.getLeaveData(cMonth, cYear, cMonthName)
  }
  ngAfterViewChecked() {
    this.calendarApi = this.calendarComponent.getApi();
    this.monthcalenderApi = this.monthcalendarComponent.getApi();
    // this.calendarApi.next();
  }

  //get leave data from api
  getLeaveData(cMonth, cYear, cMonthName) {
    this.insideData = false;

    this.accountService.getAllLeavesByMonthYear(cMonth, cYear).subscribe(
      (data) => {
        this.dataFromBackend = { ...data };
        this.insideData = true;
        this.convertJsonData(cMonthName, cYear);


      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }
  getAllLeaves() {
    this.accountService.getAllLeaves().subscribe(
      (data) => {
        this.allLeaves = { ...data };
        this.processAllLeaves()
        console.log(this.allLeaves)

      },
      (error) => {
        // this.alertService.error(error);
      }
    );
  }

  //get all leaves of loggedin user in an array
  processAllLeaves() {
    for (let yearkey in this.allLeaves) {

      for (let monthkey in this.allLeaves[yearkey]) {
        for (let idkey in this.allLeaves[yearkey][monthkey]) {
          if (idkey == this.user.id) {
            console.log(this.allLeaves[yearkey][monthkey][idkey]['leaves'])
            for (let item of this.allLeaves[yearkey][monthkey][idkey]['leaves']) {

              this.allUserLeaves.push(item)
            }

          }
        }
      }
    }
    this.convertUserLeaveNgbDateArray();
  }


  //convert all leaves of logginuser array to NGBDate array format
  convertUserLeaveNgbDateArray() {
    for (var leaves of this.allUserLeaves) {
      if (!(leaves.hasOwnProperty('toDate'))) {
        this.disabledDates.push({ year: new Date(leaves.fromDate).getFullYear(), month: new Date(leaves.fromDate).getMonth() + 1, day: new Date(leaves.fromDate).getDate() })
      }
      else {
        this.listDatesUser = this.getDates(new Date(leaves.fromDate), new Date(leaves.toDate))
        for (var list = 0; list < this.listDatesUser.length; list++) {
          if (this.listDatesUser[list].getDay() != 6 && this.listDatesUser[list].getDay() != 0)
            this.disabledDates.push({ year: new Date(this.listDatesUser[list]).getFullYear(), month: new Date(this.listDatesUser[list]).getMonth() + 1, day: new Date(this.listDatesUser[list]).getDate() })
        }

      }
    }
  }


  //convert response from backend to executable in full calender
  convertJsonData(cMonth, cYear) {
    this.data = [];
    this.publicHolidayData = [];
    this.deleteLeavesData = [];
    this.publicHolidayDisplay = [];
    this.dayData = [];
    console.log(cMonth)
    //push public holiday data to main data of full calender and convert date to display
    for (let obj of this.public_holiday) {
      console.log("object:", obj);
      for (let key in obj) {
        var day = new Date(key);
        console.log(day)
        console.log(this.month[day.getMonth()].toUpperCase())
        var date = day.getDate() + ' ' + this.month[day.getMonth()] + ' ' + day.getFullYear();
        if (cMonth == this.month[day.getMonth()].toUpperCase()) {
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
    }
    this.data.push(...this.publicHolidayData)


    //conerting data from back end to data for full calender
    for (let key in this.dataFromBackend[cMonth]) {
      console.log(this.dataFromBackend[cMonth][key]['leaves'])
      for (let leaves of this.dataFromBackend[cMonth][key]['leaves']) {
        console.log(leaves)
        if (key == this.user.id) {
          if (!(leaves.hasOwnProperty('toDate'))) {
            leaves['toDate'] = leaves.fromDate
          }

          this.deleteLeavesData.push(leaves)

        }

        if (leaves.fromDate == leaves.toDate || !(leaves.hasOwnProperty('toDate'))) {
          this.base64Data = this.dataFromBackend[cMonth][key]['photo'];
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
          this.dayData.push({
            name: this.dataFromBackend[cMonth][key]['userName'],
            project: this.dataFromBackend[cMonth][key]['projectName'],
            date: leaves.fromDate,
            imageUrl: this.retrievedImage
          })
          if (key == this.user.id) {
            this.daysSelectedLid.push({ "date": leaves.fromDate, "lid": leaves.lid })
            this.daysSelected.push(leaves.fromDate)
            this.data.push({
              name: this.dataFromBackend[cMonth][key]['userName'],
              project: this.dataFromBackend[cMonth][key]['projectName'],
              date: leaves.fromDate,
              title: '',
              display: 'background',
              color: 'rgb(187 231 242)'
            })

          } else {

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
            this.base64Data = this.dataFromBackend[cMonth][key]['photo'];
            this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;

            if (new Date(this.listDates[j]).getDay() != 6 && new Date(this.listDates[j]).getDay() != 0) {

              this.dayData.push({
                name: this.dataFromBackend[cMonth][key]['userName'],
                project: this.dataFromBackend[cMonth][key]['projectName'],
                date: this.listDates[j].toISOString().slice(0, 10),
                imageUrl: this.retrievedImage
              })
            }
            if (key == this.user.id) {
              this.daysSelectedLid.push({ "date": this.listDates[j].toISOString().slice(0, 10), "lid": leaves.lid })
              this.daysSelected.push(this.listDates[j].toISOString().slice(0, 10))
              if (new Date(this.listDates[j]).getDay() != 6 && new Date(this.listDates[j]).getDay() != 0) {
                this.data.push({
                  name: this.dataFromBackend[cMonth][key]['userName'],
                  project: this.dataFromBackend[cMonth][key]['projectName'],
                  date: this.listDates[j].toISOString().slice(0, 10),
                  title: '',
                  display: 'background',
                  color: 'rgb(187 231 242)'
                })
              }
            } else {
              this.base64Data = this.dataFromBackend[cMonth][key]['photo'];
              this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;

              if (new Date(this.listDates[j]).getDay() != 6 && new Date(this.listDates[j]).getDay() != 0) {

                this.data.push({
                  name: this.dataFromBackend[cMonth][key]['userName'],
                  project: this.dataFromBackend[cMonth][key]['projectName'],
                  date: this.listDates[j].toISOString().slice(0, 10),
                  imageUrl: this.retrievedImage
                })
              }

            }

          }
        }

      }

      //unique elements in data

      this.data = this.data.reduce((filter, current) => {
        var dk = filter.find(item => item.name === current.name && item.date === current.date);
        if (!dk) {
          return filter.concat([current]);
        } else {
          return filter;
        }
      }, []);

    }

    this.deleteLeavesData.sort((a, b) => {
      return new Date(a.fromDate).valueOf() - new Date(b.fromDate).valueOf()
    })
    this.deleteLeavesData.sort((a, b) => {
      return new Date(a.toDate).valueOf() - new Date(b.toDate).valueOf()
    })

    this.deleteLeavesData.map((deleteLeaveData) => {
      var toData = new Date(deleteLeaveData.toDate);
      var fromData = new Date(deleteLeaveData.fromDate);

      deleteLeaveData.fromDate = fromData.toLocaleDateString("en-US", { day: 'numeric' }) + "-" + fromData.toLocaleDateString("en-US", { month: 'short' }) + "-" + fromData.toLocaleDateString("en-US", { year: 'numeric' })
      deleteLeaveData.toDate = toData.toLocaleDateString("en-US", { day: 'numeric' }) + "-" + toData.toLocaleDateString("en-US", { month: 'short' }) + "-" + toData.toLocaleDateString("en-US", { year: 'numeric' })
      return deleteLeaveData;

    })
    console.log(this.deleteLeavesData);

    // update calender
    this.calendarOptions = {
      // selectable: true,

      initialView: 'dayGridMonth',
      dayMaxEventRows: 5, // allow "more" link when too many events
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
      events: this.dayData
    };


  }


  //change the day calender on click of date in main calender
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

  getCurrentMonthYear(arrayMonthYear) {
    for (var i = 0; i < arrayMonthYear.length; i++) {
      this.currentMonth = arrayMonthYear[0]
      this.currentYear = arrayMonthYear[1]

    }
  }


  //update the data from backend
  updateData() {
    let cMonthName = this.currentMonth.toUpperCase();
    let curentMonthIndex = (element) => element == this.currentMonth;
    let cMonth = this.month.findIndex(curentMonthIndex) + 1
    let cYear = this.currentYear
    this.getLeaveData(cMonth, cYear, cMonthName)


  }

  //on delete leaves 
  deleteLeaves() {
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



  //delete leaves check box cheked
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
    const addDays = function (days) {
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




  //Event Render Function for full calnder
  renderEventContent(eventInfo, createElement) {
    console.log($('.leave-calender .fc-daygrid-more-link'))
    var innerHtml;
    //Check if event has image
    if (eventInfo.event._def.extendedProps.holiday) {
      console.log(eventInfo.event._def.extendedProps);

      innerHtml = eventInfo.event._def.title + "<span></span>";
      return createElement = {
        html: '<div style="margin-top: 29%;text-align: center;font-weight: bold;">' + eventInfo.event._def.extendedProps.description + '</div>'
      }
    }
    if (eventInfo.event._def.extendedProps.imageUrl && eventInfo.event._def.extendedProps.imageUrl != "data:image/jpeg;base64,undefined") {
      // Store custom html code in variable
      innerHtml = eventInfo.event._def.title + "<img title='" + eventInfo.event._def.extendedProps.name + "' style='display:inline;width:19px;height:19px;border-radius: 50%;opacity: 1;/* opacity: 8; */' src='" + eventInfo.event._def.extendedProps.imageUrl + "'>" + "<span style='color:black;color: #FFFFFF;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span>";
      //Event with rendering html
      return createElement = {
        html: innerHtml
      }
    }

    if (eventInfo.event._def.extendedProps.imageUrl && eventInfo.event._def.extendedProps.imageUrl == "data:image/jpeg;base64,undefined") {

      console.log(eventInfo.event._def.extendedProps.name.substring(eventInfo.event._def.extendedProps.name.indexOf(' ') + 1)[0].toUpperCase())
      // Store custom html code in variable
      innerHtml = eventInfo.event._def.title + '<div title="' + eventInfo.event._def.extendedProps.name + '" style="background:red;display:inline;width: 72px;height: 57px;border-radius: 50%;opacity: 1;font-size: 11px;/* font-weight: bold; */padding: 4px;background: #d5e3ea;height: 40px;width: 40px;border-radius: 45px;text-align: center;line-height: 38px;color: #274750;margin-right:2px">' + eventInfo.event._def.extendedProps.name[0].toUpperCase() + eventInfo.event._def.extendedProps.name.substring(eventInfo.event._def.extendedProps.name.indexOf(' ') + 1)[0].toUpperCase() + '</div>' + "<span style='color:black;color: #FFFFFF;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span>";;
      //Event with rendering html
      return createElement = {
        html: innerHtml
      }
    }


  }

  //Event Render Function for day full calender
  renderEventContentForDay(eventInfo, createElement) {
    console.log(eventInfo)
    var innerHtml;
    //Check if event has image
    if (eventInfo.event._def.extendedProps.imageUrl && eventInfo.event._def.extendedProps.imageUrl != "data:image/jpeg;base64,undefined") {
      // Store custom html code in variable
      innerHtml = eventInfo.event._def.title + "<div style='margin-bottom:53% !important;margin-left: 3px;display: block;width: 278px;background: #7eb9e6 0% 0% no-repeat padding-box;border-radius: 4px;'><div style='float:left'><img style='display:inline;width:28px;height:34px;border-radius: 50%;' src='" + eventInfo.event._def.extendedProps.imageUrl + "'></div>" + "<div><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span><br/><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.project + "</span></div></div>";
      //Event with rendering html
      return createElement = {
        html: innerHtml
      }
    }

    if (eventInfo.event._def.extendedProps.imageUrl && eventInfo.event._def.extendedProps.imageUrl == "data:image/jpeg;base64,undefined") {

      console.log(eventInfo.event._def.extendedProps.name.substring(eventInfo.event._def.extendedProps.name.indexOf(' ') + 1)[0].toUpperCase())
      // Store custom html code in variable
      innerHtml = eventInfo.event._def.title + "<div style='margin-bottom:53% !important;margin-left: 3px;display: block;width: 278px;background: #7eb9e6 0% 0% no-repeat padding-box;border-radius: 4px;'><div style='float:left'><span style='margin-left:5px;background:red;display:inline;width: 72px;height: 57px;border-radius: 50%;opacity: 1;font-size: 11px;font-weight: bold;padding: 2px;background: #d5e3ea;height: 40px;width: 40px;border-radius: 45px;text-align: center;line-height: 38px;color: #274750;'>" + eventInfo.event._def.extendedProps.name[0].toUpperCase() + eventInfo.event._def.extendedProps.name.substring(eventInfo.event._def.extendedProps.name.indexOf(' ') + 1)[0].toUpperCase() + "</span></div>" + "<div><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.name + "</span><br/><span style='color:white;padding-left: 10px;'>" + eventInfo.event._def.extendedProps.project + "</span></div></div>";

      // innerHtml = eventInfo.event._def.title + '<div style="background:red;display:inline;width: 72px;height: 57px;border-radius: 50%;opacity: 1;font-size: 11px;font-weight: bold;padding: 2px;background: #d5e3ea;height: 40px;width: 40px;border-radius: 45px;text-align: center;line-height: 38px;color: #274750;">' + eventInfo.event._def.extendedProps.name[0].toUpperCase()+eventInfo.event._def.extendedProps.name.substring(eventInfo.event._def.extendedProps.name.indexOf(' ') + 1)[0].toUpperCase() + '</div>';
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

    else {
      // innerHtml = eventInfo.event._def.title+"<span>"+eventInfo.event._def.extendedProps.name+"</span>";
      return createElement = { html: '<div style="color: white;font-weight: 500;text-align: center;">' + eventInfo.event._def.extendedProps.name + '</div>' }
    }
  }


  //calender popup settings

  isWeekend(date: NgbDate) {
    return this.calendar.getWeekday(date) >= 6;
  }

  isHoliday(date: NgbDate): string {
    const holiday = this.holidays.find(h => h.day === date.day && h.month === date.month);
    return holiday ? holiday.text : '';
  }
  onLeave(date: NgbDate) {
    const leave = this.disabledDates.find(h => h.day === date.day && h.month === date.month)
    return leave ? leave.day : '';
  }
  markDisabled(date: NgbDate, current: { year: number, month: number }): boolean {
    return this.isHoliday(date) !== '' || (this.isWeekend(date) && date.month === current.month) || this.onLeave(date) !== '';
  }

  getFirstAvailableDate(date: NgbDate): NgbDate {
    while (this.isWeekend(date) || this.isHoliday(date)) {
      date = this.calendar.getNext(date, 'd', 1);
    }
    return date;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.fromDateFormatted = this.fromDate.year + '-' + ('0' + (this.fromDate.month)).slice(-2) + '-' + ('0' + this.fromDate.day).slice(-2);
      this.toDateFormatted = this.toDate.year + '-' + ('0' + (this.toDate.month)).slice(-2) + '-' + ('0' + this.toDate.day).slice(-2);
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate) || date.equals(this.fromDate)) {
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

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  getTooltip(date: NgbDate): string {
    const holidayTooltip = this.isHoliday(date);

    if (holidayTooltip) {
      return holidayTooltip;
    } else if (this.isRange(date) && !this.isWeekend(date)) {
      return 'Vacations!';
    } else {
      return '';
    }
  }

}