import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
    private subjectName = new Subject<any>(); //need to create a subject
    private _projectItemSource = new BehaviorSubject(0);
   
    sendUpdate(pro: any) { //the component that wants to update something, calls this fn
        this.subjectName.next(pro); //next() will feed the value in Subject
    }

    getUpdate(): Observable<any> { //the receiver component calls this function 
        return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
    }

    projectItem$ = this._projectItemSource.asObservable();
    changeProject(project) {
      this._projectItemSource.next(project);
    }
}