import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../utilities/environment';
import { Observable } from 'rxjs';
import { GuardarReclamoRequest } from '../models/request/GuardarReclamoRequest';
import { ResponseData } from '../models/common/ResponseData';
import { ClienteModel } from '../models/interface/ClienteModel';
import { ReclamoModel } from '../models/interface/ReclamoModel';

@Injectable({
  providedIn: 'root',
})
export class ReclamoService {
    private http = inject(HttpClient);
  private apiUrl = environment.appfield;
 private cliente = environment.services.cliente;
 consultarCliente(identificacion: string): Observable<ResponseData<ClienteModel>> {
  return this.http.get<ResponseData<ClienteModel>>(
      `${this.apiUrl+this.cliente.buscarCliente}${identificacion}`
    );
  }

  guardarReclamo(payload: GuardarReclamoRequest): Observable<ResponseData<ReclamoModel>> {

    return this.http.post<ResponseData<ReclamoModel>>(
      `${this.apiUrl+this.cliente.guardarReclamo}`,
      payload
    );
  }
  
}
