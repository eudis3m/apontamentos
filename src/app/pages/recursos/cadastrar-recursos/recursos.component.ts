import { Recursos } from './../../../model/recursos';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { RecursosWS } from './../../../providers/ws/recursos.ws';
import {FormGroupPage} from '../../../providers/utils/form-group-page';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.css']
})
export class RecursosComponent extends FormGroupPage implements OnInit {
  formGroup: FormGroup;
  recursos: Recursos;
  listarrecursos : Recursos[] = [];
   editar: boolean;
   nmusuario : string;
  constructor(
    private  recursosws: RecursosWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute
  ) { 
    super() 
  }

  ngOnInit() {
    this.recursos = <Recursos>{};

    this.activatedRoute.queryParams.subscribe(routeParams => {
      if (routeParams.id == null) {
        this.recursos = <Recursos>{};
        this.editar = false;
      } else {
        this.editar = true;
        this.recursosws.findById(routeParams.id).subscribe(result => {
          this.recursos = result;
          console.log(result);
        });
      }
    });
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    this.formGroup = this.formBuilder.group({
      nmrecursos: new FormControl(this.recursos.nmrecursos, [Validators.required]),
      nmusuario : [this.recursos.nmusuario = usuarioLogado.login]
    });
  }
  onSubmit() {
   if (this.formGroup.invalid) {
      return;
    }
   
    this.spinner.show();
    console.log(this.recursos);
    this.recursosws.save(this.recursos).subscribe(result => {
      if (!this.editar) {
        this.formGroup.reset();
      }
      this.spinner.hide();
      this.snotifyService.success('Recursos cadastro com sucesso!');
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
