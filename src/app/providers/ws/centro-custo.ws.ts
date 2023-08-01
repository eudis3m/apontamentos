import { EnvironmentService } from './../environment/environment.service';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseEntityWS } from './base-entity.ws';
import { CentroCusto } from '../../model/centro-custo';

@Injectable()
export class CentroCustoWS extends BaseEntityWS<CentroCusto> {

    constructor(private httpClient: HttpClient, private env: EnvironmentService) {
        super(httpClient, env.getHostURL() + '/centro-custo/');
    }

 
    public findByCustoAprovado(vrcustoAprovado: number): Observable<CentroCusto> {
        return this.httpClient.get<CentroCusto>(this.env.getHostURL() +'/centro-custo/'+vrcustoAprovado );
      }
}
