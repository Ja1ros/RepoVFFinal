import { Component, OnInit } from "@angular/core";
import { UsuariosService } from "app/Services/usuarios.service";
import { ResponseUser, UserRequest } from "../../Models/InterfacesUsuario";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrls: ["./usuario.component.scss"],
})
export class UsuarioComponent implements OnInit {
  constructor(
    private userService: UsuariosService,
    private toastr: ToastrService
  ) {}

  usuarios: ResponseUser[] = [];
  rol: string = "";
  usuario: UserRequest = {
    id: 0,
    cedula: "",
    username: "",
    password: "",
    nombres: "",
    estado: 1,
  };

  ngOnInit(): void {
    this.rol = JSON.parse(localStorage.getItem("rol"));
    this.getUsuarios();
  }

  getUsuarios() {
    this.userService.getUsuarios().subscribe((resp) => {
      this.usuarios = resp.data;
    });
  }

  validarUsuario(): boolean {
    let isValid = true;
  
    if (this.usuario.cedula.length < 10) {
      this.showNotification("top", "center", 3, "La Cédula debe tener 10 dígitos");
      isValid = false;
    } else if (!this.validarCed(this.usuario.cedula.trim())) {
      this.showNotification("top", "center", 3, "La Cédula no es válida");
      isValid = false;
    } else if (this.usuario.nombres.length < 3) {
      this.showNotification("top", "center", 3, "El nombre debe tener más de 3 caracteres");
      isValid = false;
    } else if (this.usuario.username.length < 4) {
      this.showNotification("top", "center", 3, "Debe ingresar un usuario con al menos 4 caracteres");
      isValid = false;
    }
  
    return isValid;
  }
  

  async GuardarUsuario() {
    if (this.usuario.id == 0) {
      if (!this.validarUsuario()) {
        return;
      }
      try {
        const data = await this.userService.postUsuarios(this.usuario).toPromise();
        this.showNotification("top", "center", 2, data.msg);
        this.getUsuarios();
        this.resetUsuario();
      } catch (err) {
        this.handleError(err);
      }
    } else {
      try {
        const data = await this.userService.putUsuarios(this.usuario).toPromise();
        this.showNotification("top", "center", 2, data.msg);
        this.getUsuarios();
        this.resetUsuario();
      } catch (err) {
        this.handleError(err);
      }
    }
  }

  resetUsuario() {
    this.usuario = {
      id: 0,
      cedula: "",
      username: "",
      password: "",
      nombres: "",
      estado: 1,
    };
  }

  validarCed(ced: string): boolean {
    // Eliminar espacios en blanco y guiones si los hay
    ced = ced.replace(/\s/g, "").replace(/-/g, "");
  
    // Verificar si la cédula tiene exactamente 10 dígitos
    if (ced.length !== 10) {
      return false;
    }
  
    // Verificar si todos los caracteres son dígitos
    if (!/^\d+$/.test(ced)) {
      return false;
    }
  
    // Si pasa todas las validaciones, retornar true
    return true;
  }
  

  Editar(usuario: ResponseUser) {
    this.usuario.id = usuario.ID;
    this.usuario.username = usuario.UserName;
    this.usuario.cedula = usuario.Cedula;
    this.usuario.nombres = usuario.Nombres;
    this.usuario.estado = 1;
  }

  async EliminarUsuario(usuario: ResponseUser) {
    this.usuario.id = usuario.ID;
    this.usuario.nombres = usuario.Nombres;
    this.usuario.username = usuario.UserName;
    this.usuario.cedula = usuario.Cedula;
    this.usuario.estado = 0;
    try {
      const data = await this.userService.putUsuarios(this.usuario).toPromise();
      this.showNotification("top", "center", 2, data.msg);
      this.getUsuarios();
      this.resetUsuario();
    } catch (err) {
      this.handleError(err);
    }
  }

  showNotification(from, align, color, message) {
    // Implementar la lógica para mostrar notificaciones según tus criterios
  }

  handleError(err) {
    // Implementar la lógica para manejar errores según tus criterios
  }
}
