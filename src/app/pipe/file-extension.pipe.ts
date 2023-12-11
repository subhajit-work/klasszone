import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'extension'
})
export class FileExtensionPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(item:any) {
    console.log('item>>', item);
    console.log('extension>>', item.split(/[#?]/)[0].split('.').pop().trim());
    console.log('decode>>', item.substring(item.indexOf('/') + 1, item.indexOf(';base64')));
    
    if (item.substr(item.indexOf('.')) == 'pdf' || item.substring(item.indexOf('/') + 1, item.indexOf(';base64')) == 'pdf') {
      return '<a class="download-resume-btn" href="'+item+'" target="_self"><ion-icon name="download-outline"></ion-icon></a>'
    }else if(item.substr(item.indexOf('.')) == 'jpg' || item.substring(item.indexOf('/') + 1, item.indexOf(';base64')) == 'jpg') {
      return '<img class="form-upload-image" src="'+item+'" alt="image" />'
    }else if(item.substr(item.indexOf('.')) == 'jpeg' || item.substring(item.indexOf('/') + 1, item.indexOf(';base64')) == 'jpeg') {
      return '<img class="form-upload-image" src="'+item+'" alt="image" />'
    }else if(item.substr(item.indexOf('.')) == 'png' || item.substring(item.indexOf('/') + 1, item.indexOf(';base64')) == 'png') {
      return '<img class="form-upload-image" src="'+item+'" alt="image" />'
    }else {
      return ''
    }
    
    
  }

}
