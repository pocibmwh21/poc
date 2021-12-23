import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommunicationService {
    private subject = new Subject<any>();

    sendHighlightedSection(message: string) {
        this.subject.next({ text: message });
    }

    clearMessages() {
        this.subject.next();
    }

    getHighlightedSection(): Observable<any> {
        return this.subject.asObservable();
    }
}