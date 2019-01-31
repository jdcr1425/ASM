import {Component, Inject, OnInit, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {UsuarioService} from '../../services/usuario.service';
import {LoginService} from '../services/login.service';
import {Regresar} from '../app.component';


export interface TipoUsr {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  hide = true;
  hide2 = true;
  error_pass =  false;
  token: string;
  id_user: string;
  loading;


  cargos = ['AISLADOR 3',
    'ALISTADOR DE MATERIALES',
    'ALMACENISTA HERRAMIENTAS',
    'ANALISTA PLAN, PROG Y CONTROL DE LA PROD',
    'APRENDIZ',
    'AUXILIAR DE SERVICIOS GENERALES',
    'AYUDANTE  MATERIALES COMPUESTOS 2',
    'AYUDANTE  MECANICA 1',
    'AYUDANTE DE PINTURA 2',
    'AYUDANTE MANIOBRA 1',
    'AYUDANTE MANIOBRA 2',
    'AYUDANTE MECANICA 2',
    'AYUDANTE SOLDADURA 1',
    'AYUDANTE SOLDADURA 2',
    'CONDUCTOR',
    'DIBUJANTE 1',
    'DIBUJANTE 3',
    'ELECTRICISTA 1',
    'ELECTRICISTA 2',
    'ELECTRONICO 1',
    'ELECTRONICO 2',
    'ELECTRONICO 3',
    'ESTIMADOR PROFESIONAL',
    'FIBRERO 3',
    'GERENTE DE PROYECTOS 2',
    'GERENTE PLANTA',
    'INGENIERO DE PRODUCCIÓN 1',
    'INGENIERO DE PRODUCCION 2',
    'INGENIERO DE PRODUCCION 3',
    'JEFE DEPARTAMENTO DE ESTIMACIÓN',
    'JEFE DEPARTAMENTO GERENCIA DE PROYECTOS',
    'JEFE DEPARTAMENTO INGENIERIA DE PRODUCCION',
    'JEFE DEPARTAMENTO PPCP',
    'JEFE DEPARTAMENTO PRODUCCIÓN',
    'JEFE DIVISION DE SOLDADURA Y PAILERIA',
    'JEFE DIVISION HABITABILIDAD',
    'JEFE DIVISION MATERIALES COMPUESTOS',
    'JEFE GRUPO FIBRERO',
    'JEFE GRUPO PINTURA Y SANDBLASTING',
    'MECANICO NAVAL  1',
    'MECANICO NAVAL 2',
    'MECANICO NAVAL 3',
    'OFICIAL DE PINTURA 3',
    'OPERADOR MESA DE CORTE',
    'PAILERO',
    'PROFESIONAL EJECUTIVA',
    'SOLDADOR 1',
    'SOLDADOR 2',
    'SOLDADOR CALIFICADO',
    'SUPERINTENDENTE MATERIALES',
    'SUPERVISOR  MANIOBRA',
    'SUPERVISOR ELECTRICIDAD',
    'SUPERVISOR ELECTRONICA Y AUTOMATIZACION',
    'SUPERVISOR HABITABILIDAD',
    'SUPERVISOR HVAC',
    'SUPERVISOR MATERIALES COMPUESTOS',
    'SUPERVISOR MECANICA',
    'SUPERVISOR PINTURAS Y RECUBRIMIENTOS',
    'SUPERVISOR SERVICIOS GENERALES',
    'SUPERVISOR SOLDADURA Y PAILERIA',
    'TECNICO MANIOBRA 1',
    'TÉCNICO PLANILLACIÓN',
    'TECNICO REFRIGERACION 1',
    'TECNICO REFRIGERACION 3',
    'TOPOGRAFO'
  ];

  tipo_usr: TipoUsr[] = [
    {value: 0, viewValue: 'Admin'},
    {value: 1, viewValue: 'Solicitante'},
    {value: 2, viewValue: 'Autorizador/Solicitante'},
    {value: 3, viewValue: 'Seguridad'}
  ];

  // @Input() token: string;

  _usrform = new FormGroup({

    ID: new FormControl('', Validators.required),
    nombre: new FormControl ('', Validators.required),
    cargo: new FormControl('', Validators.required),
    tipo: new FormControl ('', Validators.required),
    email: new FormControl ('', [Validators.required, Validators.email]),
    contraseña: new FormControl('', Validators.required),
    contraseña_confirm : new FormControl ('', Validators.required)
  });

  constructor(public _formbuilder: FormBuilder, public _dialogRef: MatDialogRef<UsuarioComponent>,
  public usrservice: UsuarioService, @Inject(MAT_DIALOG_DATA) public data: any, public snackBar: MatSnackBar, private loginService: LoginService) { }

  ngOnInit() {
  this.token = this.loginService.getToken();


  // console.log(this.token);

  }
  onNoClick(): void {
    this._dialogRef.close();
  }
  onSubmit() {
    this.loading = true;

    if (this._usrform.invalid) {
      return;
    } else {
      // console.log(this._usrform.get('tipo').value);
      if (this._usrform.get('contraseña').value === this._usrform.get('contraseña_confirm').value ) {
          this.loginService.signUp(this._usrform.get('nombre').value , this._usrform.get('email').value, this._usrform.get('contraseña').value, this._usrform.get('contraseña_confirm').value, this.token).subscribe(res =>{
          this.loginService.getID(this.token, this._usrform.get('email').value).subscribe(usr_id => {
          this.id_user = usr_id[0]['id'];
          this.loginService.sign_full(this.id_user, this._usrform.get('ID').value, this._usrform.get('tipo').value, this._usrform.get('cargo').value, this.token).subscribe(usr_full =>{
            console.log(this._usrform.value);
            this.loading = false;
            this._dialogRef.close();
            this.openSnackBar('Usuario registrado con exito!');

          });
         });

            } , error1 => {
          console.log(error1);
          this.error_pass = false;
        });

      } else {
        this.error_pass = true;

      }

    }

  }

  openSnackBar(msj) {
    this.snackBar.open(msj, null, {
      duration: 2000
    });
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

}
