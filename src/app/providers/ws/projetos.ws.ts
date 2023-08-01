import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentService} from '../environment/environment.service';
import {Observable} from 'rxjs';
import {Projetos} from './../../model/projetos';
import {BaseEntityWS} from './base-entity.ws';


@Injectable()
export class ProjetosWS extends BaseEntityWS<Projetos> {
    constructor(private httpClient: HttpClient, private env: EnvironmentService) {
        super(httpClient, env.getHostURL() + '/projeto/');
     
    }

}
