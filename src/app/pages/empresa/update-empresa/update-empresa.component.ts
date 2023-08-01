import { Empresa } from './../../../model/empresa';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators , AbstractControl, FormBuilder,} from '@angular/forms';
import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { EmpresaWS} from '../../../providers/ws/empresa.ws';
import {ListarEmpresaComponent} from '../listar-empresa/listar-empresa.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormGroupPage} from '../../../providers/utils/form-group-page';
import * as _ from 'lodash';
import 'core-js/es6/weak-map';
import 'core-js/es7/reflect';
import {map, startWith} from 'rxjs/operators';



@Component({
  selector: 'app-update-empresa',
  templateUrl: './update-empresa.component.html',
  styleUrls: ['./update-empresa.component.css']
})

export class UpdateEmpresaComponent extends FormGroupPage implements OnInit {
  registerForm: FormGroup;
  empresa:  Empresa;
  listaempresa : Empresa[];
  empresaAutoComplete : string[] =[];
  editar: boolean;
  filteredOptions: Observable<string[]>;
    oidempresa: number;
    nmempresa: string;
    nrcnpj: number;
    nrtelefone : number;
    dsendereco: string;
    

  constructor(private empresaws: EmpresaWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<UpdateEmpresaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any){
                super(); 
                this.empresa= _.cloneDeep(data['empresa'])
              }

  private inicializarObjeto() {
                this.empresa = <Empresa>{};
              }
              
  ngOnInit() { 
 
    this.editar = false;
    if (this.empresa == null && this.empresa.oid == null) {
      this.inicializarObjeto();
    } else if (this.empresa.oid != null) {
      this.editar = true;
     
    }
 
    this.inicializarFormGroup();

    this.filteredOptions = this.formGroup.get('oidempresa').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    this.empresaAutoComplete = [];
    for (const empresa of this.listaempresa ) {
      this.empresaAutoComplete.push(empresa.oid + ', ' + empresa.nmempresa
      + ', ' + empresa.nrcnpj + ', ' + empresa.nrtelefone + ', ' + empresa.dsRua 
      + ', ' + empresa.dsNumero + ', ' + empresa.dsCidade
      + ', ' + empresa.dsBairro + ', ' + empresa.dsComplemento);
    }

    return this.empresaAutoComplete.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  private inicializarFormGroup() {
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    this.registerForm = this.formBuilder.group({
      nmempresa: [this.empresa.nmempresa, [Validators.required]],
      nrcnpj: [this.empresa.nrcnpj, [Validators.required]],
      nrtelefone: [this.empresa.nrtelefone, [Validators.required]],
      dsRua: [this.empresa.dsRua, [Validators.required]],
      dsNumero: [this.empresa.dsNumero, [Validators.required]],
      dsBairro: [this.empresa.dsBairro, [Validators.required]],
      dsCidade: [this.empresa.dsCidade, [Validators.required]],
      dsComplemento: [this.empresa.dsComplemento], 
      nmusuario : [this.empresa.nmusuario = usuarioLogado.login] 

    })

    if (this.editar) {
      this.validateAllFormFields();
    }
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    this.empresaws.save(this.empresa).subscribe(result => {
      this.snotifyService.success('Empresa Atualizada!');
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

