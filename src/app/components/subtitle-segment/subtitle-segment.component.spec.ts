import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtitleSegmentComponent } from './subtitle-segment.component';

describe('SubtitleSegmentComponent', () => {
  let component: SubtitleSegmentComponent;
  let fixture: ComponentFixture<SubtitleSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtitleSegmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubtitleSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
