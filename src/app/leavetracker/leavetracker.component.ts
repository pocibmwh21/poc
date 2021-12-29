import { Component, OnInit,ViewChild } from '@angular/core';
import {FullCalendarComponent,CalendarOptions } from '@fullcalendar/angular';
import { EventInput, Calendar } from "@fullcalendar/core";

import { NgbPopover, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-leavetracker',
  templateUrl: './leavetracker.component.html',
  styleUrls: ['./leavetracker.component.less']
})
export class LeavetrackerComponent implements OnInit {
   // references the #calendar in the template
   @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;
  
  handelDateClick: any;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  hoveredDate: NgbDate | null = null;
  calendarApi: Calendar;

  //sample data
  data= [
    { date: '2021-12-31', imageUrl:'../assets/img/person.jpg',name:'abc'},
    { date: '2021-12-31', imageUrl:'../assets/img/photo-2.jpg',name:'def'},
    { date: '2021-12-31', imageUrl:'../assets/img/logo-image.png',name:'abc'}, 
    { date: '2021-12-31', imageUrl:'../assets/img/plus-icon.png',name:'abc' },
    { date: '2021-12-31', imageUrl:'../assets/img/upload-icon.jpg',name:'abc'}, 
    { date: '2021-12-31', imageUrl:'../assets/img/ust.png',name:'abc' }, 
    { date: '2021-12-31', imageUrl:'../assets/img/person.jpg',name:'abc'},
    { date: '2021-12-31', imageUrl:'../assets/img/photo-2.jpg',name:'def'},
    { date: '2021-12-31', imageUrl:'../assets/img/logo-image.png',name:'abc'}, 
    { date: '2021-12-31', imageUrl:'../assets/img/plus-icon.png',name:'abc' },
    { date: '2021-12-20', imageUrl:'../assets/img/upload-icon.jpg',name:'abc'}, 
    { date: '2021-12-20', imageUrl:'../assets/img/ust.png',name:'abc' }, 
    { date: '2021-12-20', imageUrl:'../assets/img/person.jpg',name:'abc'},
    { date: '2021-12-20', imageUrl:'../assets/img/photo-2.jpg',name:'def'},
    { date: '2021-12-20', imageUrl:'../assets/img/logo-image.png',name:'abc'}, 
    { date: '2021-12-20', imageUrl:'../assets/img/plus-icon.png',name:'abc' },
    { date: '2021-12-20', imageUrl:'../assets/img/upload-icon.jpg',name:'abc'}, 
    { date: '2021-12-20', imageUrl:'../assets/img/ust.png',name:'abc' }, 

    { date: '2021-11-19', imageUrl:'../assets/img/edit.png',name:'abc'}, 
    { date: '2021-11-19', imageUrl:'../assets/img/person.jpg',name:'abc' },
    { date: '2021-11-19', imageUrl:'../assets/img/photo-2.jpg',name:'abc' },
    { date: '2021-11-19', imageUrl:'../assets/img/logo-image.png',name:'abc'}, 
    { date: '2021-11-19', imageUrl:'../assets/img/plus-icon.png',name:'abc'},
    { date: '2021-11-19', imageUrl:'../assets/img/upload-icon.jpg',name:'abc'}, 
    { date: '2021-11-19', imageUrl:'../assets/img/ust.png',name:'abc'}, 
    { date: '2021-11-19', imageUrl:'../assets/img/edit.png',name:'zud'}, 
    {date:'2021-12-20',title:'',name:'me'},
    {date:'2021-12-17',title:'',name:'me'}
    
  ]

  constructor(private calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
   }


  ngOnInit(): void {   
  }
  ngAfterViewChecked() {
    this.calendarApi = this.calendarComponent.getApi();
  }
 
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dayMaxEventRows: 4, // allow "more" link when too many events
    eventContent:this.renderEventContent, // This will render the event with image 
    events:this.data,
    dateClick: this.getClickedSpecificDate.bind(this)
  };
  

  calendarOptionstest: CalendarOptions = {
    initialView: 'dayGridDay',
    eventContent:this.renderEventContentForDay, // This will render the event with image
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridDay'
    },
    events:this.data
  };


  //on calender date click navigate the right calender date aswell
  getClickedSpecificDate(arg){
    console.log(arg.date)
    this.calendarApi.gotoDate(arg.date)

  }
  
  
//Event Render Function
renderEventContent(eventInfo, createElement) {

    var innerHtml;
       //Check if event has image
    if (eventInfo.event._def.extendedProps.imageUrl) {
     // Store custom html code in variable
     innerHtml = eventInfo.event._def.title+"<img style='display:inline;width:20px;height:20px;border-radius: 50%;opacity: 1;/* opacity: 8; */' src='"+eventInfo.event._def.extendedProps.imageUrl+"'>"+"<span style='color:black;color: #FFFFFF;padding-left: 10px;'>"+eventInfo.event._def.extendedProps.name+"</span>";
     //Event with rendering html
     return createElement = { html:innerHtml }
    }
    else{
      innerHtml = eventInfo.event._def.title+"<span></span>";
      return createElement = { html: '<div style=" width: 96px;height: 20px;background: #BE5C5C 0% 0% no-repeat padding-box;border-radius: 4px;">'+innerHtml+'</div>' }
    }
  }

//Event Render Function
renderEventContentForDay(eventInfo, createElement) {

  var innerHtml;
     //Check if event has image
  if (eventInfo.event._def.extendedProps.imageUrl) {
   // Store custom html code in variable
   innerHtml = eventInfo.event._def.title+"<div style='margin-bottom:53% !important;margin-left: 3px;display: block;width: 266px;background: #7eb9e6 0% 0% no-repeat padding-box;border-radius: 4px;padding: 2px;'><div style='float:left'><img style='display:inline;width:28px;height:34px;border-radius: 50%;' src='"+eventInfo.event._def.extendedProps.imageUrl+"'></div>"+"<div><span style='color:white;padding-left: 10px;'>"+eventInfo.event._def.extendedProps.name+"</span><br/><span style='color:white;padding-left: 10px;'>"+eventInfo.event._def.extendedProps.name+"</span></div></div>";
   //Event with rendering html
   return createElement = { html:innerHtml }
  }
  else{
    innerHtml = eventInfo.event._def.title+"<span></span>";
    return createElement = { html: '<div style="width: 110px;height: 20px;background: #BE5C5C 0% 0% no-repeat padding-box;border-radius: 4px;">'+innerHtml+'</div>' }
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

  
