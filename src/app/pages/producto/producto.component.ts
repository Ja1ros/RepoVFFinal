import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ProductoService } from "../../Services/producto.service";
import * as filepond from "filepond";
import { IRequestProduct, RespImgbb, ResponseProduct } from "app/Models/InterfacesProducts";
import { IRespProduct } from "../../Models/InterfacesProducts";
import { IResp } from "app/Models/Interfaces";
import { NgForm } from '@angular/forms';


@Component({
  selector: "app-producto",
  templateUrl: "./producto.component.html"
})
export class ProductoComponent implements OnInit {
  loading: boolean = false;
  filteredProductos: ResponseProduct[] = [];
  constructor(
    private prodService: ProductoService,
    private toastr: ToastrService,
  ) { }

  totalPages: number = 0;
  pages: number[] = [];

  rol: string = "";
  productos: ResponseProduct[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  producto: IRequestProduct = {
    id: 0,
    nombre: "",
    img: "",
    precio: 0,
    peso: 1,
    stock: 1,
    estado: 1,
    codigo: "",
    categoria: 1
  };

  @ViewChild("closeModalProducto") closeModal: ElementRef;
  @ViewChild('paginationNav') paginationNav: ElementRef;

  ngOnInit(): void {
    this.rol = JSON.parse(localStorage.getItem("rol"));
    this.loadProductos();

    this.totalPages = Math.ceil(this.productos.length / this.itemsPerPage);

    // Generar las páginas
    this.generatePages();
  }
  generatePages() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  loadProductos() {
    this.prodService.getProductos().subscribe((data) => {
      this.productos = data.data;
      this.filteredProductos = this.productos.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    });
  }

  filterProductsByPage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredProductos = this.productos.slice(startIndex, endIndex);
  }

  buscarProductos() {
    const searchTermLowerCase = this.searchTerm.trim().toLowerCase();
    this.filteredProductos = this.productos.filter(producto =>
      producto.Nombre.toLowerCase().includes(searchTermLowerCase)
    );
  }

  onCodigoKeyDown(event: KeyboardEvent) {
    const keyCode = event.keyCode;
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 8 && keyCode !== 9 && keyCode !== 37 && keyCode !== 39) {
      event.preventDefault();
    }
  }

  validarCodigo() {
    const codigoRegex = /^[0-9]+$/; // Expresión regular para permitir solo números

    if (!codigoRegex.test(this.producto.codigo)) {
      this.showNotification("top", "center", 1, "Ingrese un código válido (solo números)");
      return false;
    }
    return true;
  }

  validarProducto() {
    if (this.producto.nombre.length < 3) {
      this.showNotification("top", "center", 1, "Ingrese el nombre ");
      return false;
    }

    if (!this.validarCodigo()) {
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

    if (this.producto.categoria <= 0) {
      this.showNotification("top", "center", 1, "Ingrese la categoria ");
      return false;
    }

    return true;
  }

  selectCategoria(categoriaId: number) {
    this.producto.categoria = categoriaId;
  }

  GuardarProducto() {
    this.loading = true;

    if (!this.validarProducto()) {
      return;
    }

    if (this.producto.id == 0) {
      if (!this.file) {
        this.showNotification("top", "center", 4, "Ingrese un archivo ");
        return;
      }

      this.prodService.uploadImage(this.file).subscribe(
        (data: RespImgbb) => {
          this.producto.img = data.data.url;
          this.SaveProduct(this.producto);
          this.file = undefined;
          this.loading = false;
        },
        (err) => {
          console.log(err);
          this.showNotification(
            "top",
            "center",
            4,
            "Ocurrio un error al subir la imagen, intente mas tarde "
          );
          this.loading = false;
        }
      );
    } else {
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
  }

  SaveProduct(producto: IRequestProduct) {
    this.prodService.postProducto(producto).subscribe(
      async (data: IRespProduct) => {
        this.producto = {
          id: 0,
          nombre: "",
          img: "",
          precio: 0,
          peso: 1,
          stock: 1,
          estado: 1,
          codigo: "",
          categoria: 1,
        };
        await this.reload();
        this.closeModal.nativeElement.click();
        this.showNotification("top", "center", 2, data.msg)
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

  @ViewChild("myPond") myPond: any;

  pondOptions = {
    class: "my-filepond",
    multiple: false,
    labelIdle: "Ingrese su archivo aqui...",
    acceptedFileTypes: "image/jpeg, image/png",
  };

  pondFiles: filepond.FilePondOptions["files"] = [];

  pondHandleInit() {
    console.log("FilePond has initialised", this.myPond);
  }

  file: any;
  pondHandleAddFile(event: any) {
    console.log("A file was added", event);
    this.file = event.file.file;
  }

  pondHandleActivateFile(event: any) {
    console.log("A file was activated", event);
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
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">${message}</span>`,
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
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      default:
        break;
    }
  }

  EditarProducto(producto: ResponseProduct) {
    // Establecer los datos del producto seleccionado en el formulario de edición
    this.producto.id = producto.ID;
    this.producto.nombre = producto.Nombre;
    this.producto.precio = producto.Precio;
    this.producto.peso = producto.Peso;
    this.producto.img = producto.ImgUrl;
    this.producto.stock = producto.Stock;
    this.producto.estado = 1;
    this.producto.codigo = producto.Codigo;
    this.producto.categoria = producto.ID_CAT;

    // Mostrar el formulario de edición al usuario

    // Al hacer clic en "Guardar" en el formulario de edición, llamar a la función editarP()
  }

  EliminarProducto(producto: ResponseProduct) {
    this.producto.id = producto.ID;
    this.producto.nombre = producto.Nombre;
    this.producto.precio = producto.Precio;
    this.producto.peso = producto.Peso;
    this.producto.img = producto.ImgUrl;
    this.producto.stock = producto.Stock;
    this.producto.estado = 0;
    this.producto.codigo = producto.Codigo;
    this.producto.categoria = producto.ID_CAT;

    this.prodService.putProducto(this.producto).subscribe(
      async (data: IRespProduct) => {
        if (data.status == 200) {
          this.producto = {
            id: 0,
            nombre: "",
            img: "",
            precio: 0,
            peso: 0,
            stock: 1,
            estado: 1,
            codigo: "",
            categoria: 0,
          };
          await this.reload();
          //this.closeModal.nativeElement.click(); //<-- here
          this.showNotification("top", "center", 2, data.msg);
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
          let er: IRespProduct = err["error"];
          this.showNotification("top", "center", 4, er.msg);
        }
      }
    );
  }

  editarP() {
    // Verificar que los datos del producto sean válidos antes de enviarlos al servidor
    if (!this.validarProducto()) {
      return;
    }

    // Enviar los datos actualizados del producto al servidor
    this.prodService.putProducto(this.producto).subscribe(
      async (data: IRespProduct) => {
        if (data.status === 200) {
          // Limpiar el formulario después de editar el producto
          this.producto = {
            id: 0,
            nombre: "",
            img: "",
            precio: 0,
            peso: 1,
            stock: 1,
            estado: 1,
            codigo: "",
            categoria: 1,
          };
          // Recargar la lista de productos después de editar uno
          await this.loadProductos();
          // Cerrar el formulario de edición
          this.closeModal.nativeElement.click();
          this.showNotification("top", "center", 2, data.msg);
        }
      },
      (err) => {
        // Manejar errores en caso de que ocurran
        console.error(err);
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
          let er: IRespProduct = err["error"];
          this.showNotification("top", "center", 4, er.msg);
        }
      }
    );
  }


  async reload() {
    await this.loadProductos();
  }
}
