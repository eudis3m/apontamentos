import { Atividades } from './../../../model/atividades';
import { Recursos } from './../../../model/recursos';
import { Projetos} from './../../../model/projetos';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { ProjetosWS } from './../../../providers/ws/projetos.ws';
import {RecursosWS} from './../../../providers/ws/recursos.ws';
import {AtividadesWS} from './../../../providers/ws/atividades.ws';
import {FormGroupPage} from './../../../providers/utils/form-group-page';
import { Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as _ from 'lodash';
import {PaginatorPage} from '../../../providers/utils/paginator-page';

@Component({
  selector: 'app-atividade',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.css']
})
export class AtividadesComponent extends PaginatorPage implements OnInit {
  registerForm: FormGroup;
  atividades : Atividades;
  projetos: Projetos;
  recursos : Recursos;
  listarAtividade : Atividades[] = [];
   editar: boolean;
   listaRecursos: Recursos[];
   listaProjetos : Projetos[];
   pageAtividades: number;
   linesPerPageAtividades: number;
   totalRecordsAtividades: number;
   nmusuario: string;
  constructor(private  atividadesws: AtividadesWS,
              private globalVars: GlobalVars,
              private formBuilder :FormBuilder,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private recusosws : RecursosWS,
              private projetosws : ProjetosWS,
              @Inject(MAT_DIALOG_DATA) public data: any) {
              super();
              this.projetos = _.cloneDeep(data['projetos']);
              this.recursos = _.cloneDeep(data['recursos']);
              this.atividades = _.cloneDeep(data['atividades']);
              } 
          

  ngOnInit() {
    this.atividades = <Atividades>{};

    this.activatedRoute.queryParams.subscribe(routeParams => {
      if (routeParams.id == null) {
        this.atividades = <Atividades>{};
        this.editar = false;
      } else {
        this.editar = true;
        this.atividadesws.findById(routeParams.id).subscribe(result => {
          this.atividades = result;
          console.log(result);
        });
      }
    });
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    this.registerForm = this.formBuilder.group({
      dtFinal: new FormControl(this.atividades.dtFinal, [Validators.required]),
       dtInicio : new FormControl(this.atividades.dtInicio, [Validators.required]),
       nmRecursos: new FormControl(this.atividades.nmRecursos, [Validators.required]),
       nmProjetos: new FormControl(this.atividades.nmProjetos, [Validators.required]),
       nrhorasAtividade: new FormControl(this.atividades.nrhorasAtividade, [Validators.required]),
       nmusuario : [this.atividades.nmusuario = usuarioLogado.login] 
       
    });
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

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
   // const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();


    this.spinner.show();
    console.log(this.atividades);
    this.atividadesws.save(this.atividades).subscribe(result => {
      if (!this.editar) {
        this.registerForm.reset();
      }
      this.spinner.hide();
      this.snotifyService.success('Atividade cadastrada com sucesso!');
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
