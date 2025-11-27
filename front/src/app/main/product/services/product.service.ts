import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ProductService {
    constructor(private http: HttpClient) { }

    private getHeaders() {
        return new HttpHeaders({
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        });
    }

    // Ajuste aqui se sua rota no back-end for diferente (ex: /produtos)
    urlApi = environment.baseUrl + "/products";

    getProducts() {
        return this.http.get<any>(this.urlApi, { headers: this.getHeaders() })
            .toPromise()
            .then(res => res.products as Product[]); 
            // OBS: No seu back-end de products você retornou { products: [...] }, por isso o res.products
    }

    createProduct(product: Product) {
        return this.http.post<any>(this.urlApi, product, { headers: this.getHeaders() });
    }

    updateProduct(product: Product) {
        return this.http.put<any>(this.urlApi + '/' + product.id, product, { headers: this.getHeaders() });
    }

    deleteProduct(id: number) {
        return this.http.delete<any>(this.urlApi + '/' + id, { headers: this.getHeaders() });
    }
}