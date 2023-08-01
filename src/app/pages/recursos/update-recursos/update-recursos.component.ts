import { Recursos } from '../../../model/recursos';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators , AbstractControl, FormBuilder,} from '@angular/forms';
import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { GlobalVars } from '../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { RecursosWS} from '../../../providers/ws/recursos.ws';
import {ListarRecursosComponent} from '../listar-recursos/listar-recursos.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormGroupPage} from '../../../providers/utils/form-group-page';
import * as _ from 'lodash';
import 'core-js/es6/weak-map';
import 'core-js/es7/reflect';
import {map, startWith} from 'rxjs/operators';



@Component({
  selector: 'app-update-recursos',
  templateUrl: './update-recursos.component.html',
  styleUrls: ['./update-recursos.component.css']
})

export class UpdateRecursosComponent extends FormGroupPage implements OnInit {
  registerForm: FormGroup;
  recursos:  Recursos;
  listarecursos : Recursos[];
  recursosAutoComplete : string[] =[];
  editar: boolean;
  filteredOptions: Observable<string[]>;

    

  constructor(private recursosws: RecursosWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<UpdateRecursosComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any){
                super();
                this.recursos = _.cloneDeep(data['recursos'])
              }

  private inicializarObjeto() {
                this.recursos = <Recursos>{};
              }
              
  ngOnInit() { 
  
    this.editar = false;
    if (this.recursos == null && this.recursos.oid == null) {
      this.inicializarObjeto();
    } else if (this.recursos.oid!= null) {
      this.editar = true;

    }
 
    this.inicializarFormGroup();

    this.filteredOptions = this.formGroup.get('oid').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    this.recursosAutoComplete = [];
    for (const recursos of this.listarecursos ) {
      this.recursosAutoComplete.push(recursos.oid + ', ' + recursos.nmrecursos );
    }

    return this.recursosAutoComplete.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  private inicializarFormGroup() {
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    this.formGroup = this.formBuilder.group({
      nmrecursos: new FormControl(this.recursos.nmrecursos, [Validators.required]),
      nmusuario : [this.recursos.nmusuario = usuarioLogado.login]
    });

    if (this.editar) {
      this.validateAllFormFields();
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.recursosws.save(this.recursos).subscribe(result => {
      this.snotifyService.success('Recursos Atualizada!');
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

