import { Injectable } from '@angular/core';
import {Usuario} from '../app/modelos/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  listadeusuarios: Usuario[] = [];

  constructor() { }

  addUser(usr: Usuario) {
    this.listadeusuarios.push(usr);
  }

  removeUsuario(id: number) {
    const  usuario = this.listadeusuarios.findIndex(c => c.ID === id);
    this.listadeusuarios.splice(usuario, 1);
  }

  getAllUsuarios() {
    return this.listadeusuarios;
  }
}
