// Arquivo: front/src/app/main/service/services/service.service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http'; // <-- CORREÇÃO 1: Importado HttpHeaders
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; 
import { Service } from '../models/service';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    
    private apiUrl = `${environment.baseUrl}/services`; 

    constructor(private http: HttpClient) { }

    // CORREÇÃO 2: Método para obter os cabeçalhos de autenticação (copiado do TutorService)
    private getHeaders() {
        return new HttpHeaders({
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        });
    }

    // CORREÇÃO 3: Passando os headers para todas as requisições que precisam de autenticação
    getServices(): Observable<any> {
        // Se a rota GET no backend não exige token (como fizemos para teste), você pode remover o headers:
        // return this.http.get<any>(this.apiUrl);
        // Mas se a rota GET exigir autenticação, use:
        return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }); 
    }

    createService(service: Service): Observable<any> {
        return this.http.post<any>(this.apiUrl, service, { headers: this.getHeaders() }); // <-- CORREÇÃO APLICADA
    }

    updateService(id: number, service: Service): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, service, { headers: this.getHeaders() }); // <-- CORREÇÃO APLICADA
    }

    deleteService(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }); // <-- CORREÇÃO APLICADA
    }
}