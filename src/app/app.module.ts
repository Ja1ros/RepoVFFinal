import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";
import { HttpClientModule } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoComponent } from './pages/producto/producto.component';
import { Producto2Component } from './pages/producto2/producto2.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { UsersComponent } from './users/users.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
// import filepond module
import { FilePondModule, registerPlugin } from 'ngx-filepond';
// import and register filepond file type validation plugin
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm';
import { EditarProductoComponent } from './pages/editar-producto/editar-producto.component';
import { CommonModule } from "@angular/common";

registerPlugin(FilePondPluginFileValidateType);


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    ProductoComponent,
    Producto2Component,
    ClienteComponent,
    UsuarioComponent,
    UsersComponent,
    MiPerfilComponent,
    EditarProductoComponent,
  ],
  imports: [
    NgxPaginationModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes,{
      useHash: false
    }),
    PaginationModule.forRoot(),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FormsModule,
    HttpClientModule,
    FilePondModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
