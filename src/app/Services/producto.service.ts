import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRequestProduct, IRespProduct } from 'app/Models/InterfacesProducts';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  deleteProducto(id: number): Observable<IRespProduct> {
  return this.http.delete<IRespProduct>(`url/${id}`);
}

  constructor(private http:HttpClient) { }

  URL = environment.API;
  opt = this.createRequestOptions();

  getProductos(){
    return this.http.get<IRespProduct>(this.URL + 'products', {
      headers: this.opt,
    });
  }

  getProductosCategoria(){
    return this.http.get<IRespProduct>(this.URL + 'products/categoria/2', {
      headers: this.opt,
    });
  }

  getProductosFac(){
    return this.http.get<IRespProduct>(this.URL + 'products/Fac', {
      headers: this.opt,
    });
  }

  postProducto(producto:IRequestProduct){
    return this.http.post<IRespProduct>(this.URL + 'products', producto, {
      headers: this.opt,
    });
  }

  putProducto(producto:IRequestProduct){
    return this.http.put<IRespProduct>(this.URL + 'products', producto, {
      headers: this.opt,
    });
  }  

  uploadImage(file:any){
    const formData = new FormData();
    console.log(file)
    formData.append('image', file)
    return this.http.post('https://api.imgbb.com/1/upload?key=5ce77e0698e3e45d85a2262bed67554e',formData )
  }



  private createRequestOptions() {
    let token =JSON.parse(localStorage.getItem("token"));
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      'x-token': token,
    });
    return headers;
  }
}
