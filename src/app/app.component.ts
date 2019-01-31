import {Component, OnInit, Output, Inject, HostListener} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, finalize} from 'rxjs/operators';
import { AngularFirestore} from '@angular/fire/firestore';
import {AsmService} from '../services/asm.service';
import {AuthService} from '../services/auth.service';
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS, PageEvent
} from '@angular/material';

import {UsuarioService} from '../services/usuario.service';
import {UsuarioComponent} from './usuario/usuario.component';
import {HttpClient} from '@angular/common/http';
import {LoginService} from './services/login.service';
import {RequerimientosService} from './services/requerimientos.service';
import {ResumenComponent} from './resumen/resumen.component';
import * as moment from 'moment';
import {AppDateAdapter, APP_DATE_FORMATS} from './date.adapter';
import {AngularFireStorage} from '@angular/fire/storage';
import { AsyncAction} from 'rxjs/internal/scheduler/AsyncAction';
import * as firebase from 'firebase';
import {UploadService} from './uploads/shared/upload.service';
import * as _ from 'lodash';
import * as emailjs from 'emailjs-com';


export interface User {
  name: string;
}

export interface Autorizador {
  id: any;
  name: any;
}

export interface Regresar {
  value: string;
  viewValue: string;
}

export interface Motivo {
  value: string;
  viewValue: string;
}

export interface Pertinencia {
  value: string;
  viewValue: string;
}




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{
    provide: DateAdapter,
    useClass: AppDateAdapter
  },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    }
  ]
})


export class AppComponent implements OnInit {

  mostrar_salidas_control = true;
  mostrar_retornos = false;
  materiales_retorno: Object;
  selectedImage: File;
  entre_autorizadores;
  estado_salida;
  num_materiales;
  nombre;
  nombre2;
  urlImage;
  selectedFiles: FileList;
  currentUpload: Upload;

  searching = false;
  activarauto = false;
  todosusuarios: any;
  persona = {};
  persona2 = {};
  name;
  NameAuth;
  NameGer;
  auto: Autorizador[];
  autorizadoresMostrarEnSelect = [];
  autorizadoresGerente = [];
  autorizadoresMostrarEnSelectGerente = [];
  usuarios: any;
  usuarios_autorizadores = [];
  title = 'ASM';
  hide = true;
  pasaraagregar = true;
  valor;
  requerido: boolean;
  fecha_salida: string;
  datos_inicio = {};
  nombreAndMore = {};
  salidas_totales: any = [];
  llegadas: any = [];
  salidasFiltradas: any = [];
  datos_salida = {};
  salidas2 = 0;
  pilla;
  nombre_prueba;
  expandir1 = true;
  expandir2 = false;
  disableSelect = new FormControl(false);

  deshabilitarTabAUtorizacion = true;
  deshabilitaraddmateriales = true;
  desabilitaraddsalida = false;
  hora_actual;
  hora;
  myFilter;
  loading1;
  loading2;
  deshabilitarTabDatos;
  file: File;


  autorizadoresForm = new FormGroup({
    jefe: new FormControl('', Validators.required),
    gerente: new FormControl('')
  });

  autorizacionesForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripción: new FormControl('', Validators.required),
    cantidad: new FormControl('', Validators.required),
    foto: new FormControl(''),
    debevolver: new FormControl('', Validators.required),
    fecha: new FormControl({
      value: '',
      disabled: true
    })
  });

  materialesForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripción: new FormControl('', Validators.required),
    cantidad: new FormControl('', Validators.required),
    foto: new FormControl(''),
    debevolver: new FormControl('', Validators.required),
    fecha: new FormControl({
      value: '',
      disabled: true
    })
  });


  createForm = new FormGroup({
    proyecto: new FormControl('', Validators.required),
    // ID: new FormControl('', Validators.required),
    pertinencia: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    motivo: new FormControl('', Validators.required)
  });

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', Validators.required),
  });


  panelOpenState = false;
  options: string[] = ['GEMAM', 'GECON', 'GEBOC', 'GEFAD', 'GEDIN', 'GECTI', 'GETHU', 'VPEXE', 'VPT&O', 'PCTMAR'];
  filteredOptions: Observable < string[] > ;
  error: boolean;

  usr: any = {
    name: 'juan D. Casseres',
    cargo: ''
  };
  primeravez: true;
  mostrartabs: boolean;
  mostrarsol: boolean;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  _formBuilder = new FormBuilder();
  isOptional = false;
  Fecha;

  loggedIn = false;
  usuarioActual: any = {};


  regresar: Regresar[] = [{
    value: 'Sí',
    viewValue: 'Sí'
  },
    {
      value: 'No',
      viewValue: 'No'
    }
  ];
  show = false;
  selected;
  minima;
  maxima;
  fecha;
  solicitudes: any = {};
  salidas: any = [];
  Salidas: any = [];


  selectedValue: string;
  selectedIndex = 0;

  pertinencia: Pertinencia[] = [{
    value: 'GEMAM',
    viewValue: 'GEMAM'
  },
    {
      value: 'GECON',
      viewValue: 'GECON'
    },
    {
      value: 'GEBOC',
      viewValue: 'GEBOC'
    },
    {
      value: 'GEFAD',
      viewValue: 'GEFAD'
    },
    {
      value: 'GEDIN',
      viewValue: 'GEDIN'
    },
    {
      value: 'GECTI',
      viewValue: 'GECTI'
    },
    {
      value: 'GETHU',
      viewValue: 'GETHU'
    },
    {
      value: 'VPEXE',
      viewValue: 'VPEXE'
    },
    {
      value: 'VPT&O',
      viewValue: 'VPT&O'
    },
    {
      value: 'PCTMAR',
      viewValue: 'PCTMAR'
    }
  ];


  motivo: Motivo[] = [{
    value: 'Préstamo',
    viewValue: 'Préstamo'
  },
    {
      value: 'Reparación',
      viewValue: 'Reparación'
    },
    {
      value: 'Venta',
      viewValue: 'Venta'
    },
    {
      value: 'Transalado',
      viewValue: 'Transalado'
    },
    {
      value: 'Donación',
      viewValue: 'Donación'
    },
    {
      value: 'Devolución',
      viewValue: 'Devolución'
    },
    {
      value: 'Desecho',
      viewValue: 'Desecho'
    }
  ];


  submitted = false;
  isPopupOpened = false;
  public _usrform: FormGroup;
  offline;
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    const num_req = this.datos_salida['id'];
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    if (this.datos_salida['id']) {
      localStorage.setItem('id_salida', this.datos_salida['id']);
      if (this.entre_autorizadores) {
        localStorage.setItem(' entre_autorizadores', 'si');
      }

      if (this.num_materiales > 0) {
        localStorage.setItem('num_materiales', this.num_materiales);
      }
      // this.deleteRequerimiento(this.datos_salida['id']);
    }
    return false;
  }


  constructor(private swUpdate: SwUpdate, _formBuilder: FormBuilder, private registroService: AsmService,
              public snackBar: MatSnackBar, public authservice: AuthService, public dialog: MatDialog,
              public _usrservice: UsuarioService, public _formbuilder: FormBuilder, private loginservice: LoginService, public requerimiento: RequerimientosService,
              private storage: AngularFireStorage, private upSvc: UploadService) {

    this.urlImage = '';

    moment.locale('es');
    this.hora_actual = moment().format('LLLL');

    this.myFilter = (d: Date): boolean => {
      const day = d.getDay();
      // Prevent Saturday and Sunday from being selected.
      return day !== 0 && day !== 6;
    };


  }


  ngOnInit(): any {

    setInterval(() => {
      this.cargartodo(this.usr.cargo);
    }, 90000);

    /*if (!navigator.onLine){
      this.offline = true;
    }*/


    // this.alsalir();
    this.mostrarsol = true;
    this.mostrartabs = false;

    if (localStorage.getItem('logueado') === '1') {
      this.loggedIn = true;
      this.usr.cargo = localStorage.getItem('cargo');
      this.datos_inicio = JSON.parse(localStorage.getItem('datos_inicio'));
      this.pilla = JSON.parse(localStorage.getItem('pilla'));
      this.getName();
      this.cargartodo(this.usr.cargo);
      this.error = false;
      this.loginservice.guardartoken(this.datos_inicio['access_token']);
    }

    if (!this.loggedIn) {
      console.log('sin login');
    } else {
      console.log('ok');
      if (this.swUpdate.isEnabled) {
        this.swUpdate.available.subscribe(() => {
          window.location.reload();
        });
      }
    }

    this.filteredOptions = this.createForm.get('pertinencia').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.fecha = new Date();
    const dia = this.fecha.getDate();
    const year = this.fecha.getFullYear();
    const month = this.fecha.getMonth();
    this.minima = new Date(year, month, dia);
    this.maxima = new Date(year + 1, month, dia);
    this.Fecha = dia + '/' + month + '/' + year;
    this.hora = moment().format('LTS');
    this.fecha_salida = year + '-' + (month + 1) + '-' + dia + ' ' + this.hora;


  }


  mostrarNombre(id_usr) {
    this.nombre = '';
    this.nombre2 = '';
    this.nombre = this.usuarios.filter(id => id['iduser'] == id_usr);
    this.nombre2 = this.todosusuarios.filter(usr => usr['id'] == this.nombre[0]['id']);
    return this.nombre2[0]['name'];


  }

  detectFiles(event) {
    this.file = event.target.files[0];
    console.log(this.file);
    this.currentUpload = new Upload(this.file);
    this.upSvc.pushUpload(this.currentUpload);
    this.urlImage = this.upSvc.getUrl();
    // this.selectedFiles = event.target.files;*/
  }


  updateUrl(id, url) {
    this.requerimiento.updateAvatar(id, url, this.datos_inicio['access_token']).subscribe(res => {
      console.log('avatar actualizado', res, id, url);
      this.openSnackBar('Imagen actualizada');
    });
  }


  getURL() {
    this.urlImage = '';
    this.urlImage = this.upSvc.getUrl();
    console.log('pillala de aqui', this.urlImage);
    return this.urlImage;
  }

  /* uploadSingle() {
   const file = this.selectedFiles.item(0)
   this.currentUpload = new Upload(file);
   this.upSvc.pushUpload(this.currentUpload);
   setTimeout(() => {
     this.urlImage = this.upSvc.getUrl();
   }, 0);
   return this.urlImage;
 }
*/


  /*GuardarRegistro() {

    if (this.solicitudes.id) {

      this.registroService.EditRegistro( this.solicitudes )
        .then( () => {
          this.openSnackBar('¡Solicitud actualizada!');
        });
    } else {

      this.solicitudes.id = Date.now();
      console.log(this.solicitudes);
      this.registroService.CrearRegistro(this.solicitudes).then(() => {
        this.solicitudes = {};
        this.openSnackBar('Solicitud creada');
      });
    }ss
    }*/
  getStyle(estado) {

    if (estado == 0) {
      return '6px solid red';
    } else if (estado == 1) {
      return '6px solid green';
    }
  }
  login() {
    /* this.authservice.loginWithFacebook()
       .then( rsp => {
         console.log(rsp);
         this.usuarioActual = rsp.user;
         this.loggedIn = true;
         this.openSnackBar('¡Ha iniciado sesión!');
         this.cargarNotas();
       });*/

    /*const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      disableClose : true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });*/
    if (this.loginForm.status === 'VALID') {
      this.loginservice.PostUserDetails(this.loginForm.get('email').value, this.loginForm.get('pass').value).subscribe(user => {

        console.log(user);
        this.datos_inicio = user;
        this.loginservice.guardartoken(this.datos_inicio['access_token']);
        // console.log(this.nombreAndMore[0]['name'] + 'desde login');
        this.loggedIn = true;
        this.openSnackBar('¡Ha iniciado sesión!');
        // this.cargarNotas();
        this.error = false;
        this.getName();

        this.loginservice.getIdenTipoCargo(this.datos_inicio['id'], this.datos_inicio['access_token']).subscribe(res => {

          this.usr.cargo = Number(res[0]['tipousuario']);
          console.log(typeof this.usr.cargo);
          console.log('estos son los datos del usuario logueado', res[0]);
          this.pilla = res[0];
          console.log('pilla' + this.pilla['id']);
          // aqui meter alguna vaina para que no lo cargue todo, sino sobre el tipo de usuario.
          this.cargartodo(this.usr.cargo);
          this.sendEmail(this.loginForm.get('email').value, 'Inicio de sesión ASM', 'Ha iniciado sesión en el ' +
            'sistema de autorización de salida de materiales Cotecmar a las ' + this.hora);
          localStorage.setItem('logueado', '1');
          localStorage.setItem('cargo', this.usr.cargo);
          localStorage.setItem('datos_inicio', JSON.stringify(this.datos_inicio));
          localStorage.setItem('pilla', JSON.stringify(this.pilla));


        });

      }, error1 => {
        console.log(typeof error1.error.message);
        this.error = true;
        this.loginForm.get('pass').setValue('');


      });
    }


  }

  cargartodo(tipo) {
    this.get_all_users();
    this.get_all_users_with_name();

    if (tipo == 3) {
      this.todasLosRequerimientos();
    }
    if (tipo == 0) {
      this.cargarMisrequerimientos();
    }

    if (tipo == 2) {
      this.cargarMisautorizaciones();
      this.cargarMisrequerimientos();
    }
  }

  logout() {


    this.loginservice.logout(this.datos_inicio['access_token']).subscribe((res) => {
      this.loggedIn = false;
      console.log(res);
      this.openSnackBar('¡Ha finalizado sesión!');
      this.mostrarsol = true;
      this.mostrartabs = false;
      this.error = false;
      this.loginForm.reset();
      this.nombreAndMore = {};
      this.datos_inicio = {};
      localStorage.removeItem('logueado');
      localStorage.removeItem('cargo');
      localStorage.removeItem('datos_inicio');
      localStorage.removeItem('pilla');


      ////////////////////////////////////////

      this.searching = false;
      this.activarauto = false;

      this.todosusuarios = [];
      this.persona = {};
      this.persona2 = {};
      this.name = '';
      this.NameAuth = '';
      this.NameGer = '';
      this.auto = [];
      this.autorizadoresMostrarEnSelect = [];
      this.autorizadoresGerente = [];
      this.autorizadoresMostrarEnSelectGerente = [];
      this.usuarios = [];
      this.usuarios_autorizadores = [];
      this.title = 'ASM';
      this.hide = true;
      this.pasaraagregar = true;
      this.valor = '';
      this.requerido = false;
      this.fecha_salida = '';
      this.datos_inicio = {};
      this.nombreAndMore = {};
      this.salidas_totales = [];
      this.llegadas = [];
      this.salidasFiltradas = [];
      this.datos_salida = {};
      this.salidas2 = 0;
      this.pilla = [];
      this.nombre_prueba = '';
      this.expandir1 = true;
      this.expandir2 = false;
      this.disableSelect = new FormControl(false);
      this.deshabilitarTabAUtorizacion = true;
      this.resetform(this.createForm);
      this.resetform(this.materialesForm);
      this.resetform(this.autorizacionesForm);
      this.resetform(this.autorizadoresForm);
      this.deshabilitaraddmateriales = true;


      this.deshabilitarTabAUtorizacion = true;
      this.expandir2 = false;
      this.deshabilitaraddmateriales = true;
      this.selectTab(0);
      this.expandir2 = false;
      this.expandir1 = true;
      this.desabilitaraddsalida = false;
      this.deshabilitaraddmateriales = true;
      this.deshabilitarTabDatos = false;
      this.loading2 = false;
      this.resetform(this.autorizadoresForm);
      this.num_materiales = 0;

    }, error1 => {
      console.log(error1);
    });
  }

  deleteRequerimiento(id) {
    this.requerimiento.deleteInstalacion(this.datos_salida['id'], this.datos_inicio['access_token']).subscribe(res => {
      this.openSnackBar('Solicitud #' + id + ' eliminada con exito!');
    });
  }

  guardarRequerimiento() {

    if (confirm('¿Seguro desea guardar este requerimiento de salida?')) {
      if (this.createForm.status === 'VALID') {
        this.loading1 = true;
        this.requerimiento.crearRequerimiento(this.pilla['id'],
          this.createForm.get('descripcion').value, this.createForm.get('motivo').value,
          this.fecha_salida, this.createForm.get('proyecto').value, this.createForm.get('pertinencia').value, null,
          this.datos_inicio['access_token']).subscribe(res => {
          console.log(res);
          this.datos_salida = res;
          console.log(this.datos_salida['id']);

          this.resetform(this.createForm);
          console.log('value' + this.createForm.status);
          this.pasaraagregar = false;

          this.openSnackBar('¡Solicitud de salida creada con exito! \nAhora puedes agregar los materiales.');

          this.expandir1 = false;
          this.expandir2 = true;
          this.deshabilitaraddmateriales = false;
          this.desabilitaraddsalida = true;
          this.loading1 = false;
        }, error1 => {
          console.log(error1);
        });
      }
    }
  }

  nuevasolicitud() {

    if (localStorage.getItem('id_salida')) {
      if (confirm('Tiene un requerimiento de salida incompleto. ¿Desea completarlo o cancelar y eliminar este?')) {
        if (localStorage.getItem(' entre_autorizadores') === 'si') {
          this.irAutorizacion();
        } else {

        this.num_materiales = localStorage.getItem('num_materiales');
        this.mostrartabs = true;
        this.mostrarsol = false;
        this.pasaraagregar = false;
        this.expandir1 = false;
        this.expandir2 = true;
        this.deshabilitaraddmateriales = false;
        this.desabilitaraddsalida = true;
        this.loading1 = false;
        this.datos_salida['id'] = localStorage.getItem('id_salida');
        }
      } else {
        this.deleteRequerimiento(this.datos_salida['id']);
        localStorage.removeItem('entre_autorizadores');
        localStorage.removeItem('id_salida');
        this.nuevasolicitud();
      }
    } else if (this.datos_salida['id']) {
      if (confirm('¿Quiere cancelar la solicitud actual y crear una nueva?')){
        this.deleteRequerimiento(this.datos_salida['id']);
        this.num_materiales = 0;
        this.mostrartabs = true;
        this.mostrarsol = false;
        this.desabilitaraddsalida = false;
        this.datos_salida = [];
        this.expandir2 = false;
        this.expandir1 = true;
        this.desabilitaraddsalida = false;
        this.deshabilitaraddmateriales = true;
        this.deshabilitarTabDatos = false;
        this.deshabilitarTabAUtorizacion = true;
        this.selectTab(0);
        this.loading2 = false;
        this.resetform(this.autorizadoresForm);
        // ultimo 21/01 8:02 am
        this.cargartodo(this.usr.cargo);
      }
    } else {
      this.num_materiales = 0;
      this.mostrartabs = true;
      this.mostrarsol = false;
      this.desabilitaraddsalida = false;
      this.datos_salida = [];
      this.expandir2 = false;
      this.expandir1 = true;
      this.desabilitaraddsalida = false;
      this.deshabilitaraddmateriales = true;
      this.deshabilitarTabDatos = false;
      this.deshabilitarTabAUtorizacion = true;
      this.selectTab(0);
      this.loading2 = false;
      this.resetform(this.autorizadoresForm);
      // ultimo 21/01 8:02 am
      this.cargartodo(this.usr.cargo);
    }
  }

  versolicitudes() {

    if (this.usr.cargo == 3) {
      this.mostrar_retornos = false;
      this.mostrar_salidas_control = true;
      console.log('hla');
    } else if (this.datos_salida['id']) {
      if (confirm('¿Quiere cancelar la solicitud actual y vers sus solicitudes?')) {
        this.deleteRequerimiento(this.datos_salida['id']);
        this.mostrartabs = false;
        this.mostrarsol = true;
      }
    } else {
      this.mostrartabs = false;
      this.mostrarsol = true;
    }
  }

  resetform(form: FormGroup) {

    let control: AbstractControl = null;

    form.reset();
    form.markAsUntouched();
    Object.keys(form.controls).forEach((name) => {
      control = form.controls[name];
      control.setErrors(null);

    });

  }


  bloquearBoton() {
    return null;
  }
  irAutorizacion() {

    if (localStorage.getItem(' entre_autorizadores') === 'si'){
      this.deshabilitarTabAUtorizacion = false;
      this.num_materiales = 0;
      // this.deshabilitaracordeondeagregarmateriales = true;
      this.expandir2 = false;
      this.deshabilitaraddmateriales = true;
      this.deshabilitarTabDatos = true;
      this.selectTab(1);
      localStorage.removeItem('entre_autorizadores');
      this.mostrartabs = true;
      this.mostrarsol = false;
      this.getAutorizadores();
    } else if (this.num_materiales > 0) {
      if (confirm('¿Desea no agregar mas materiales y pasar a las autorizaciones?')) {
        this.deshabilitarTabAUtorizacion = false;
        this.getAutorizadores();
        // this.deshabilitaracordeondeagregarmateriales = true;
        this.expandir2 = false;
        this.deshabilitaraddmateriales = true;
        this.deshabilitarTabDatos = true;
        this.selectTab(1);
        this.entre_autorizadores = true;

      }
    } else {
      this.openSnackBar('Agregar por lo menos un material a la orden.')
    }



    // this.loading2 = false;


  }
  agregarMateriales() {
    if (confirm('¿Seguro desea agregar este material?')) {
      if (this.datos_salida['id'] != null && this.datos_salida['id'] !== undefined) {
        this.loading2 = true;

        let fecha;
        let debevolver;
        if (this.materialesForm.status === 'VALID') {
          if (this.materialesForm.get('fecha').value === null) {
            fecha = '';
          } else {
            fecha = this.materialesForm.get('fecha').value;
          }
          switch (this.materialesForm.get('debevolver').value) {
            case 'Sí':
              debevolver = 1;
              break;
            case 'No':
              debevolver = 0;
              break;
          }
          // this.uploadSingle();
          console.log('Fecha del regreso del material', fecha);
          this.urlImage = 'a';
          this.requerimiento.agregarMateriales(this.datos_salida['id'], this.materialesForm.get('nombre').value,
            this.materialesForm.get('descripción').value, this.materialesForm.get('cantidad').value,
            this.urlImage, debevolver,
            fecha, this.datos_inicio['access_token']).subscribe(res => {
            console.log(res);
            this.num_materiales += 1;
            this.updateUrl(res['id'], this.getURL());
            this.openSnackBar('¡Material agregado con exito!');
            this.resetform(this.materialesForm);
            this.loading2 = false;
          });


        }
      } else {
        this.openSnackBar('No hay salida creada.');
      }
    }

  }

  onUpload(foto) {
    /*
    console.log(foto.target.files[0]);
    const id = Math.random().toString(36).substring(2);
    const file = foto.target.files[0];
    const filePath = `uploads/material_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe(url =>{
      console.log(this.urlImage);
    });*/
    // Create a root reference


  }

  get_all_users() {
    this.usuarios = [];
    this.requerimiento.getAutorizadores(this.datos_inicio['access_token']).subscribe(res => {
      console.log('Entré a autorizadores');
      this.usuarios = res;
    });
  }
  get_all_users_with_name() {
    this.todosusuarios = [];
    this.requerimiento.todosUsers(this.datos_inicio['access_token']).subscribe(res => {
      this.todosusuarios = res;

    });
  }

  getAutorizadores() {
    this.autorizadoresGerente = [];
    this.usuarios = [];
    this.usuarios_autorizadores = [];
    this.autorizadoresMostrarEnSelect = [];
    this.autorizadoresMostrarEnSelectGerente = [];

    this.requerimiento.getAutorizadores(this.datos_inicio['access_token']).subscribe(res => {
      console.log('Entré a autorizadores');
      this.usuarios = res;
      this.usuarios_autorizadores = this.usuarios.filter(usuario => usuario['tipousuario'] === '2');
      console.log('usuarios que pueden autorizar', this.usuarios_autorizadores, 'tipo : ');

      // aqui tengo que quitar a mi usuario para que no aparezca como autorizador

      this.usuarios_autorizadores = this.usuarios_autorizadores.filter(usuario => this.pilla['iduser'] != usuario['iduser']);

      this.autorizadoresGerente = this.usuarios_autorizadores.filter(user => user['cargo'].includes('GERENTE DE PROYECTOS'));

      // le quito los gerentes a Autorizadores

      this.usuarios_autorizadores = this.usuarios_autorizadores.filter(usuario => !usuario['cargo'].includes('GERENTE DE PROYECTOS'));

      console.log(this.autorizadoresGerente, 'Gerentes');

      for (const obj of this.usuarios_autorizadores) {
        // console.log(obj['tipousuario']);
        console.log(obj['iduser']);
        this.loginservice.NameEMailUser(Number(obj['iduser']), this.datos_inicio['access_token']).subscribe(response => {
          console.log(response[0]['name']);
          this.autorizadoresMostrarEnSelect.push(response[0]['name']);
        });
      }
      for (const obj of this.autorizadoresGerente) {
        // console.log(obj['tipousuario']);
        console.log(obj['iduser']);
        this.loginservice.NameEMailUser(Number(obj['iduser']), this.datos_inicio['access_token']).subscribe(response => {
          console.log(response[0]['name']);
          this.autorizadoresMostrarEnSelectGerente.push(response[0]['name']);
        });
      }
      // this.getIdByName();
    });


  }
  addAutho() {

    if(confirm('¿Está seguro?')){
      this.requerimiento.todosUsers(this.datos_inicio['access_token']).subscribe(res => {
        this.todosusuarios = res;
        console.log(this.todosusuarios, 'Todos los usuarios');

        this.persona = this.todosusuarios.filter(usuario => usuario['name'] === this.NameAuth);
        console.log('se supone que aqui pillo el name', this.usuarios_autorizadores);
        console.log('is there someone?', this.persona);
        let id = this.persona[0]['id'];
        console.log('id de la persona que escogi', id);
        let id_auto = this.usuarios_autorizadores.filter(id => id['iduser'] == this.persona[0]['id']);
        console.log(id_auto, 'test', id_auto[0]['id']);
        console.log('Datos de mi usuario autorizador', this.usuarios_autorizadores);

        this.requerimiento.addAutho(id_auto[0]['id'], this.datos_salida['id'],
          id_auto[0]['identificacion'], this.NameAuth, id_auto[0]['cargo'], 0,
          this.datos_inicio['access_token']).subscribe(res => {
          console.log(res);
          this.sendEmail(this.persona[0]['email'], 'Autorización de material a salir.', 'Se le informa que debe ' +
            'autorizar la salida con id #' + this.datos_salida['id'] + ' Solicitada por ' + this.nombreAndMore[0]['name'] + ' el ' + this.fecha + ' a las ' + this.hora_actual );

          ////////////////////////////////////////////////////////////////////////////////
          if (!this.disableSelect.value) {
            this.persona2 = this.todosusuarios.filter(usuario => usuario['name'] === this.NameGer);
            id = this.persona2[0]['id'];
            id_auto = this.autorizadoresGerente.filter(id => id['iduser'] == this.persona2[0]['id']);
            this.requerimiento.addAutho(id_auto[0]['id'], this.datos_salida['id'],
              id_auto[0]['identificacion'], this.NameGer, id_auto[0]['cargo'],
              0, this.datos_inicio['access_token']).subscribe(res => {
              console.log(res);
              this.sendEmail(this.persona2[0]['email'], 'Autorización de material a salir.', 'Se le informa que debe ' +
                'autorizar la salida con id #' + this.datos_salida['id'] + ' Solicitada por ' + this.nombreAndMore[0]['name'] + ' el ' + this.fecha + ' a las ' + this.hora_actual);

            });
          }

          this.openSnackBar('¡Autorizadores agregados con exito!');
          localStorage.removeItem('id_salida');
          localStorage.removeItem('entre_autorizadores');
          this.expandir2 = false;
          this.expandir1 = true;
          this.datos_salida = {};
          this.desabilitaraddsalida = false;
          this.deshabilitaraddmateriales = true;
          this.deshabilitarTabDatos = false;
          this.deshabilitarTabAUtorizacion = true;
          this.selectTab(0);
          this.loading2 = false;
          this.resetform(this.autorizadoresForm);
          // ultimo 21/01 8:02 am
          this.cargartodo(this.usr.cargo);


        });


      });

    }


  }


  sendEmail(correo, asunto, msj) {
    const template_params = {
      'destinatario': correo,
      'asunto': asunto,
      'msj': msj
    }

    emailjs.send('outlook', 'confirmacion_auto', template_params, 'user_QfRJrBlRzZGObG27yDU8M')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
      }, (err) => {
        console.log('FAILED...', err);
      });
  }



  mostrar(id, accion, identificacion_super, nombresapellidos_supervisor, fecha_salida, id_material) {
    const dialogref = this.dialog.open(ResumenComponent, {
      data: {
        id_user: this.pilla['id'],
        id_salida: id,
        accion: accion,
        identificacion: this.pilla['identificacion'],
        nombre_logueo: this.nombre_prueba,
        identificacion_supervisor: identificacion_super,
        fecha_salida: fecha_salida,
        nombresapellidos_supervisor: nombresapellidos_supervisor,
        id_material : id_material
      },
    });

    dialogref.afterClosed().subscribe(result => {
      this.cargartodo(this.usr.cargo);
      this.get_retornos();

    });
    console.log(id);

  }

  verificar() {
    this.valor = this.materialesForm.get('debevolver').value;
    if (this.valor.toString().includes('Sí')) {
      this.requerido = true;
      this.materialesForm.get('fecha').enable();
    } else if (this.valor.toString().includes('No')) {
      this.requerido = false;
      this.materialesForm.get('fecha').disable();
      this.materialesForm.get('fecha').reset();

    }

    console.log(this.requerido);
  }

  Seleccionarsolicitud(sol) {
    this.solicitudes = sol;
  }

  eliminarNota(sol) {
    const rsp = confirm('Confirme la eliminación de ' + sol.id);
    if (rsp) {
      this.registroService.DeleteRegistro(sol)
        .then(() => {
          this.solicitudes = {};
          this.snackBar.open('Nota eliminada.', null, {
            duration: 2000
          });
        });
    }
  }

  openSnackBar(msj) {
    this.snackBar.open(msj, null, {
      duration: 2000
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this._usrform.controls;
  }

  getName() {
    return this.loginservice.NameEMailUser(this.datos_inicio['id'], this.datos_inicio['access_token']).subscribe((response) => {
      this.nombreAndMore = response;
      this.nombre_prueba = this.nombreAndMore[0]['name'];
      console.log(this.nombre_prueba + ' desde get_name', 'y el id que estoy pasando', this.datos_inicio['id'], 'y la respuesta exacta del servidor es', response);
    });
  }

  getName2(id) {
    this.loginservice.NameEMailUser(id, this.datos_inicio['access_token']).subscribe(res => {
      this.name = res[0]['name'];
    });

    return this.name;
  }

  /* cargarNotas() {
    this.registroService.getRegistros().valueChanges().subscribe((fbsol) => {
      this.salidas = fbsol;
      console.log(this.salidas);
    });
  } */

  historial(){
  this.cargarMisrequerimientos();
  }
  get_retornos() {
    this.requerimiento.retornos(this.datos_inicio['access_token']).subscribe(res => {
      const result = Object.keys(res).map(function(key) {
        return [res[key]];
      });



      this.materiales_retorno = result.filter(material => material[0]['regresa'] == 1);
      console.log(this.materiales_retorno);
    });
  }
  ver_retornos() {
    this.mostrar_salidas_control = false;
    this.mostrar_retornos = true;
  }

  cargarMisrequerimientos() {
    this.salidasFiltradas = [];
    this.requerimiento.misRequerimientos(this.datos_inicio['access_token'], this.pilla['id']).subscribe(res => {
      this.salidasFiltradas = res;
      this.salidasFiltradas = this.salidasFiltradas.filter(sol => sol.estado != '1');
      console.log(this.salidasFiltradas);

    });
  }

  todasLosRequerimientos() {
    this.salidas_totales = [];
    this.requerimiento.TodosLosRequerimientos(this.datos_inicio['access_token']).subscribe(res => {
      this.salidas_totales = res;
      console.log(this.salidas_totales, 'Todas las salidas');
    });

  }

  cargarMisautorizaciones() {
    this.llegadas = [];
    this.requerimiento.misAutorizaciones(this.pilla['id'], this.datos_inicio['access_token']).subscribe(res => {
      this.llegadas = res;
      this.llegadas = this.llegadas.filter(sol => sol.estado != 1);


      /*for (let i = 0; i < this.llegadas.length; i++) {
        autorizaciones = {};
        console.log(this.llegadas[i].id, 'id en el for', 'tamaño de las llegadas', this.llegadas.length);
        this.requerimiento.getAuthFromRequerimiento(this.llegadas[i].id, this.datos_inicio['access_token']).subscribe(res => {
          autorizaciones = res;
          autorizaciones = autorizaciones.filter(id => id.idusuario == this.pilla['id']);

          if (autorizaciones[0].estado == 1) {
            console.log('pero porque me das undefined :(' , autorizaciones[0].estado);
            console.log(this.llegadas[i].id, 'Ya la autorice por ende esta salida deberia eliminarse');
            this.llegadas.splice(i, 1);
          }

        });
      }*/
    });
  }

  siono(id_salida) {
    let auto: any = [];
    this.requerimiento.getAuthFromRequerimiento(id_salida, this.datos_inicio['access_token']).subscribe(res => {
      auto = res;
      console.log('autorizaciones antes de filtrar', auto)
      auto = auto.filter(id => id.idusuario == this.pilla['id']);
      console.log('autorizaciones despues de filtrar', auto);


      if (auto[0].estado == 1) {
        console.log('estado autorizada', auto[0].estado);
        // console.log('soy false');
        return true;
      } else if (auto[0].estado == 0) {
        // console.log('soy true');
        console.log('estado no autorizada', auto[0].estado);
        return false;
      }
    });
  }


  selectTab(index: number): void {
    this.selectedIndex = index;
  }

  /* alsalir() {
     if (this.usr.cargo === 0 || this.usr.cargo === 1 || this.usr.cargo === 2 ) {
       this.mostrarsol = true;
       this.mostrartabs = false;
     } else {
       this.mostrarsol = true;
       this.mostrartabs = false;
     }
   }*/
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  getUsrList() {
    return this._usrservice.getAllUsuarios();
  }

  addUsuario() {
    this.isPopupOpened = true;
    const dialogref = this.dialog.open(UsuarioComponent, {

      data: {},
      disableClose: true
    });

    dialogref.afterClosed().subscribe(result => {
      this.isPopupOpened = false;
    });


  }

  public showSearchResults(event: any): void {
    this.searching = true;
  }

  /*


  @Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-overview-example-dialog.html',
  })
  export class DialogOverviewExampleDialog {

    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

    onNoClick(): void {
      this.dialogRef.close();
    }
    onYesClick(): void{

    }


  }
  */
}

export class Upload {

  $key: string;
  file: File;
  name: string;
  url: string;
  progress: number;
  createdAt: Date = new Date();

  constructor(file: File) {
    this.file = file;
  }
}
