import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pet } from '../models/pet';
import { environment } from '../../../../environments/environment';

@Injectable()
export class PetService {
    constructor(private http: HttpClient) { }

    // Pega o token do localStorage para autorizar as requisições
    /* OBS: Se você já tiver um interceptor funcionando, esse header pode ser redundante,
       mas deixarei aqui para garantir que funcione agora. */
    private getHeaders() {
        return new HttpHeaders({
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        });
    }

    urlApi = environment.baseUrl + "/pets";

    getPets() {
        return this.http.get<any>(this.urlApi, { headers: this.getHeaders() })
            .toPromise()
            .then(res => res.pets as Pet[]);
    }
    
    getPetsByTutor(tutorId: number) {
        return this.http.get<any>(this.urlApi + '/tutor/' + tutorId, {headers: this.getHeaders()})
            .toPromise()
            .then(res => res.pets as Pet[]);
    }

    createPet(pet: Pet) {
        return this.http.post<any>(this.urlApi, pet, { headers: this.getHeaders() });
    }

    updatePet(pet: Pet) {
        return this.http.put<any>(this.urlApi + '/' + pet.id, pet, { headers: this.getHeaders() });
    }

    deletePet(id: string) {
        return this.http.delete<any>(this.urlApi + '/' + id, { headers: this.getHeaders() });
    }
}