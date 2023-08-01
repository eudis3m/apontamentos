import { Component, OnInit } from '@angular/core';
import { Atividades } from '../../../model/atividades';
import { Apontamentos } from './../../../model/apontamentos';
import { Observable, forkJoin, of } from 'rxjs';
import { FormGroup, Validators, FormBuilder,FormControl, AbstractControl} from '@angular/forms';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { ApontamentosWS } from './../../../providers/ws/apontamentos.ws';
import { AtividadesWS } from '../../../providers/ws/atividades.ws';
import { Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as _ from 'lodash';
import {FormGroupPage} from './../../../providers/utils/form-group-page';
import {map, startWith} from 'rxjs/operators';
import {PaginatorPage} from '../../../providers/utils/paginator-page';


@Component({
  selector: 'app-apontamentos',
  templateUrl: './apontamentos.component.html',
  styleUrls: ['./apontamentos.component.css']
})
export class ApontamentosComponent extends PaginatorPage implements OnInit {
  formGroup: FormGroup;
  apontamentos:  Apontamentos;
  atividades : Atividades;
  listarapontmentos: Apontamentos[] = [];
  editar: boolean;
  listaAtividades : Atividades[];
  nmrecurso: string;
  nrapontadas: number;
  apontamentosEntity?: Apontamentos[];
  atividadesAutoComplete: number[]= [];
  atividadeslista: string[];
  totalhoras: number[]= [];
   total = 0;
  filteredOptions: Observable<number[]>;
   apontaEntity : Apontamentos[]=[];
   pageAtividades: number;
   linesPerPageAtividades: number;
   totalRecordsAtividades: number;
   nmusuario: string;
  constructor(private formBuilder: FormBuilder,
              //public totalhoras: [],
              private  apontamentosws: ApontamentosWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private atividadesws : AtividadesWS,
             @Inject(MAT_DIALOG_DATA) public data: any)
              {
                super();
                this.apontamentos = _.cloneDeep(data['apontamentos']);
                this.atividades = _.cloneDeep(data['atividades']);
                this.atividadeslista = _.cloneDeep(data['atividadeslista']);
               
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

    private inicializarObjeto() {
      this.apontamentos = <Apontamentos>{};
      //this.calculaValorHoras();
      //this.vilidaRecursos.bind(this);
    }
    private calculaValorHoras(control: AbstractControl) {
      return this.apontamentosws.findByNmrecursos(this.apontamentos.nmRecursos, control.value).pipe(
      map( result =>{
        this.apontamentosEntity = result;
        var novahora = control.value; 
        this.totalhoras = [];
        var  total = +0;
        if(result != null && control.value.length > 0){
            const apontamentosEntity =  this.apontamentosEntity.reduce( function( prevVal, elem ) {
              return prevVal + elem.nrapontamento;
          }, 0 );
           this.totalhoras.push(apontamentosEntity);
           for(var i =0; i< this.totalhoras.length; i++){
              total = (Number(this.totalhoras[i]) + Number(novahora));
            if (total <= this.nrapontadas){
              return true;
           }
          }

      return {'horasErro' : true};
      }
    }
  )
     );
    
  }

  ngOnInit() {
    this.editar = false;
    this.activatedRoute.queryParams.subscribe(routeParams => {
      if (routeParams.id == null) {
       this.inicializarObjeto();
        this.apontamentos = <Apontamentos>{};
        this.editar = false;
      } else {
        this.editar = true;
        this.apontamentosws.findById(routeParams.id).subscribe(result => {
          this.apontamentos = result;
          console.log(result);
        });
      }

   
    });
  const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
  this.page = 0;
  this.pageAtividades = 0;
  this.nmusuario = usuarioLogado.login;

     this.formGroup = this.formBuilder.group({
      nrapontamento: [ this.apontamentos.nrapontamento,[Validators.required, Validators.minLength(2)],this.calculaValorHoras.bind(this)],
      dtapontamento: [this.apontamentos.dtapontamento, [Validators.required]],
      dtlancamento: [this.apontamentos.dtlancamento, [Validators.required]],
      nmRecursos: [this.apontamentos.nmRecursos, [Validators.required ], this.vilidaRecursos.bind(this)],
      vratividade: [this.apontamentos.vratividade, [Validators.required]],
      nmusuario : [this.apontamentos.nmusuario = usuarioLogado.login] 
     
    });
   

   forkJoin(
      this.atividadesws.findAll(this.page, this.linesPerPage, 'nmRecursos', 'ASC', this.searchField,  this.nmusuario), 
    ).subscribe(data => {
      this.listaAtividades = data[0]['content'];
      
    });

    
  }
 private _filter(value: number): number[] {
    const filterValue = value.toString();
    this.atividadesAutoComplete = [];
    for (const atividades of this.listaAtividades) {
      debugger;
      this.atividadesAutoComplete.push(atividades.nrhorasAtividade);  
    }
    return this.atividadesAutoComplete.filter(option => option.toString().includes(filterValue));
  }
  public destroy(){
    this.router.navigate(['/login']);
  }
  
 onSubmit() {
   if (this.formGroup.invalid) {
      return;
    }
  //  const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();  

    this.spinner.show();
    console.log(this.apontamentos);
    this.apontamentosws.save(this.apontamentos).subscribe(result => {
      if (!this.editar) {
        this.formGroup.reset();
      }
      this.spinner.hide();
      this.snotifyService.success('Apontamentos cadastrado com sucesso!');
     // this.load();
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
}
