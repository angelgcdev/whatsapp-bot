import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotResponseTableComponent } from './bot-response-table.component';

describe('BotResponseTableComponent', () => {
  let component: BotResponseTableComponent;
  let fixture: ComponentFixture<BotResponseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotResponseTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BotResponseTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
