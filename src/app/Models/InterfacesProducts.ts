export interface ResponseProduct {
    ID?: number;
    Nombre?: string;
    ImgUrl?: string;
    Precio?: number;
    Peso?: number;
    Stock?: number;
    Estado?: number;
    Codigo?: string;
    ID_CAT?: number;
    Created?: Date;
    Updated?: Date;
    ContActualizacion?: number;

}

export interface IRespProduct {
    data: ResponseProduct[];
    msg: string;
    status: number;
}

export interface IRequestProduct {
    id?: number
    nombre?: string
    img?: string
    precio?: number
    peso?: number
    stock?: number
    estado?: number
    codigo?: string
    categoria?: number
  }

  export interface Image {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
}

export interface Thumb {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
}

export interface Root {
    ID?: number
    Nombre?: string
    ImgUrl?: string
    Precio?: number
    Peso?: number
    Stock?: number
    Estado?: number
    Codigo?: string
    ID_CAT?: number
    Created?: Date;
    Updated?: Date;
    ContActualizacion?: number;
  }

export interface Data {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    image: Image;
    thumb: Thumb;
    delete_url: string;
}

export interface RespImgbb {
    data: Data;
    success: boolean;
    status: number;
}

