import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentService} from '../environment/environment.service';
import {Observable} from 'rxjs';
import {TiposAtividades} from '../../model/tipo-atividade';
import {BaseEntityWS} from './base-entity.ws';

@Injectable()
export class TiposAtividadesWS extends BaseEntityWS<TiposAtividades> {

  constructor(private httpClient: HttpClient, private env: EnvironmentService) {
    super(httpClient, env.getHostURL() + '/tipo-atividade/');
  }

}
