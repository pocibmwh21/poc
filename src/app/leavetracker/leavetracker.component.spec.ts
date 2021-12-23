import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavetrackerComponent } from './leavetracker.component';

describe('LeavetrackerComponent', () => {
  let component: LeavetrackerComponent;
  let fixture: ComponentFixture<LeavetrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavetrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavetrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
