import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionCreate } from './auction-create';

describe('AuctionCreate', () => {
  let component: AuctionCreate;
  let fixture: ComponentFixture<AuctionCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(AuctionCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
