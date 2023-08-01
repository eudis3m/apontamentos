import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoAtividadesComponent } from './tipo-atividade.component';

describe('TipoAtividadesComponent', () => {
  let component: TipoAtividadesComponent;
  let fixture: ComponentFixture<TipoAtividadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoAtividadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoAtividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
