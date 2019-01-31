import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estado'
})
export class EstadoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
     return value == 1 ? 'Autorizada': 'Aun sin autorizar' ;
  }

}
