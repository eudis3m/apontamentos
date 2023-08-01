import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentService} from '../environment/environment.service';
import {Observable} from 'rxjs';
import {Empresa} from './../../model/empresa';
import { BaseEntityWS } from './base-entity.ws';

@Injectable()
export class EmpresaWS extends BaseEntityWS<Empresa> {
  debugger;
    constructor(private httpClient: HttpClient, private env: EnvironmentService) {
        super(httpClient, env.getHostURL() + '/empresa/');
    }

    public findByNmempresa(oid: number): Observable<string[]> {
      debugger;
      return this.httpClient.get<string[]>(this.env.getHostURL() +'/empresa/',
      {params: { oid: oid == null ? '0' : oid.toString()}});
    }
    
}
