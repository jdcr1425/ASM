import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {tokenize} from '@angular/compiler/src/ml_parser/lexer';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

    token: string;
    httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'X-Requested-With' : 'XMLHttpRequest'
    })
  };
  constructor(private hhtp: HttpClient) { }

  guardartoken(token) {
    this.token = token;
    }
    getToken() {
    return this.token;
    }


  PostUserDetails(email, pass) {
    return this.hhtp.post('http://cratos:8095/SMInstalaciones/api/auth/login', {'email': email, 'password': pass}, this.httpOptions );
  }
 NameEMailUser(id, token) {
   this.httpOptions = {
     headers: new HttpHeaders({
       'Content-Type':  'application/json',
       'X-Requested-With' : 'XMLHttpRequest',
       'Authorization': 'Bearer ' + token
     })
   };
    return this.hhtp.post('http://cratos:8095/SMInstalaciones/api/auth/user_Id', {'id': id}, this.httpOptions);
  }
  logout(token) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.hhtp.get('http://cratos:8095/SMInstalaciones/api/auth/logout', this.httpOptions);
  }

  signUp(name, username, password, password_confirmation, token) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.hhtp.post('http://cratos:8095/SMInstalaciones/api/auth/signup',
      {'name': name, 'email': username, 'password': password, 'password_confirmation': password_confirmation}, this.httpOptions);


  }
  getID(token, email) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
        'Authorization': 'Bearer ' + token
      })
    };

    return this.hhtp.post('http://cratos:8095/SMInstalaciones/api/auth/user_Email',
      {'email': email}, this.httpOptions);


  }

  sign_full(iduser, identificacion, tipousuario, cargo, token){
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
        'Authorization': 'Bearer ' + token
      })
    };

    return this.hhtp.post('http://cratos:8095/SMInstalaciones/api/auth/SmUsuario',
      {'iduser': iduser, 'identificacion': identificacion, 'tipousuario': tipousuario, 'cargo': cargo}, this.httpOptions);

  }

  getIdenTipoCargo(iduser, token) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.hhtp.post('http://cratos:8095/SMInstalaciones/api/auth/Usuario_IdUser',
      {'iduser': iduser}, this.httpOptions);
  }



}
