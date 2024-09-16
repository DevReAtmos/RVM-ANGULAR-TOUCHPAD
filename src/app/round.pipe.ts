import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  transform(value: number, decimals: number = 2): number {
    if (!value) return 0;
    return parseFloat(value.toFixed(decimals));
  }

}

