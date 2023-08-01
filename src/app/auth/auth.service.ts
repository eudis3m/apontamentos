import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from './user';
import {HttpClient} from '@angular/common/http';
import {EnvironmentService} from '../providers/environment/environment.service';
import {GlobalVars} from '../providers/utils/global-vars';
import {UsuarioLogado} from '../model/usuario-logado';

@Injectable()
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(localStorage.getItem('access_token') != null);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  public setIsLoggedIn() {
    this.loggedIn.next(true);
    this.router.navigate(['/']);
  }

  constructor(
    private router: Router,
    private globalVars: GlobalVars,
    private env: EnvironmentService,
    private httpClient: HttpClient
  ) {}

  login(dslogin : string, dssenha): Observable<UsuarioLogado> {
      return this.httpClient.post<UsuarioLogado>(
          this.env.getHostURL() + '/login',
        {login: dslogin, senha: dssenha});
  }

 logout() {
    this.globalVars.clearToken();
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

}
