import { TestBed } from '@angular/core/testing';

import { BotResponses } from './bot-responses';

describe('BotResponses', () => {
  let service: BotResponses;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BotResponses);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
