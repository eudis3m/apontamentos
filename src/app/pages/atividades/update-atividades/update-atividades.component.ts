import { Atividades } from '../../../model/atividades';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators , AbstractControl, FormBuilder,} from '@angular/forms';
import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { GlobalVars } from '../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { AtividadesWS} from '../../../providers/ws/atividades.ws';
import {ListarAtividadesComponent} from '../listar-atividades/listar-atividades.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormGroupPage} from '../../../providers/utils/form-group-page';
import * as _ from 'lodash';
import 'core-js/es6/weak-map';
import 'core-js/es7/reflect';
import {map, startWith} from 'rxjs/operators';
import { ProjetosWS } from './../../../providers/ws/projetos.ws';
import {RecursosWS} from './../../../providers/ws/recursos.ws';
import { Recursos } from './../../../model/recursos';
import { Projetos} from './../../../model/projetos';
import {PaginatorPage} from '../../../providers/utils/paginator-page';

@Component({
  selector: 'app-update-atividades',
  templateUrl: './update-atividades.component.html',
  styleUrls: ['./update-atividades.component.css']
})

export class UpdateAtividadesComponent extends PaginatorPage implements OnInit {
  formGroup: FormGroup;
  atividades:  Atividades;
  listaatividades : Atividades[];
  atividadesAutoComplete : string[] =[];
  editar: boolean;
  filteredOptions: Observable<string[]>;
  listaRecursos: Recursos[];
  listaProjetos : Projetos[]; 
pageAtividades: number;
   linesPerPageAtividades: number;
   totalRecordsAtividades: number;
   nmusuario: string;
  constructor(private atividadesws: AtividadesWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private recusosws : RecursosWS,
              private projetosws : ProjetosWS,
              public dialogRef: MatDialogRef<UpdateAtividadesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any){
                super();
                this.atividades= _.cloneDeep(data['atividades'])
              }

  private inicializarObjeto() {
                this.atividades = <Atividades>{};
              }
              
  ngOnInit() { 
    this.editar = false;
    if (this.atividades == null && this.atividades.oid == null) {
      this.inicializarObjeto();
    } else if (this.atividades.oid != null) {
      this.editar = true;
     
    }
 
  //  this.inicializarFormGroup();
  const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
  this.formGroup = this.formBuilder.group({
    oidatividade : [this.atividades.oid],
    nmProjetos: new FormControl(this.atividades.nmProjetos, [Validators.required, Validators.maxLength(100)]),
    dtInicio: new FormControl(this.atividades.dtInicio, [Validators.required, Validators.maxLength(15)]),
    dtFinal: new FormControl(this.atividades.dtFinal, [Validators.required,Validators.maxLength(15)]),
    nmRecursos: new FormControl(this.atividades.nmRecursos, [Validators.required, Validators.maxLength(100)]),
    nrhorasAtividade: new FormControl(this.atividades.nrhorasAtividade, [Validators.required, Validators.maxLength(100)]),  
    nmusuario : [this.atividades.nmusuario = usuarioLogado.login]
  })
  this.page = 0;
    this.pageAtividades = 0;
    this.nmusuario = usuarioLogado.login;
     forkJoin(
      this.recusosws.findAll(this.page, this.linesPerPage, 'nmrecursos', 'ASC', this.searchField,  this.nmusuario),
      this.projetosws.findAll(this.page, this.linesPerPage, 'nmprojeto', 'ASC', this.searchField,  this.nmusuario), 
    ).subscribe(data => {
      this.listaRecursos = data[0]['content'];
      this.listaProjetos = data[1]['content'];
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    this.atividadesAutoComplete = [];
    for (const atividades of this.listaatividades ) {
      this.atividadesAutoComplete.push(atividades.oid + ', ' + atividades.dtFinal
      + ', ' + atividades.dtInicio + ', ' +  atividades.nmProjetos
      + ', ' + atividades.nmRecursos +','+  atividades.nrhorasAtividade  );
    }

    return this.atividadesAutoComplete.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  private inicializarFormGroup() {
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    this.formGroup = this.formBuilder.group({
      oidatividade : [this.atividades.oid],
      nmProjetos: new FormControl(this.atividades.nmProjetos, [Validators.required, Validators.maxLength(100)]),
      dtInicio: new FormControl(this.atividades.dtInicio, [Validators.required, Validators.maxLength(15)]),
      dtFinal: new FormControl(this.atividades.dtFinal, [Validators.required,Validators.maxLength(15)]),
      nmRecursos: new FormControl(this.atividades.nmRecursos, [Validators.required, Validators.maxLength(100)]),
      nrhorasAtividade: new FormControl(this.atividades.nrhorasAtividade, [Validators.required, Validators.maxLength(100)]),
      nmusuario : [this.atividades.nmusuario = usuarioLogado.login] 
    })

   /* if (this.editar) {
      this.validateAllFormFields();
    }
    */
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.atividadesws.save(this.atividades).subscribe(result => {
      this.snotifyService.success('Atividades Atualizada!');
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
}

