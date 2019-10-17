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
        return elem;
    }
    return 0;
  }

  getKeyByCc(cc){
    console.log('bandera');
    
    for(let elem of this.itemsList){
      if(elem.value.cedula == cc)
        return elem.key;
    }
    return 0;
  }

  getScoreByCc(cc){
    for(let elem of this.itemsList){
      if(elem.value.cedula == cc)
        return elem.value.puntos;
    }
    return 0;
  }

  getUserByKey(key){
    for(let elem of this.itemsList){
      if(elem.key == key)
        return elem;
    }
    return 0;
  }

  changeValues(value, Usr, Fac){
    /*for(let elem of this.itemsList){
      if(elem.key == Usr)
        elem.value.puntos = elem.value.puntos + value;
    }

    for(let elem of this.itemsList2){
      if(Fac == elem.key)
      elem.value.puntos = elem.value.puntos + value;
    }*/
  }
}
