import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ItemsProvider {
  public itemsList:any;
  constructor(public http: HttpClient) {
    this.itemsList = [];
    console.log('Hello ItemsProvider Provider');
  }

  itemsAdd(item){
    this.itemsList.push(item);
  }

  clear(){
    this.itemsList = [];
  }

  getKeyByCc(cc){
    for(let elem of this.itemsList){
      if(elem.value.cedula == cc)
        return elem.key;
    }
    return 0;
  }
}
