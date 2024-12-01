import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from './product-interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly apiUrl = 'https://fakestoreapi.com/products/';

  constructor(private readonly http: HttpClient) {}

  addNewProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, product);
  }

  updateProduct(id: number, product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, product);
  }


  deleteProductById(id: number): Observable<any> {
    return new Observable(observer => {
      fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(json => {
          observer.next(json);
          observer.complete();
        })
        .catch(err => observer.error(err));
    });
  }

  getSingleProduct(id: number): Observable<any> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  getAllProducts(): Observable<any> {
    return this.http.get<IProduct[]>(this.apiUrl);
  }
}
