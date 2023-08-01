import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {SnotifyService} from 'ng-snotify';
import {GlobalVars} from '../../providers/utils/global-vars';
import {NgxSpinnerService} from 'ngx-spinner';
import {UsuarioLogado} from '../../model/usuario-logado';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup : FormGroup;
  private formSubmitAttempt: boolean; 
  usuariologado :UsuarioLogado;
  constructor(
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private globalVars: GlobalVars,
              private snotifyService: SnotifyService,
              private spinner: NgxSpinnerService) {

  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      dsLogin: ['', Validators.required],
      dssenha: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.formGroup.get(field).valid && this.formGroup.get(field).touched) ||
      (this.formGroup.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    this.spinner.show();

    if (this.formGroup.valid) {
      this.authService.login(this.formGroup.get('dsLogin').value, this.formGroup.get('dssenha').value).subscribe(result => {
        this.spinner.hide();
        if (result != null) {
          this.globalVars.usuarioLogado = result;
          this.globalVars.setToken(result.senha);

          this.authService.setIsLoggedIn();

          this.snotifyService.success('Seja bem-vindo!');
        } else {
          this.snotifyService.error('Usuário ou senha Inválidos!');
          console.log('Erro', 'Usuário ou senha Inválidos');
        } 

      }, error => {
        this.spinner.hide();
        this.snotifyService.error('Erro no servidor!, favor entre em contato de um de nossos analistas');
        console.log(error);
      });
    }
    this.formSubmitAttempt = true;
  }

}
