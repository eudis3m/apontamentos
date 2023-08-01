import { CentroCusto } from './../../../model/centro-custo';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators,  FormBuilder  } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { CentroCustoWS } from './../../../providers/ws/centro-custo.ws';
import { Projetos } from './../../../model/projetos';
import { ProjetosWS } from './../../../providers/ws/projetos.ws';
import {PaginatorPage} from '../../../providers/utils/paginator-page';

@Component({
  selector: 'app-centro-custo',
  templateUrl: './centro-custo.component.html',
  styleUrls: ['./centro-custo.component.css']
})
export class CentroCustoComponent extends PaginatorPage implements OnInit {
 registerForm: FormGroup;
  centrocusto:  CentroCusto;
  listarcentro_custo : CentroCusto[] = [];
   editar: boolean;
   listaProjetos : Projetos[];
   pageAtividades: number;
   linesPerPageAtividades: number;
   totalRecordsAtividades: number;
   nmusuario: string;
  constructor(
    private  centro_custows: CentroCustoWS,
              private globalVars: GlobalVars,
              private formBuilder :FormBuilder,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private  projetosws: ProjetosWS,
  ) {
    super()
   }

  ngOnInit() {
    this.centrocusto = <CentroCusto>{};

    this.activatedRoute.queryParams.subscribe(routeParams => {
      if (routeParams.id == null) {
        this.centrocusto = <CentroCusto>{};
        this.editar = false;
      } else {
        this.editar = true;
        this.centro_custows.findById(routeParams.id).subscribe(result => {
          this.centrocusto = result;
          console.log(result);
        });
      }
    });
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
     this.registerForm = this.formBuilder.group({
      vrcustoPrevisto: new FormControl(this.centrocusto.vrcustoPrevisto, [Validators.required]),
      vrcustoAprovado: new FormControl(this.centrocusto.vrcustoAprovado, [Validators.required]),
      dscentroCusto: new FormControl(this.centrocusto.dscentroCusto, [Validators.required]),
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
 onSubmit() {
   if (this.registerForm.invalid) {
      return;
    }
   // const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
   

    this.spinner.show();
    console.log(this.centrocusto);
    this.centro_custows.save(this.centrocusto).subscribe(result => {
      if (!this.editar) {
        this.registerForm.reset();
      }
      this.spinner.hide();
      this.snotifyService.success('Custo cadastrado com sucesso!');
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
}
