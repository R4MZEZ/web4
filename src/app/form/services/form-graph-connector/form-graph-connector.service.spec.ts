import { TestBed } from '@angular/core/testing';

import { FormGraphConnectorService } from './form-graph-connector.service';

describe('FormGraphConnectorService', () => {
  let service: FormGraphConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormGraphConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
