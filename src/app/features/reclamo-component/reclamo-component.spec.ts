import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamoComponent } from './reclamo-component';

describe('ReclamoComponent', () => {
  let component: ReclamoComponent;
  let fixture: ComponentFixture<ReclamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReclamoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReclamoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
