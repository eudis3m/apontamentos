import { Projetos } from './../../../model/projetos';
import { Empresa } from './../../../model/empresa';
import { CentroCusto } from './../../../model/centro-custo';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators ,  FormBuilder} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { ProjetosWS } from './../../../providers/ws/projetos.ws';
import {CentroCustoWS} from './../../../providers/ws/centro-custo.ws';
import {EmpresaWS} from './../../../providers/ws/empresa.ws';
import { Inject } from '@angular/core';
import {PaginatorPage} from '../../../providers/utils/paginator-page';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as _ from 'lodash';
import {FormGroupPage} from './../../../providers/utils/form-group-page';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.css']
})

export class ProjetosComponent extends PaginatorPage implements OnInit {
  registerForm: FormGroup;
  projetos: Projetos;
   listarprojetos : Projetos [] = [];
   editar: boolean;
   empresa: Empresa;
   centrocusto: CentroCusto;
   projetosAutoComplete: string[] = [];
   listaEmpresa: string[] ;
   listaCentroCusto : CentroCusto[];
   pageProjetos: number;
   nmusuario : string;
   filteredOptions: Observable<string[]>;
 linesPerPageProjetos: number;
 totalRecordsProjetos: number;
 pageAtividades: number;
 linesPerPageAtividades: number;
 totalRecordsAtividades: number;
  constructor(private  projetosws: ProjetosWS,
              private globalVars: GlobalVars,
              private formBuilder : FormBuilder,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private empresaws : EmpresaWS,
              private centro_custows : CentroCustoWS,
              public dialogRef: MatDialogRef<ProjetosComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
              super();
              this.empresa = _.cloneDeep(data['empresa']);
              this.centrocusto = _.cloneDeep(data['centrocusto']);
              this.projetos = _.cloneDeep(data['projetos']);
              }

  ngOnInit() {
     this.projetos = <Projetos>{};

    this.activatedRoute.queryParams.subscribe(routeParams => {
      if (routeParams.id == null) {
        this.projetos = <Projetos>{};
        this.editar = false;
      } else {
        this.editar = true;
        this.projetosws.findById(routeParams.id).subscribe(result => {
          this.projetos = result;
          console.log(result);
        });
      }
    });
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
     this.registerForm = this.formBuilder.group({
      dsdescricaoProjeto: new FormControl(this.projetos.dsdescricaoProjeto, [Validators.required]),
      dtprojetoFinal: new FormControl(this.projetos.dtprojetoFinal, [Validators.required]),
      dtprojetoInicio: new FormControl(this.projetos.dtprojetoInicio, [Validators.required]),
      nmEmpresa: new FormControl(this.projetos.nmEmpresa, [Validators.required]),
      nmprojeto: new FormControl(this.projetos.nmprojeto, [Validators.required]),
      vrcustoAprovado: new FormControl(this.projetos.vrcustoAprovado),
      nmusuario : [this.projetos.nmusuario = usuarioLogado.login]
     
    });
  this.page = 0;
  this.pageProjetos = 0;
  this.nmusuario = usuarioLogado.login;
    forkJoin(
      this.centro_custows.findAll(this.page, this.linesPerPage, 'nmprojeto', 'ASC', this.searchField, this.nmusuario),
      this.empresaws.findAll(this.page, this.linesPerPage, 'nmempresa', 'ASC', this.searchField, this.nmusuario), 
    ).subscribe(data => {
      this.listaCentroCusto = data[0]['content'];
      this.listaEmpresa = data[1]['content'];
    });
  
  }

   onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    //const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();


    this.spinner.show();
    console.log(this.projetos);
    this.projetosws.save(this.projetos).subscribe(result => {
      if (!this.editar) {
        this.registerForm.reset();
      }
      this.spinner.hide();
      this.snotifyService.success('Projeto cadastrado com sucesso!');
     // this.load();
    }, error => {
      this.spinner.hide();
      this.snotifyService.error(error);
    });
  }
 /* load() {
    setTimeout(function () {
      location.reload()
  }, 100);
  }*/

}
