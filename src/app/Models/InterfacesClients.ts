export interface IRespCliente {
    data?: ICliente[]
    msg?: string
    status?: number
  }
  
  export interface ICliente {
    ID?: number
    CedRuc?: string
    Nombres?: string
    Apellidos?: string
    Estado?: number
    Correo?: string
    Contra?: string
  }


  export interface ClienteRequest {
    id?:number;
    cedula?: string;
    nombres?: string;
    apellidos?: string;
    pass?: string;
    estado?: number;
    email?: string;
}