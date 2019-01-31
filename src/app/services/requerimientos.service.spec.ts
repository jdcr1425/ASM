import { TestBed } from '@angular/core/testing';

import { RequerimientosService } from './requerimientos.service';

describe('RequerimientosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequerimientosService = TestBed.get(RequerimientosService);
    expect(service).toBeTruthy();
  });
});
