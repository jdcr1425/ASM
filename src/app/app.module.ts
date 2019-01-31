import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';

import {AppComponent /*DialogOverviewExampleDialog*/} from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule, MatCheckbox, MatCheckboxModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridList,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatSelect,
  MatSelectModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTabGroup,
  MatToolbarModule,

} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AsmService} from '../services/asm.service';
import {auth} from 'firebase';
import {AuthService} from '../services/auth.service';
import { UsuarioComponent } from './usuario/usuario.component';
import {UsuarioService} from '../services/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import {LoginService} from './services/login.service';
import {RequerimientosService} from './services/requerimientos.service';
import { ResumenComponent } from './resumen/resumen.component';
import { EstadoPipe } from './estado.pipe';
import { SearchPipe } from './search.pipe';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {UploadService} from './uploads/shared/upload.service';





const firebase = {
  apiKey: 'AIzaSyBl8zcGpt5xXqGcQG8ewpfV-v5SBh8i1dA',
  authDomain: 'asmprueba-51b20.firebaseapp.com',
  databaseURL: 'https://asmprueba-51b20.firebaseio.com',
  projectId: 'asmprueba-51b20',
  storageBucket: 'asmprueba-51b20.appspot.com',
  messagingSenderId: '596208705784'
};

@NgModule({
  declarations: [
    AppComponent, UsuarioComponent, ResumenComponent, EstadoPipe, SearchPipe
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatStepperModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AngularFireModule.initializeApp(firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireDatabaseModule,
    MatListModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule



  ],
  providers: [AsmService, AuthService, UsuarioService, LoginService, RequerimientosService, UploadService],
  entryComponents: [UsuarioComponent, ResumenComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
