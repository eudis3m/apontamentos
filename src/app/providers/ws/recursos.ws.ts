import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentService} from '../environment/environment.service';
import {Observable} from 'rxjs';
import {Recursos} from '../../model/recursos';
import { BaseEntityWS } from './base-entity.ws';

@Injectable()
export class RecursosWS extends BaseEntityWS<Recursos> {

  constructor(private httpClient: HttpClient, private env: EnvironmentService) {
    super(httpClient, env.getHostURL() + '/recursos/');
}

}
