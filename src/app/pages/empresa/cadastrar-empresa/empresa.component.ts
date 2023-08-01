import { Empresa } from './../../../model/empresa';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators ,  FormBuilder} from '@angular/forms';
import { Component, OnInit,  Inject } from '@angular/core';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { EmpresaWS } from './../../../providers/ws/empresa.ws';
import {FormGroupPage} from '../../../providers/utils/form-group-page';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent extends FormGroupPage implements OnInit {
  formGroup: FormGroup;
  empresa:  Empresa;
  listarempresa : Empresa[] = [];
  editar: boolean;
  nmusuario : string;
  constructor(private empresaws: EmpresaWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
               public dialogRef: MatDialogRef<EmpresaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any){
                super();
                this.empresa = _.cloneDeep(data['empresa']);
}

  ngOnInit() { this.empresa = <Empresa>{};

    this.activatedRoute.queryParams.subscribe(routeParams => {
      if (routeParams.id == null) {
        this.empresa = <Empresa>{};
        this.editar = false;
      } else {
        this.editar = true;
        this.empresaws.findById(routeParams.id).subscribe(result => {
          this.empresa = result;
          console.log(result);
        });
      }
    });
    this.inicializarFormGroup();
  
  }

  private inicializarFormGroup() {
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    this.formGroup = this.formBuilder.group({
      nmempresa: [this.empresa.nmempresa, [Validators.required]],
      nrcnpj: [this.empresa.nrcnpj, [Validators.required]],
      nrtelefone: [this.empresa.nrtelefone, [Validators.required]],
      dsRua: [this.empresa.dsRua, [Validators.required]],
      dsNumero: [this.empresa.dsNumero, [Validators.required]],
      dsBairro: [this.empresa.dsBairro, [Validators.required]],
      dsCidade: [this.empresa.dsCidade, [Validators.required]],
      dsComplemento: [this.empresa.dsComplemento],
      nmusuario : [this.empresa.nmusuario = usuarioLogado.login] 
   });
  if (this.editar) {
    this.validateAllFormFields();
  }
  }
 onSubmit() {
   if (this.formGroup.invalid) {
      return;
    }
   // const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
 
 
    this.spinner.show();
    console.log(this.empresa);
    this.empresaws.save(this.empresa).subscribe(result => {
      if (!this.editar) {
        this.formGroup.reset();
      }
      this.spinner.hide();
      this.snotifyService.success('Empresa cadastrada com sucesso!');
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

