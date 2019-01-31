import {AngularFireDatabase} from '@angular/fire/database';
import {Injectable} from '@angular/core';

@Injectable()
export  class AsmService {

  constructor(public afDB: AngularFireDatabase) {
  }

  public getRegistros() {
    return this.afDB.list('/registros/');
  }

  public getRegistro(id) {
    return this.afDB.object('/registros/' + id);
  }

  public CrearRegistro(reg) {
    return this.afDB.database.ref('/registros/' + reg.id).set(reg);
  }

  public EditRegistro(reg) {
    return this.afDB.database.ref('/registros/' + reg.id).set(reg);
  }

  public  DeleteRegistro(reg) {
    return this.afDB.database.ref('/registros/' + reg.id).remove();
  }
}
