import { EnvironmentService } from './../environment/environment.service';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseEntityWS } from './base-entity.ws';
import { Apontamentos } from '../../model/apontamentos';

@Injectable()
export class ApontamentosWS extends BaseEntityWS<Apontamentos> {

    constructor(private httpClient: HttpClient, private env: EnvironmentService) {
        super(httpClient, env.getHostURL() + '/apontamentos/');
    }

    public findByNmrecursos(nmRecursos: string, nrhorasAtividade: number): Observable<Apontamentos[]> {
        return this.httpClient.get<Apontamentos[]>(this.env.getHostURL() + '/apontamentos/nmRecursos/' + nmRecursos +'/'+ nrhorasAtividade);
      }
}
