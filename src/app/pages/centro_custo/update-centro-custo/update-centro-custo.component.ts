import { CentroCusto} from '../../../model/centro-custo';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators , AbstractControl, FormBuilder,} from '@angular/forms';
import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { GlobalVars } from '../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { CentroCustoWS} from '../../../providers/ws/centro-custo.ws';
import {ListarCentroCustoComponent} from '../listar-cento-custo/listar-centro-custo.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormGroupPage} from '../../../providers/utils/form-group-page';
import * as _ from 'lodash';
import 'core-js/es6/weak-map';
import 'core-js/es7/reflect';
import {map, startWith} from 'rxjs/operators';
import { Projetos } from './../../../model/projetos';
import { ProjetosWS } from './../../../providers/ws/projetos.ws';
import {PaginatorPage} from '../../../providers/utils/paginator-page';

@Component({
  selector: 'app-update-centro-custo',
  templateUrl: './update-centro-custo.component.html',
  styleUrls: ['./update-centro-custo.component.css']
})

export class UpdateCentroCustoComponent extends PaginatorPage implements OnInit {
  formGroup: FormGroup;
  centrocusto : CentroCusto;
  listarCentrocusto : CentroCusto[];
  centrocustoAutoComplete : string[] =[];
  editar: boolean;
  filteredOptions: Observable<string[]>;
  listaProjetos: Projetos[];
  pageAtividades: number;
  linesPerPageAtividades: number;
  totalRecordsAtividades: number;
  nmusuario: string;
  constructor(private  projetosws: ProjetosWS,
              private centrocustows: CentroCustoWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<UpdateCentroCustoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any){
                super(); 
                this.centrocusto= _.cloneDeep(data['centrocusto'])
              }

  private inicializarObjeto() {
                this.centrocusto = <CentroCusto>{};
              }
              
  ngOnInit() { 
    this.editar = false;
    if (this.centrocusto == null && this.centrocusto.oid == null) {
      this.inicializarObjeto();
    } else if (this.centrocusto.oid != null) {
      this.editar = true;
    }
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    //this.inicializarFormGroup();
    this.formGroup = this.formBuilder.group({
      oid : [this.centrocusto.oid],
      vrcustoAprovado: new FormControl(this.centrocusto.vrcustoAprovado, [Validators.required, Validators.maxLength(100)]),
      vrcustoPrevisto: new FormControl(this.centrocusto.vrcustoPrevisto, [Validators.required, Validators.maxLength(100)]),
      dscentroCusto: new FormControl(this.centrocusto.dscentroCusto, [Validators.required, Validators.maxLength(100)]),
      nmprojeto: new FormControl(this.centrocusto.nmprojeto, [Validators.required]),
      nmusuario : [this.centrocusto.nmusuario = usuarioLogado.login]
    }); 
    this.page = 0;
    this.pageAtividades = 0;
    this.nmusuario = usuarioLogado.login;
    forkJoin(
      this.projetosws.findAll(this.page, this.linesPerPage, 'nmprojeto', 'ASC', this.searchField,  this.nmusuario),
    ).subscribe(data => {
      this.listaProjetos = data[0]['content'];
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    this.centrocustoAutoComplete = [];
    for (const centrocusto of this.listarCentrocusto ) {
      this.centrocustoAutoComplete.push(centrocusto.oid + ', ' + centrocusto.vrcustoAprovado
      + ', ' + centrocusto.vrcustoPrevisto +','+ centrocusto.dscentroCusto );
    }

    return this.centrocustoAutoComplete.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  private inicializarFormGroup() {
    //debugger;
    this.formGroup = this.formBuilder.group({
      oid : [this.centrocusto.oid],
      vrcustoAprovado: new FormControl(this.centrocusto.vrcustoAprovado, [Validators.required, Validators.maxLength(100)]),
      vrcustoPrevisto: new FormControl(this.centrocusto.vrcustoPrevisto, [Validators.required, Validators.maxLength(100)]),
      dscentroCusto: new FormControl(this.centrocusto.dscentroCusto, [Validators.required, Validators.maxLength(100)]),
      nmprojeto: new FormControl(this.centrocusto.nmprojeto, [Validators.required])

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
    this.centrocustows.save(this.centrocusto).subscribe(result => {
      this.snotifyService.success(' Custo Atualizada!');
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

