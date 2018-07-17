import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'spot'
})
export class FilterSpotPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      return it.spot.name.toLowerCase().includes(searchText);
    });
  }
}
