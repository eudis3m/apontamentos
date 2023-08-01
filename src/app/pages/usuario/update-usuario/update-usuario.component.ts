import { Usuario } from '../../../model/usuario';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators , AbstractControl, FormBuilder,} from '@angular/forms';
import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { GlobalVars } from '../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { UsuariosWS} from '../../../providers/ws/usuario.ws';
import {ListarUsuarioComponent} from '../listar-usuario/listar-usuario.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormGroupPage} from '../../../providers/utils/form-group-page';
import * as _ from 'lodash';
import 'core-js/es6/weak-map';
import 'core-js/es7/reflect';
import {map, startWith} from 'rxjs/operators';
import {Recursos} from './../../../model/recursos'
import { RecursosWS } from '../../../providers/ws/recursos.ws';
import {CustomValidators} from '../../../providers/utils/custom-validators';
import {PaginatorPage} from '../../../providers/utils/paginator-page';

@Component({
  selector: 'app-update-usuario',
  templateUrl: './update-usuario.component.html',
  styleUrls: ['./update-usuario.component.css']
})

export class UpdateUsuarioComponent extends PaginatorPage implements OnInit {
  formGroup: FormGroup;
  usuario:  Usuario;
  dsloginAtual : string;
  listausuario : Usuario[];
  usuarioAutoComplete : string[] =[];
  editar: boolean;
  filteredOptions: Observable<string[]>;
  listaRecursos: Recursos[];
  pageAtividades: number;
   linesPerPageAtividades: number;
   totalRecordsAtividades: number;
   nome: string;
  constructor( private recursosws : RecursosWS,
              private usuariosws: UsuariosWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<UpdateUsuarioComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any){
                super(); 
                this.usuario= _.cloneDeep(data['usuario'])
              }

  private inicializarObjeto() {
                this.usuario = <Usuario>{};
              }
              
  ngOnInit() { 
    this.editar = false;
    if (this.usuario == null && this.usuario.oid == null) {
      this.inicializarObjeto();
    } else if (this.usuario.oid != null) {
      this.editar = true;
    }
 
    this.formGroup = this.formBuilder.group({
      //  oidusuario : [this.usuario.oid],
        nmusuario: new FormControl(this.usuario.nmusuario, [Validators.required, Validators.maxLength(100)]),
        nrcpf: new FormControl(this.usuario.nrcpf, [Validators.required, Validators.maxLength(11)]),
        dssenha: new FormControl(this.usuario.dssenha, [Validators.required,Validators.maxLength(20)]),
        dsLogin: new FormControl([this.usuario.dsLogin, [Validators.required], this.dsloginValidator.bind(this) ]),
        nmRecursos: new FormControl(this.usuario.nmRecursos, [Validators.required,Validators.maxLength(100)]),
  
      })
      this.inicializarFormGroup();
      this.page = 0;
      this.pageAtividades = 0;
      const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    forkJoin(
      this.recursosws.findAll(this.page, this.linesPerPage, 'nmrecursos', 'ASC', this.searchField, usuarioLogado.login), 
    ).subscribe(data => {
      this.listaRecursos = data[0]['content'];

    });

    this.filteredOptions = this.formGroup.get('oid').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    this.usuarioAutoComplete = [];
    for (const usuario of this.listausuario ) {
      this.usuarioAutoComplete.push(usuario.oid + ', ' + usuario.nmusuario
      + ', ' + usuario.dsLogin + ', ' + usuario.nmRecursos + ', ' + usuario.nrcpf + ', ' + usuario.dssenha );
    }

    return this.usuarioAutoComplete.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  private inicializarFormGroup() {
    this.formGroup = this.formBuilder.group({
      nmusuario: new FormControl(this.usuario.nmusuario, [Validators.required, Validators.maxLength(100)]),
      nrcpf: new FormControl(this.usuario.nrcpf, [Validators.required, Validators.maxLength(11)]),
      dssenha: new FormControl(this.usuario.dssenha, [Validators.required,Validators.maxLength(20)]),
      dsLogin: new FormControl(this.usuario.dsLogin, [Validators.required,Validators.maxLength(100)]),
      nmRecursos: new FormControl(this.usuario.nmRecursos, [Validators.required,Validators.maxLength(100)]),

    })

    /*if (this.editar) {
      this.validateAllFormFields();
    }*/
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.usuariosws.save(this.usuario).subscribe(result => {
      this.snotifyService.success('Usuario Atualizada!');
      this.onNoClick();
     // this.load();
    }, error => {
      console.log(error);
    });
  }
  /*load() {
    setTimeout(function () {
      location.reload()
  }, 100);
  }*/
  private dsloginValidator(control: AbstractControl) {
    return this.usuariosws.findByDslogin(control.value).pipe(
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

