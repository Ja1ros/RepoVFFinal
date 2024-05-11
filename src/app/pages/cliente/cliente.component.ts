import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ClienteService } from "../../Services/cliente.service";
import { ToastrService } from "ngx-toastr";
import { IRespCliente,ICliente,ClienteRequest } from "../../Models/InterfacesClients";
import { IResp } from "app/Models/Interfaces";

@Component({
  selector: "app-cliente",
  templateUrl: "./cliente.component.html",
  styleUrls: ["./cliente.component.scss"],
})
export class ClienteComponent implements OnInit {
  constructor(
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {}

  loading: boolean = false;

  clientes: ICliente[] = [];
  filteredClientes: ICliente[] = [];
  totalPages: number = 0;
  pages: number[] = [];
  rol: string = "";
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  cliente: ClienteRequest = {
    id: 0,
    cedula: "",
    nombres: "",
    apellidos: "",
    estado: 1,
    email: "",
    pass: "",
  };

  @ViewChild("exampleModal") modal: any;
  @ViewChild("closeModal") closeModal: ElementRef;
  @ViewChild("closeEditar") closeModalEditar: ElementRef;
  @ViewChild("Editar") editar: ElementRef;
  @ViewChild('paginationNav') paginationNav: ElementRef;

  async ngOnInit() {
    this.rol = JSON.parse(localStorage.getItem("rol"));
    await this.getClientes();

    this.totalPages = Math.ceil(this.clientes.length / this.itemsPerPage);

    // Generar las páginas
    this.generatePages();
  }

  generatePages() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  getClientes() {
    this.clienteService.getClientes().subscribe((data) => {
      this.clientes = data.data;
      this.filterClientesByPage();
    }, error => {
      console.error("Error al cargar clientes:", error);
      this.toastr.error("Error al cargar clientes");
    });
  }
  filterClientesByPage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredClientes = this.clientes.slice(startIndex, endIndex);
  }

  buscarClientes() {
    const searchTermLowerCase = this.searchTerm.trim().toLowerCase();
    this.filteredClientes = this.clientes.filter(cliente =>
      cliente.Nombres.toLowerCase().includes(searchTermLowerCase) ||
      cliente.Apellidos.toLowerCase().includes(searchTermLowerCase) ||
      cliente.CedRuc.toLowerCase().includes(searchTermLowerCase)
    );
    this.currentPage = 1; // Restablecer la página actual después de la búsqueda
  }

  EditarCliente(cliente: ICliente) {
    this.cliente.id = cliente.ID;
    this.cliente.cedula = cliente.CedRuc;
    this.cliente.nombres = cliente.Nombres;
    this.cliente.apellidos = cliente.Apellidos;
    this.cliente.email = cliente.Correo;
  }

  Editar() {
    // if (!this.validarClienteEditar()) {
    //   return;
    // }
    this.cliente.estado = 1;
    this.clienteService.putCliente(this.cliente).subscribe(
      async (data: IRespCliente) => {
        if (data.status == 200) {
          this.showNotification("top", "center", 2, data.msg);
          this.cliente = {
            id: 0,
            cedula: "",
            nombres: "",
            apellidos: "",
            estado: 1,
            email: "",
            pass: "",
          };
         await this.reload();
          this.closeModalEditar.nativeElement.click(); //<-- here
        }
      },
      (err) => {
        if (err["error"].errors != undefined) {
          let msg = "";
          let cant = err["error"].errors.length;
          for (let index = 0; index < cant; index++) {
            const element = err["error"].errors[index];
            if (index + 1 == cant) {
              msg += element.msg;
            } else {
              msg += element.msg + ", ";
            }
          }
          this.showNotification("top", "center", 4, msg);
        } else {
          let er: IResp = err["error"];
          this.showNotification("top", "center", 4, er.msg);
        }
      }
    );
  }

  GuardarCliente() {
    // if (!this.validarCliente()) {
    //   return;
    // }

    this.clienteService.postCliente(this.cliente).subscribe(
      async (data: IRespCliente) => {
        if (data.status == 200) {
          this.showNotification("top","center",2,data.msg);
          this.cliente = {
            id: 0,
            cedula: "",
            nombres: "",
            apellidos: "",
            estado: 1,
            email: "",
            pass: "",
          };
          await this.reload();
          this.closeModalEditar.nativeElement.click();
        }
      },
      (err) => {
        if (err["error"].errors != undefined) {
          let msg = "";
          let cant = err["error"].errors.length;
          for (let index = 0; index < cant; index++) {
            const element = err["error"].errors[index];
            if (index + 1 == cant) {
              msg += element.msg;
            } else {
              msg += element.msg + ", ";
            }
          }
          this.showNotification("top", "center", 4, msg);
        } else {
          let er: IResp = err["error"];
          this.showNotification("top", "center", 4, er.msg);
        }
      }
    );
  }
  async reload() {
    await this.getClientes();
  }

  EliminarCliente(cliente: ICliente) {
    this.cliente.id = cliente.ID;
    this.cliente.cedula = cliente.CedRuc;
    this.cliente.nombres = cliente.Nombres;
    this.cliente.apellidos = cliente.Apellidos;
    this.cliente.email = cliente.Correo;
    this.cliente.pass = cliente.Contra;
    this.cliente.estado = 0;
    this.clienteService.putCliente(this.cliente).subscribe(
      async (data: IRespCliente) => {
        if (data.status == 200) {
          this.cliente = {
            id: 0,
            cedula: "",
            nombres: "",
            apellidos: "",
            estado: 1,
            email: "",
            pass: "",
          };
          await this.reload();
          this.closeModal.nativeElement.click(); //<-- here
          this.showNotification("top", "center", 2, data.msg);
        }
      },
      (err) => {
        console.log(err) 
        if (err["error"].errors != undefined) {
          let msg = "";
          let cant = err["error"].errors.length;
          for (let index = 0; index < cant; index++) {
            const element = err["error"].errors[index];
            if (index + 1 == cant) {
              msg += element.msg;
            } else {
              msg += element.msg + ", ";
            }
          }
          this.showNotification("top", "center", 4, msg);
        } else {
          let er: IResp = err["error"];
          console.log(err["error"])
          this.showNotification("top", "center", 4, er.msg);
        }
      }
    );
  }

  showNotification(from, align, color, message) {
    switch (color) {
      case 1:
        this.toastr.info(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message"> ${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 2:
        this.toastr.success(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 3:
        this.toastr.warning(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message"> ${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-warning alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 4:
        this.toastr.error(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message"> ${message}</span>`,
          "",
          {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 5:
        this.toastr.show(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message"> ${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-primary alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      default:
        break;
    }
  }
}
