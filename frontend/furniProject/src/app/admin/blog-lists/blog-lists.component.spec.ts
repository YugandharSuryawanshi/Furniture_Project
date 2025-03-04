import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogListsComponent } from './blog-lists.component';

describe('BlogListsComponent', () => {
  let component: BlogListsComponent;
  let fixture: ComponentFixture<BlogListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
