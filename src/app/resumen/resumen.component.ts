import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { RequerimientosService } from '../services/requerimientos.service';
import { LoginService } from '../services/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {

  datos: any = [];
  accion: any;
  token: any;
  Autorizacion = {};
  id_auto: any;
  disabled: boolean;
  autorizado: boolean;
  estado: any;
  autorizaciones: object = [];
  autorizar = true;
  identificacion_supervisor;
  hora_salida;
  deshabilitarConfirmar;
  loading2;
  loading1;
  size: number;
  num: number;
  nombre_tab2;

  checked = new FormControl('');

  checkform = new FormGroup({
    check : new FormControl('')
  });
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public snackBar: MatSnackBar, public requerimiento: RequerimientosService, public login: LoginService, public dialogRef: MatDialogRef<ResumenComponent>) {



  }


  ngOnInit() {
    if ( this.data.accion == 4) {
      this.nombre_tab2 = 'Datos';
    } else {
      this.nombre_tab2 = 'Materiales';
    }


    if (this.data.identificacion_supervisor == null) {
      this.identificacion_supervisor = false;
    } else {
      this.identificacion_supervisor = true;
    }

    if (this.data.fecha_salida != null) {
      this.hora_salida = this.data.fecha_salida.split(' ');
      console.log(this.hora_salida);
    }


    this.autorizado = false;
    console.log(this.data.accion);
    this.token = this.login.getToken();
    if (this.data.accion == 1) {
    this.requerimiento.getAutho(this.data.id_salida, this.data.id_user, this.token).subscribe(res => {

      console.log(res[0], 'Aqui veo todos los datos de la Autprizacion')
      // console.log(this.Autorizacion);
      this.id_auto = res[0]['id'];
      this.estado = res[0]['estado'];
      console.log(this.id_auto, 'aqui imprimo lo que da el error');
    });

  }

    this.requerimiento.mostrarMaterialesSalida(this.data.id_salida, this.login.getToken()).subscribe(res => {
      console.log(res);
      this.datos = res;
    });

    this.requerimiento.getAuthFromRequerimiento(this.data.id_salida, this.token).subscribe(res => {
      this.autorizaciones = res;



      this.size = Object.keys(this.autorizaciones).length;
      console.log('tamaño del arreglo de autorizaciones', this.size);

      for (let i = 0; i < this.size; i++) {
        if (this.autorizaciones[i]['estado'] != 1) {
          this.autorizar = false;
          break;
        } else {
          this.num += 1;
        }
      }

      console.log('puedo autorizar esta salida ? :', this.autorizar);


      console.log('Autorizaciones de esta salida', this.autorizaciones, 'id de salida', this.data.id_salida);
    });

  }

  onNoClick(): void {
    this.size = 0;
    this.num = 0;
    this.dialogRef.close();
  }

  addAuto() {

    this.loading1 = true;
    this.requerimiento.updateStateAuth(this.id_auto, 1, this.token).subscribe(res => {
      this.autorizado = true;
      console.log(res);
      this.loading1 = false;
      this.openSnackBar('Autorizado con exito');
    });
  }

  openSnackBar(msj) {
    this.snackBar.open(msj, null, {
      duration: 2000
    });
  }

  getStyle(estado) {
    if (estado == 1) {
      return '#A9F5A9'
    }
  }

  confirmar_control_acceso() {
    const hora = moment().format('LTS');

    if (this.checkform.get('check').value) {
      if(this.data.accion != 4){
      if (this.num === this.size){
        this.loading2 = true;
        this.requerimiento.confirmar_control_acceso(this.data.id_salida, this.data.identificacion,
          this.data.nombre_logueo, this.token).subscribe(res => {
          this.openSnackBar('¡Autorizado con exito!');
          this.deshabilitarConfirmar = true;
          this.loading2 = false;
        });
      } else {
        alert('Al parecer no ha sido autorizada por todos.')
      }
      } else {
        this.loading2 = true;
        this.requerimiento.updateRetorno(this.data.id_material, 1, hora, this.data.nombre_logueo, this.login.getToken() ).subscribe(res => {
          this.openSnackBar('¡Devuelto con exito!');
          this.deshabilitarConfirmar = true;
          this.loading2 = false;
        });
      }
    } else {
      this.openSnackBar('Autorice primero!');
    }
  }


}
