import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Agendamento } from '../models/agendamento';

@Injectable()
export class AgendamentoService {
    constructor(private http: HttpClient) { }

    urlApi = environment.baseUrl + "/agendamentos";

    private getHeaders() {
        return new HttpHeaders({
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        });
    }

    getAgendamentos() {
        return this.http.get<any>(this.urlApi, { headers: this.getHeaders() })
            .toPromise()
            .then(res => res.agendamentos as Agendamento[]);
    }

    createAgendamento(agendamento: Agendamento) {
        return this.http.post<any>(this.urlApi, agendamento, { headers: this.getHeaders() });
    }

    updateAgendamento(agendamento: Agendamento) {
        return this.http.put<any>(this.urlApi + '/' + agendamento.id, agendamento, { headers: this.getHeaders() });
    }

    deleteAgendamento(id: string) {
        return this.http.delete<any>(this.urlApi + '/' + id, { headers: this.getHeaders() });
    }
}