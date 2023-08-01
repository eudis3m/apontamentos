import {Injectable} from '@angular/core';
import {EnvironmentService} from '../environment/environment.service';
import {UsuarioLogado} from '../../model/usuario-logado';

@Injectable()
export class GlobalVars {

 private readonly STORAGE_TOKEN = 'access_token';
  public usuarioLogado: UsuarioLogado | null = null;

  constructor(private env: EnvironmentService) {
  }

  public isUsuarioLogado(): boolean {
    return this.usuarioLogado != null;
  }

  public getUsuarioLogado(): UsuarioLogado {
    return this.usuarioLogado;
  }
  public setUsuarioLogado(login : string){
    return this.usuarioLogado.login = login;
  }
  public getToken(): string | null {
    return localStorage.getItem(this.STORAGE_TOKEN);
  }

  public setToken(token: string) {
    localStorage.setItem(this.STORAGE_TOKEN, token);
  }

  public clearToken() {
    localStorage.removeItem(this.STORAGE_TOKEN);
  }

  public getMensagemErroPadrao(): string {
    return 'Houve um erro de servidor, tente novamente mais tarde.';
  }
}
