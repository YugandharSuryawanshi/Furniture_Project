import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyChooseUsPointsComponent } from './why-choose-us-points.component';

describe('WhyChooseUsPointsComponent', () => {
  let component: WhyChooseUsPointsComponent;
  let fixture: ComponentFixture<WhyChooseUsPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyChooseUsPointsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyChooseUsPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
