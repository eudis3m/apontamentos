import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentService} from '../environment/environment.service';
import {Observable} from 'rxjs';
import {Empresa} from '../../model/empresa';
import { BaseEntityWS } from './base-entity.ws';

@Injectable()
export class UpdateWS extends BaseEntityWS<Empresa> {
    constructor(private httpClient: HttpClient, private env: EnvironmentService) {
        super(httpClient, env.getHostURL() + '/update-empresa');
    }

    
}
