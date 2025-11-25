import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Service } from '../models/service';

@Injectable()
export class ServiceService {
    constructor(private http: HttpClient) { }

    urlApi = environment.baseUrl + "/services";

    private getHeaders() {
        return new HttpHeaders({
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        });
    }

    getServices() {
        return this.http.get<any>(this.urlApi, { headers: this.getHeaders() })
            .toPromise()
            .then(res => res.services as Service[]);
    }

    createService(service: Service) {
        return this.http.post<any>(this.urlApi, service, { headers: this.getHeaders() });
    }

    updateService(service: Service) {
        return this.http.put<any>(this.urlApi + '/' + service.id, service, { headers: this.getHeaders() });
    }

    deleteService(id: string) {
        return this.http.delete<any>(this.urlApi + '/' + id, { headers: this.getHeaders() });
    }
}