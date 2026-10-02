import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotResponsesPageComponent } from './bot-responses-page.component';

describe('BotResponsesPage', () => {
  let component: BotResponsesPageComponent;
  let fixture: ComponentFixture<BotResponsesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotResponsesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BotResponsesPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
