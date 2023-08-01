import { TiposAtividades} from './../../../model/tipo-atividade';
import { Observable, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators , FormBuilder} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioLogado } from '../../../model/usuario-logado';
import { TiposAtividadesWS } from './../../../providers/ws/tipo-atividade.ws';
@Component({
  selector: 'app-tipo-atividade',
  templateUrl: './tipo-atividade.component.html',
  styleUrls: ['./tipo-atividade.component.css']
})
export class TipoAtividadesComponent implements OnInit {
registerForm: FormGroup;
 tiposAtividades : TiposAtividades;
 listartiposAtividades : TiposAtividades[]=[];
   editar: boolean;
  constructor(
    private  tiposAtividadesws: TiposAtividadesWS,
              private globalVars: GlobalVars,
              private formBuilder: FormBuilder,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.tiposAtividades = <TiposAtividades>{};

    this.activatedRoute.queryParams.subscribe(routeParams => {
      if (routeParams.id == null) {
        this.tiposAtividades = <TiposAtividades>{};
        this.editar = false;
      } else {
        this.editar = true;
        this.tiposAtividadesws.findById(routeParams.id).subscribe(result => {
          this.tiposAtividades = result;
          console.log(result);
        });
      }
    });
    const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
    this.registerForm = this.formBuilder.group({
      nmtipoAtividade: new FormControl(this.tiposAtividades.nmtipoAtividade, [Validators.required]), 
     vratividade: new FormControl(this.tiposAtividades.vratividade, [Validators.required]),
     nmusuario : [this.tiposAtividades.nmusuario = usuarioLogado.login]
    });
  }
  onSubmit() {
   if (this.registerForm.invalid) { 
      return;
    }
   
    this.spinner.show();
    console.log(this.tiposAtividades);
    this.tiposAtividadesws.save(this.tiposAtividades).subscribe(result => {
      if (!this.editar) {
        this.registerForm.reset();
      }
      this.spinner.hide();
      this.snotifyService.success('Atividade cadastro com sucesso!');
      //this.load();
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
