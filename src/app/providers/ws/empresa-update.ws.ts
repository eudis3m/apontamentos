import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentService} from '../environment/environment.service';
import {Observable} from 'rxjs';
import {Empresa} from './../../model/empresa';
import { BaseEntityWS } from './base-entity.ws';

@Injectable()
export class UpdateEmpresaWS extends BaseEntityWS<Empresa> {

    constructor(private httpClient: HttpClient, private env: EnvironmentService) {
        super(httpClient, env.getHostURL() + '/update-empresa');
    }
    public findByEmpresa(oid: number): Observable<Empresa[]> {
        debugger
        return this.httpClient.get<Empresa[]>(this.env.getHostURL() + '/update-empresa' + '/oid');
      }
}