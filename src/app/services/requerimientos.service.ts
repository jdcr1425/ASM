import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {LoginService} from './login.service';

@Injectable({
  providedIn: 'root'
})
export class RequerimientosService {
  httpOptions;

  options(token) {
   return this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
        'Authorization': 'Bearer ' + token

      })
    };
  }

  options2(token) {
    return this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'FormData',
        'X-Requested-With' : 'XMLHttpRequest',
        'Authorization': 'Bearer ' + token

      })
    };
  }

  constructor(public http: HttpClient, public login: LoginService) { }

  crearRequerimiento(idusuario, descripcion, motivo_prestamo, fecha_solicitud, proyecto, gerencia, fecha_salida, token) {
    return this.http.post('http://cratos:8095/SMInstalaciones/api/auth/SmInstalaciones',
      {'idusuario': idusuario, 'descripcion': descripcion, 'motivo_prestamo': motivo_prestamo,
        'fecha_solicitud': fecha_solicitud , 'proyecto': proyecto, 'gerencia': gerencia, 'fecha_salida': fecha_salida},
 this.options(token));
  }

  misRequerimientos(token, idusuario) {

    return this.http.post('http://cratos:8095/SMInstalaciones/api/auth/SM_misRequerimientos',
      {'idusuario': idusuario},
      this.options(token));
  }

  misAutorizaciones(idusuario, token){
      return this.http.post('http://cratos:8095/SMInstalaciones/api/auth/SM_misAutorizaciones',
        {'idusuario': idusuario},
        this.options(token));
  }

  agregarMateriales(idsm_instalaciones, nombre_material, descripcion, cantidad, avatar, regresa, fecha_regreso = null, token) {

    return this.http.post('http://cratos:8095/SMInstalaciones/api/auth/SmMaterial',
      {'idsm_instalaciones': idsm_instalaciones, 'nombre_material': nombre_material,
       'descripcion': descripcion, 'cantidad': cantidad, 'avatar': avatar, 'regresa': regresa,
       'fecha_regreso': fecha_regreso},
      this.options(token));

  }

  mostrarMaterialesSalida(idsm_instalaciones, token) {
    return this.http.post('http://cratos:8095/SMInstalaciones/api/auth/SMMaterial_indexIdSMI',
      {'idsm_instalaciones': idsm_instalaciones},
      this.options(token));

  }

  getAutorizadores(token) {

    return this.http.get('http://cratos:8095/SMInstalaciones/api/auth/SmUsuario', this.options(token));
  }

  addAutho(idusuario, idsm_instalaciones, identificacion, nombres_apellidos, cargo, estado, token) {
  return this.http.post('http://cratos:8095/SMInstalaciones/api/auth/SmAutorizacion',{'idusuario': idusuario, 'idsm_instalaciones': idsm_instalaciones,
  'identificacion': identificacion, 'nombres_apellidos': nombres_apellidos, 'cargo': cargo, 'estado': estado}, this.options(token));
  }

  todosUsers(token){
    return this.http.get('http://cratos:8095/SMInstalaciones/api/auth/userall', this.options(token));
  }

  getAutho(idsm_instalaciones, idusuario, token) {
    return this.http.post('http://cratos:8095/SMInstalaciones/api/auth/SMAutorizacion_Idusuario_IdsmInstalaciones ',
      {'idsm_instalaciones': idsm_instalaciones,
             'idusuario': idusuario},
      this.options(token));
  }

  updateStateAuth(id, estado, token) {
    return this.http.put('http://cratos:8095/SMInstalaciones/api/auth/SMAutorizacion_updateId ',{id: id, estado: estado}, this.options(token));
  }

  getAuthFromRequerimiento(idsm_instalaciones, token){
    return this.http.post('http://cratos:8095/SMInstalaciones/api/auth/SMAutorizacion_IdSMI',
      {'idsm_instalaciones': idsm_instalaciones},
      this.options(token));
  }

  TodosLosRequerimientos(token) {
    return this.http.get('http://cratos:8095/SMInstalaciones/api/auth/SmInstalaciones', this.options(token));
  }

  confirmar_control_acceso(id_instalacion, identificacion_control_acceso, nombre_control_acceso, token){
    return this.http.put('http://cratos:8095/SMInstalaciones/api/auth/SM_salidaMaterial', {id: id_instalacion, identificacion_supervisor: identificacion_control_acceso, nombresapellidos_supervisor: nombre_control_acceso }, this.options(token));
  }

  updateAvatar(id, avatar, token) {

    /*const formData = new FormData();
    formData.append('id', id);
    formData.append('avatar', avatar);*/

    return this.http.post('http://cratos:8095/SMInstalaciones/api/auth/SMMaterial_Avatar',
      {'id': id, 'avatar': avatar}, this.options(token));
  }

  deleteInstalacion(id, token) {
    return this.http.post('http://cratos:8095/SMInstalaciones/api/auth/SM_destroyId' , {'id': id} , this.options(token));
  }

  retornos(token){
    return this.http.get('http://cratos:8095/SMInstalaciones/api/auth/SmMaterial', this.options(token));
  }

  updateRetorno(id, devolucion, fecha_devolucion, supervisor, token) {

    return this.http.put('http://cratos:8095/SMInstalaciones/api/auth/SMMaterial_Devolucion',
      {'id': id, 'devolucion': devolucion, 'fecha_devolucion': fecha_devolucion, 'supervisor': supervisor}, this.options(token) );
  }


}
