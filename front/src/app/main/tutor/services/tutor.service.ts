import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Tutor } from '../models/tutor';

@Injectable()
export class TutorService {
    constructor(private http: HttpClient) { }

    urlApi = environment.baseUrl + "/tutors";

    private getHeaders() {
        return new HttpHeaders({
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        });
    }

    getTutors() {
        return this.http.get<any>(this.urlApi, { headers: this.getHeaders() })
            .toPromise()
            .then(res => res.tutors as Tutor[]);
    }

    createTutor(tutor: Tutor) {
        return this.http.post<any>(this.urlApi, tutor, { headers: this.getHeaders() });
    }

    updateTutor(tutor: Tutor) {
        return this.http.put<any>(this.urlApi + '/' + tutor.id, tutor, { headers: this.getHeaders() });
    }

    deleteTutor(id: string) {
        return this.http.delete<any>(this.urlApi + '/' + id, { headers: this.getHeaders() });
    }
}