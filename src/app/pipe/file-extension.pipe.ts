import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extension'
})
export class FileExtensionPipe implements PipeTransform {

  transform(item:any) {
    if (item.substr(item.indexOf('.')) == '.pdf') {
      return true
    }else {
      return false
    }
    
    
  }

}
