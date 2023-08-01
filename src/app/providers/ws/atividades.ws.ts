import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentService} from '../environment/environment.service';
import {Observable} from 'rxjs';
import {Atividades} from './../../model/atividades';
import {BaseEntityWS} from './base-entity.ws';


@Injectable()
export class AtividadesWS extends BaseEntityWS<Atividades> {

    constructor(private httpClient: HttpClient, private env: EnvironmentService) {
        super(httpClient, env.getHostURL() + '/atividades/');
    }

    public findByNmrecursos(nmRecursos: string): Observable<Atividades[]> {
        return this.httpClient.get<Atividades[]>(this.env.getHostURL() + '/atividades/nmRecursos/' + nmRecursos);
      }

      public findByNrhorasAtividade(nrhorasAtividade: number): Observable<Atividades[]> {
        return this.httpClient.get<Atividades[]>(this.env.getHostURL() + '/atividades/nrhorasAtividade/' + nrhorasAtividade);
      }
}
