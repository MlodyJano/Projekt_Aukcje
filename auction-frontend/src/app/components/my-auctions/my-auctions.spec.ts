import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAuctions } from './my-auctions';

describe('MyAuctions', () => {
  let component: MyAuctions;
  let fixture: ComponentFixture<MyAuctions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAuctions],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAuctions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
