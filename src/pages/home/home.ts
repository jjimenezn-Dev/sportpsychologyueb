import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ScoreBoardPage } from '../score-board/score-board';
import { FormPage } from '../form/form';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { PersonaItem } from '../../models/persona-item/persona-item';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { ItemsProvider } from '../../providers/items/items';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  person_id;
  persona = {} as PersonaItem; 
  refPersona: any;
  result:any;

  constructor(public navCtrl: NavController,
    public configService: ConfigServiceProvider,
    private database: AngularFireDatabase,
    public itemsService: ItemsProvider) {
      this.refPersona = database.object("Usuario_mobil");
  }

  start(){
    if(!this.person_id || this.person_id == 0){
      this.configService.showToast2("cedula incorrecta", "toast-failed");
      return;
    }
    this.loadUsers();     
    //this.navCtrl.setRoot(FormPage, {"cedula": this.person_id});
  }


  nextPage(){
    for(let elem of this.itemsService.itemsList){
      if(elem.value.cedula == this.person_id){
        this.navCtrl.setRoot(ScoreBoardPage, {"persona":elem.value});
        return;
      }
    }
    this.navCtrl.setRoot(FormPage, {cedula:this.person_id});
  }
  

  async loadUsers(){
    try {
      var usersRef = this.database.database.ref("Usuario_mobil");
      usersRef.orderByChild('cedula').once("value").then(snapshot => {
        this.itemsService.clear();
        snapshot.forEach(element => {
          let item = {
            key: element.key,
            value: element.val()
          }
          this.itemsService.itemsAdd(item);
        });
        console.log("value",this.itemsService.itemsList);

        this.nextPage();
      });
    } catch (err) {
      console.log("nextPage() error>", err);
    }
  }

}
