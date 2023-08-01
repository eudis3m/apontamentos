import { TiposAtividades} from '../../../model/tipo-atividade';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators , AbstractControl, FormBuilder,} from '@angular/forms';
import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { GlobalVars } from '../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { TiposAtividadesWS} from '../../../providers/ws/tipo-atividade.ws';
import {ListartipoAtividadeComponent} from '../listar-tripo-atividade/listar-tipo-atividade.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormGroupPage} from '../../../providers/utils/form-group-page';
import * as _ from 'lodash';
import 'core-js/es6/weak-map';
import 'core-js/es7/reflect';
import {map, startWith} from 'rxjs/operators';



@Component({
  selector: 'app-update-tipo-atividade',
  templateUrl: './update-tipo-atividade.component.html',
  styleUrls: ['./update-tipo-atividade.component.css']
})

export class UpdatetipoAtividadeComponent extends FormGroupPage implements OnInit {
  registerForm: FormGroup;
  tiposAtividades:  TiposAtividades;
  listatiposAtividades : TiposAtividades[];
  tiposAtividadesAutoComplete : string[] =[];
  editar: boolean;
  filteredOptions: Observable<string[]>;

    

  constructor(private tiposAtividadesws: TiposAtividadesWS,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<UpdatetipoAtividadeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any){
                super(); 
                this.tiposAtividades= _.cloneDeep(data['tiposAtividades'])
              }

  private inicializarObjeto() {
                this.tiposAtividades = <TiposAtividades>{};
              }
              
  ngOnInit() { 
    this.editar = false;
    if (this.tiposAtividades == null && this.tiposAtividades.oid == null) {
      this.inicializarObjeto();
    } else if (this.tiposAtividades.oid != null) {
      this.editar = true;
    }
 
    this.inicializarFormGroup();

    this.filteredOptions = this.formGroup.get('oidtipoAtividade').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    this.tiposAtividadesAutoComplete = [];
    for (const tiposAtividades of this.listatiposAtividades ) {
      this.tiposAtividadesAutoComplete.push(tiposAtividades.oid + ', ' + tiposAtividades.nmtipoAtividade
      + ', ' + tiposAtividades.vratividade );
    }

    return this.tiposAtividadesAutoComplete.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  private inicializarFormGroup() {
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    this.formGroup = this.formBuilder.group({
      oidtipoAtividade : [this.tiposAtividades.oid],
      nmtipoAtividade: new FormControl(this.tiposAtividades.nmtipoAtividade, [Validators.required, Validators.maxLength(100)]),
      vratividade: new FormControl(this.tiposAtividades.vratividade, [Validators.required, Validators.maxLength(15)]),
      nmusuario : [this.tiposAtividades.nmusuario = usuarioLogado.login]
    })

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
    this.tiposAtividadesws.save(this.tiposAtividades).subscribe(result => {
      this.snotifyService.success(' Atualizada!');
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

