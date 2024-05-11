import { Component, OnInit } from "@angular/core";

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTESADM: RouteInfo[] = [
  { path: "/dashboard", title: "Inicio", icon: "nc-bank", class: "" },
  {
    path: "/miperfil",
    title: "Mi Perfil",
    icon: "nc-icon nc-badge",
    class: "",
  },
  { path: "/clientes", title: "Colaboradores", icon: "nc-single-02", class: "" },
  {
    path: "/usuarios",
    title: "Usuarios",
    icon: "nc-icon nc-book-bookmark",
    class: "",
  },
  {
    path: "/productos",
    title: "Productos",
    icon: "nc-icon nc-align-center",
    class: "",
  },
  // {
  //   path: "/productos2",
  //   title: "Carnes",
  //   icon: "nc-icon nc-tag-content",
  //   class: "",
  // },
  {
    path: "/generarCBR",
    title: "Reportes",
    icon: "nc-credit-card",
    class: "",
  },
  
];

export const ROUTESUSUARIO: RouteInfo[] = [
  { path: "/dashboard", title: "Inicio", icon: "nc-bank", class: "" },
  {
    path: "/miperfil",
    title: "Mi Perfil",
    icon: "nc-icon nc-album-2",
    class: "",
  },
  {
    path: "/productos",
    title: "Productos",
    icon: "nc-icon nc-tag-content",
    class: "",
  }
];

// export const ROUTESCLIENTE: RouteInfo[] = [
//   { path: "/dashboard", title: "Inicio", icon: "nc-bank", class: "" },
//   {
//     path: "/generarCBR",
//     title: "Generar Codigo",
//     icon: "nc-tile-56",
//     class: "",
//   }
// ];

@Component({
  moduleId: module.id,
  selector: "sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  ngOnInit() {
    //this.menuItems = ROUTESADM.filter((menuItem) => menuItem); servicio si se quita jwt
    const rol = JSON.parse(localStorage.getItem("rol"));
    switch (rol) {
      case "Admin":
        this.menuItems = ROUTESADM.filter((menuItem) => menuItem);
        break;
      case "Client":
        this.menuItems = ROUTESUSUARIO.filter((menuItem) => menuItem);
        break;
    }
  }
}
