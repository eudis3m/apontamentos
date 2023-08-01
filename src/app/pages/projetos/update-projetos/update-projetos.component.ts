import { Projetos } from '../../../model/projetos';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators , AbstractControl, FormBuilder,} from '@angular/forms';
import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { GlobalVars } from '../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { ProjetosWS} from '../../../providers/ws/projetos.ws';
import {ListarProjetosComponent} from '../listar-projetos/listar-projetos.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormGroupPage} from '../../../providers/utils/form-group-page';
import * as _ from 'lodash';
import 'core-js/es6/weak-map';
import 'core-js/es7/reflect';
import {map, startWith} from 'rxjs/operators';
import {CentroCustoWS} from './../../../providers/ws/centro-custo.ws';
import {EmpresaWS} from './../../../providers/ws/empresa.ws';
import { CentroCusto } from './../../../model/centro-custo';
import {PaginatorPage} from '../../../providers/utils/paginator-page';

@Component({
  selector: 'app-update-projetos',
  templateUrl: './update-projetos.component.html',
  styleUrls: ['./update-projetos.component.css']
})

export class UpdateProjetosComponent extends PaginatorPage implements OnInit {
  formGroup: FormGroup;
  projetos: Projetos;
  listaprojetos : Projetos[];
  projetosAutoComplete : string[] =[];
  editar: boolean;
  filteredOptions: Observable<string[]>;
  listaEmpresa: string[] ;
  listaCentroCusto : CentroCusto[]; 
  linesPerPageProjetos: number;
 totalRecordsProjetos: number;
 pageAtividades: number;
 linesPerPageAtividades: number;
 totalRecordsAtividades: number;
 nmusuario : string;
 pageProjetos: number;
  constructor(private centrocustows : CentroCustoWS,
              private empresaws: EmpresaWS,
              private projetosws: ProjetosWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<UpdateProjetosComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any){
                super(); 
                this.projetos= _.cloneDeep(data['projetos'])
              }

  private inicializarObjeto() {
                this.projetos = <Projetos>{};
              }
              
  ngOnInit() { 
    this.editar = false;
    if (this.projetos == null && this.projetos.oid == null) {
      this.inicializarObjeto();
    } else if (this.projetos.oid != null) {
      this.editar = true;
    
    }
 
    //this.inicializarFormGroup();
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    this.formGroup = this.formBuilder.group({
      dsdescricaoProjeto: new FormControl(this.projetos.dsdescricaoProjeto, [Validators.required]),
      dtprojetoFinal: new FormControl(this.projetos.dtprojetoFinal, [Validators.required]),
      dtprojetoInicio: new FormControl(this.projetos.dtprojetoInicio, [Validators.required]),
      nmEmpresa: new FormControl(this.projetos.nmEmpresa, [Validators.required]),
      nmprojeto: new FormControl(this.projetos.nmprojeto, [Validators.required]),
      vrcustoAprovado: new FormControl(this.projetos.vrcustoAprovado, [Validators.required]), 
      nmusuario : [this.projetos.nmusuario = usuarioLogado.login]
     
    });
    this.page = 0;
  this.pageProjetos = 0;
  this.nmusuario = usuarioLogado.login;
    forkJoin(
      this.centrocustows.findAll(this.page, this.linesPerPage, 'nmprojeto', 'ASC', this.searchField, this.nmusuario),
      this.empresaws.findAll(this.page, this.linesPerPage, 'nmempresa', 'ASC', this.searchField, this.nmusuario), 
    ).subscribe(data => {
      this.listaCentroCusto = data[0]['content'];
      this.listaEmpresa = data[1]['content'];
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    this.projetosAutoComplete = [];
    for (const projetos of this.listaprojetos ) {
      this.projetosAutoComplete.push(projetos.oid + ', ' + projetos.nmprojeto
      + ', ' + projetos.nmEmpresa + ', ' + projetos.dtprojetoInicio + ', ' + projetos.dtprojetoFinal 
      + ', ' + projetos.dsdescricaoProjeto + ','+ projetos.vrcustoAprovado);
    }

    return this.projetosAutoComplete.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  private inicializarFormGroup() {
    this.formGroup = this.formBuilder.group({
      oidprojetos : [this.projetos.oid],
      nmprojeto: new FormControl(this.projetos.nmprojeto, [Validators.required, Validators.maxLength(100)]),
      nmEmpresa: new FormControl(this.projetos.nmEmpresa, [Validators.required, Validators.maxLength(100)]),
      dtprojetoInicio: new FormControl(this.projetos.dtprojetoInicio, [Validators.required,Validators.maxLength(100)]),
      dtprojetoFinal: new FormControl(this.projetos.dtprojetoFinal, [Validators.required, Validators.maxLength(100)]), 
      dsdescricaoProjeto : new FormControl(this.projetos.dsdescricaoProjeto, [Validators.required, Validators.maxLength(100)]),
      vrcustoAprovado : new FormControl(this.projetos.vrcustoAprovado, [Validators.required, Validators.maxLength(100)]) 

    })

   /* if (this.editar) {
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
    this.projetosws.save(this.projetos).subscribe(result => {
      this.snotifyService.success('Projeto Atualizada!');
      this.onNoClick();
      //this.load();
    }, error => {
      console.log(error);
    });
  }
 /* load() {
    setTimeout(function () {
      location.reload()
  }, 100);
  }*/
}

