import { Usuario } from './../../../model/usuario';
import { Observable, forkJoin} from 'rxjs';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder} from '@angular/forms'; 
import { Component, OnInit } from '@angular/core';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { UsuariosWS } from './../../../providers/ws/usuario.ws';
import {Recursos} from './../../../model/recursos'
import { RecursosWS } from '../../../providers/ws/recursos.ws';
import {map, startWith} from 'rxjs/operators';
import {FormGroupPage} from '../../../providers/utils/form-group-page';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Inject } from '@angular/core';
import * as _ from 'lodash';
import {CustomValidators} from '../../../providers/utils/custom-validators';
import {PaginatorPage} from '../../../providers/utils/paginator-page';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent extends PaginatorPage implements OnInit {
  formGroup: FormGroup;
  usuario: Usuario;
  dsloginAtual : string;
  listarusuario : Usuario[] = [];
   editar: boolean;
   listaRecursos: Recursos[];
  constructor(private  usuariows: UsuariosWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private recursosws : RecursosWS,
              private formBuilder: FormBuilder, 
              public dialogRef: MatDialogRef<UsuarioComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any){
  super();
 this.usuario = _.cloneDeep(data['usuario']);
 }

 /*detectChanges(newVal, model, validation): void {
  if (validation.valid) model._valid = true;
  else model._valid = false;
}*/

private inicializarObjeto() {
  this.usuario = <Usuario>{};
}
  ngOnInit() {
    this.usuario = <Usuario>{};

    this.activatedRoute.queryParams.subscribe(routeParams => {
      if (routeParams.id == null) {
        this.usuario = <Usuario>{};
        this.editar = false;
      } else {
        this.editar = true;
        this.dsloginAtual = this.usuario.dsLogin;
        this.usuariows.findById(routeParams.id).subscribe(result => {
          this.usuario = result;
          console.log(result);
        });
      }
    });

  this.inicializarFormGroup();
  const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    forkJoin(
      this.recursosws.findAll(this.page, this.linesPerPage, 'nmrecursos', 'ASC', this.searchField, usuarioLogado.login), 
    ).subscribe(data => {
      this.listaRecursos = data[0]['content'];

    });
    
  }

  private inicializarFormGroup() {
    this.formGroup = this.formBuilder.group({
      nmusuario: new FormControl(this.usuario.nmusuario, [Validators.required]),
      dssenha: [this.usuario.dssenha, [Validators.required]],
      nrcpf: [this.usuario.nrcpf, [Validators.required]],
      dsLogin: [this.usuario.dsLogin, [Validators.required, CustomValidators.validalogin], this.dsloginValidator.bind(this) ],
      nmRecursos: [this.usuario.nmRecursos, [Validators.required]]
    });

    /*if (this.editar) {
      this.validateAllFormFields();
    }*/
  }

 onSubmit() {
   if (this.formGroup.invalid) {
      return;
    }
    
    this.spinner.show();
    console.log(this.usuario);
    this.usuariows.save(this.usuario).subscribe(result => {
      if (!this.editar) {
        this.formGroup.reset();
      }
      this.spinner.hide();
      this.snotifyService.success('Cadastro realizado com sucesso!');
      //this.load();
    }, error => {
      this.spinner.hide();
      this.snotifyService.error(error);
    });
  }
  /*load() {
    setTimeout(function () {
      location.reload()
  }, 100);
  }*/
  private dsloginValidator(control: AbstractControl) {
    return this.usuariows.findByDslogin(control.value).pipe(
      map(result => {
          if (result != null && result.length > 0) {
            if (this.dsloginAtual != null && this.dsloginAtual === this.usuario.dsLogin) {
              return true;
            }
            return {'dsloginExists': true};
          }
          return true;
        }
      )
    );
  }

}
