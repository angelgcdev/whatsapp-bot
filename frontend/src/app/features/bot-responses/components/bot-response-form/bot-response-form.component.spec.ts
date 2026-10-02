import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotResponseFormComponent } from './bot-response-form.component';

describe('BotResponseFormComponent', () => {
  let component: BotResponseFormComponent;
  let fixture: ComponentFixture<BotResponseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotResponseFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BotResponseFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
