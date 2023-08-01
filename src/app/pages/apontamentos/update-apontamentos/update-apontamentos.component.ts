import { Empresa } from './../../../model/empresa';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators , AbstractControl, FormBuilder} from '@angular/forms';
import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { ApontamentosWS} from '../../../providers/ws/apontamentos.ws';
import {ListarApontamentosComponent} from '../listar-apontamentos/listar-apontamentos.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormGroupPage} from '../../../providers/utils/form-group-page';
import * as _ from 'lodash';
import 'core-js/es6/weak-map';
import 'core-js/es7/reflect';
import {map, startWith} from 'rxjs/operators';
import { Apontamentos } from 'src/app/model/apontamentos';
import { AtividadesWS } from '../../../providers/ws/atividades.ws';
import { Atividades } from '../../../model/atividades';
import {PaginatorPage} from '../../../providers/utils/paginator-page';

@Component({
  selector: 'app-update-apontamentos',
  templateUrl: './update-apontamentos.component.html',
  styleUrls: ['./update-apontamentos.component.css']
})

export class UpdateApontamentosComponent extends PaginatorPage implements OnInit {
  formGroup: FormGroup;
  apontamentos:  Apontamentos;
  atividades : Atividades;
  listaapontamentos : Apontamentos[];
  apontamentosAutoComplete : string[] =[];
  editar: boolean;
  filteredOptions: Observable<string[]>;
  listaAtividades : Atividades[];
  apontamentosEntity?: Apontamentos[];
  totalhoras: number[]= [];
  totalupdateHoras: number[]= []; 
  nrapontadas: number;
  atividadeslista: string[];
  pageAtividades: number;
   linesPerPageAtividades: number;
   totalRecordsAtividades: number;
  constructor(private apontamentosws: ApontamentosWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private atividadesws : AtividadesWS,
              public dialogRef: MatDialogRef<UpdateApontamentosComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any){

                super();
                this.apontamentos= _.cloneDeep(data['apontamentos'])
                this.apontamentos = _.cloneDeep(data['apontamentos']);
                this.atividades = _.cloneDeep(data['atividades']);
                this.atividadeslista = _.cloneDeep(data['atividadeslista']);
              }

  private inicializarObjeto() {
                this.apontamentos = <Apontamentos>{};
              }

private vilidaRecursos(control: AbstractControl) {
                return this.atividadesws.findByNmrecursos(control.value).pipe(
                  map(result =>  {
                          this.apontamentos.atividadeEntity = result;
                          this.nrapontadas = +0;
                          if (result != null) {
                            for (const atividadesEntity of this.apontamentos.atividadeEntity) {
                             // debugger;
                            this.apontamentos.nmRecursos = atividadesEntity.nmRecursos;
                            this.nrapontadas = atividadesEntity.nrhorasAtividade;
                            }
                            
                          }
              
                        }     
                  )
                );
                  }
              
  ngOnInit() { 
  
    this.editar = false;
    if (this.apontamentos == null && this.apontamentos.oid== null) {
      this.inicializarObjeto();
    } else if (this.apontamentos.oid != null) {
      this.editar = true;

    }
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    this.formGroup = this.formBuilder.group({
      nrapontamento: [ this.apontamentos.nrapontamento,[Validators.required, Validators.minLength(2)],this.calculaValorHoras.bind(this)],
      dtapontamento: [this.apontamentos.dtapontamento, [Validators.required]],
      dtlancamento: [this.apontamentos.dtlancamento, [Validators.required]],
      nmRecursos: [this.apontamentos.nmRecursos, [Validators.required ], this.vilidaRecursos.bind(this)],
      vratividade: [this.apontamentos.vratividade, [Validators.required]],
      nmusuario : [this.apontamentos.nmusuario = usuarioLogado.login] 
    });
    this.page = 0;
    this.pageAtividades = 0;
    this.apontamentos.nmusuario = usuarioLogado.login;

   forkJoin(
      this.atividadesws.findAll(this.page, this.linesPerPage, 'nmRecursos', 'ASC', this.searchField, this.apontamentos.nmusuario), 
    ).subscribe(data => {
      this.listaAtividades = data[0]['content'];
      
    });

    this.filteredOptions = this.formGroup.get('oid').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    this.apontamentosAutoComplete = [];
    for (const apontamentos of this.listaapontamentos ) {
      this.apontamentosAutoComplete.push(apontamentos.oid + ', ' + apontamentos.dtapontamento
      + ', ' + apontamentos.dtlancamento + ', ' + apontamentos.nrapontamento );
    }

    return this.apontamentosAutoComplete.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  private inicializarFormGroup() {
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    this.formGroup = this.formBuilder.group({
        oidapontamento : [this.apontamentos.oid],
        dtapontamento: new FormControl(this.apontamentos.dtapontamento, [Validators.required, Validators.maxLength(100)]),
        dtlancamento: new FormControl(this.apontamentos.dtlancamento, [Validators.required, Validators.maxLength(15)]),
        nrapontamento: [ this.apontamentos.nrapontamento,[Validators.required, Validators.minLength(2)],this.calculaValorHoras.bind(this)],
        nmRecursos: new FormControl(this.apontamentos.nmRecursos, [Validators.required]),
        vratividade: new FormControl(this.apontamentos.vratividade, [Validators.required]),
        nmusuario : [this.apontamentos.nmusuario = usuarioLogado.login] 
    })

   /* if (this.editar) {
      this.validateAllFormFields();
    }*/
  }

  private calculaValorHoras(control: AbstractControl) {
    return this.apontamentosws.findByNmrecursos(this.apontamentos.nmRecursos, control.value).pipe(
    map( result =>{
      this.apontamentosEntity = result;
      var novahora = control.value; 
      this.totalhoras = [];
      this.totalupdateHoras= [];
      var  total = +0;
      if(result != null && control.value.length > 0){
          const apontamentosEntity =  this.apontamentosEntity.reduce( function( prevVal, elem ) {
            return prevVal + elem.nrapontamento;
        }, 0 );
         this.totalhoras.push(apontamentosEntity);
         for(const Entity of this.apontamentosEntity){
         this.totalupdateHoras.push(Entity.nrapontamento);
         for(var i =0; i< this.totalhoras.length; i++){
            total = (Number(this.totalhoras[i])- Number(this.totalupdateHoras[i])+ Number(novahora));
          if (total <= this.nrapontadas){
            return true;
         }
        }
        }

    return {'horasErro' : true};
    }
  }
)
   );
  
}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.apontamentosws.save(this.apontamentos).subscribe(result => {
      this.snotifyService.success('Apontamentos Atualizada!');
      this.onNoClick();
      //this.load();
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

