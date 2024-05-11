import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ProductoService } from "../../Services/producto.service";
import { IRequestProduct, RespImgbb, ResponseProduct } from "app/Models/InterfacesProducts";

@Component({
  selector: "app-producto",
  templateUrl: "./producto2.component.html"
})
export class Producto2Component implements OnInit {
  loading: boolean = false;
  rol: string = "";
  productos: ResponseProduct[] = [];
  productosFiltrados: ResponseProduct[] = [];
  producto: IRequestProduct = {
    id: 0,
    nombre: "",
    img: "",
    precio: 0,
    peso: 0,
    stock: 0,
    estado: 1,
    codigo: "",
    categoria: 0
  };
  file: any;

  constructor(
    private prodService: ProductoService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.rol = JSON.parse(localStorage.getItem("rol"));
    this.loadProductosCategoria2();
  }

  loadProductosCategoria2() {
    this.prodService.getProductosCategoria().subscribe((data) => {
      this.productos = data.data;
      this.productosFiltrados = data.data;
      this.actualizarTabla();
    });
  }

  buscarProductos(termino: string) {
    this.productosFiltrados = this.productos.filter(producto =>
      producto.Nombre.toLowerCase().includes(termino.toLowerCase())
    );
    this.actualizarTabla();
  }

  actualizarTabla() {
    const tableBody = document.querySelector('#producto-table tbody');
    tableBody.innerHTML = '';

    this.productosFiltrados.forEach(producto => {
      const row = `
        <tr>
          <td>${producto.ID}</td>
          <td>${producto.Nombre}</td>
          <td><img src="${producto.ImgUrl}" width="120" height="120" class="rounded mx-auto d-block" alt="No se puede mostrar la imágen"></td>
          <td>${producto.Precio}</td>
          <td>${producto.Codigo}</td>
          <td>${producto.Peso}</td>
          <td>${producto.Estado == 1 ? '<span class="badge bg-info">Activo</span>' : '<span class="badge bg-danger">Inactivo</span>'}</td>
          <td>
            <button id="EditarProducto" type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#exampleModalProducto">
              <i class="nc-icon nc-bullet-list-67"></i>
            </button>
            <button id="EliminarProducto" class="btn btn-danger btn-sm">
              <i class="nc-icon nc-simple-remove"></i>
            </button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  }

  GuardarProducto() {
    if (!this.validarProducto()) {
      return;
    }

    if (this.producto.id == 0) {
      // Agregar lógica para guardar un nuevo producto
      if (!this.file) {
        this.showNotification("top", "center", 4, "Ingrese un archivo ");
        return;
      }

      this.prodService.uploadImage(this.file).subscribe(
        (data: RespImgbb) => {
          this.producto.img = data.data.url;

          this.SaveProduct(this.producto);
          this.file = undefined;
        },
        (err) => {
          console.log(err);
          this.showNotification(
            "top",
            "center",
            4,
            "Ocurrio un error al subir la imagen, intente mas tarde "
          );
        }
      );
    } else {
      // Agregar lógica para actualizar un producto existente
      if (this.file) {
        this.prodService.uploadImage(this.file).subscribe(
          (data: RespImgbb) => {
            this.producto.img = data.data.url;
            this.editarP();
            this.file = undefined;
          },
          (err) => {
            console.log(err);
            this.showNotification(
              "top",
              "center",
              4,
              "Ocurrio un error al subir la imagen, intente mas tarde "
            );
          }
        );
      } else {
        this.editarP();
      }
    }
    console.log("Precio después de la edición y antes de la subida:", this.producto.precio);
  }
  SaveProduct(producto: IRequestProduct) {
    throw new Error("Method not implemented.");
  }
  editarP() {
    throw new Error("Method not implemented.");
  }


  validarProducto() {
    if (this.producto.nombre.length < 3) {
      this.showNotification("top", "center", 1, "Ingrese el nombre ");
      return false;
    }

    if (this.producto.precio <= 0) {
      this.showNotification("top", "center", 1, "Ingrese el precio ");
      return false;
    }

    if (this.producto.peso <= 0) {
      this.showNotification("top", "center", 1, "Ingrese el costo ");
      return false;
    }

    if (this.producto.stock <= 0) {
      this.showNotification("top", "center", 1, "Ingrese el stock ");
      return false;
    }

    if (this.producto.categoria <= 0) {
      this.showNotification("top", "center", 1, "Ingrese la categoria ");
      return false;
    }

    return true;
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
