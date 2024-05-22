import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICliente, IRespCliente } from 'app/Models/InterfacesClients';
import { environment } from 'environments/environment.prod';
import { ClienteRequest } from '../Models/InterfacesClients';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http:HttpClient) { }

  URL = environment.API;
  opt = this.createRequestOptions();

  getClientes(){
    return this.http.get<IRespCliente>(this.URL + 'clients', {
      headers: this.opt,
    });
  }

  // getClientesFac(){
  //   return this.http.get<IRespCliente>(this.URL + 'clients/Fac', {
  //     headers: this.opt,
  //   });
  // }

  postCliente(cliente:ClienteRequest){
    return this.http.post<IRespCliente>(this.URL + 'clients', cliente, {
      headers: this.opt,
    });
  }

  putCliente(cliente:ClienteRequest){
    return this.http.put<IRespCliente>(this.URL + 'clients', cliente, {
      headers: this.opt,
    });
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
