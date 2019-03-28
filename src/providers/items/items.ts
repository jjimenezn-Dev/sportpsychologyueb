import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ItemsProvider {
  public itemsList:any;
  public itemsList2:any;
  constructor(public http: HttpClient) {
    // usuarios mobile
    this.itemsList = [];
    // facultades
    this.itemsList2 = [];
  }

  itemsAdd(item){
    this.itemsList.push(item);
  }

  clear(){
    this.itemsList = [];
  }


  itemsAdd2(item){
    this.itemsList2.push(item);
  }

  clear2(){
    this.itemsList2 = [];
  }

  facByName(name){
    for(let elem of this.itemsList2){
      if(name == elem.value.nombre)
        return elem.value;
    }
    return 0;
  }

  getKeyByCc(cc){
    for(let elem of this.itemsList){
      if(elem.value.cedula == cc)
        return elem.key;
    }
    return 0;
  }
}
