import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';
import { SportActivityPage } from '../sport-activity/sport-activity';
import { CardiacPage } from '../cardiac/cardiac';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { ItemsProvider } from '../../providers/items/items';


@IonicPage()
@Component({
  selector: 'page-score-board',
  templateUrl: 'score-board.html',
})
export class ScoreBoardPage {
  today:any;
  user:any = {
    nombre: "",
    facultad: {id:2, nombre:"Psicologia", score:50},
    score: 0
  }
  facultades:any[] = [
    {id:1, nombre:"Ingeniería de Sistemas", score:100},
    {id:2, nombre:"Psicologia", score:50},
    {id:3, nombre:"Biologia", score:10},
  ];
  months = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public configService: ConfigServiceProvider,
    public itemsService: ItemsProvider) {
      if(navParams.data['persona']){
        console.log("Persona recibida---", navParams.data['persona']);
        
        this.user.nombre = navParams.data['persona'].nombres + " " + navParams.data['persona'].apellidos;
        this.user.score = navParams.data['persona'].puntos;
      }
      console.log(this.user);
  }

  ionViewDidLoad() {  
    this.today = new Date();
    console.log(this.today);
    
    console.log('ionViewDidLoad ScoreBoardPage');
  }


  openActivity(){
    let personaKey = this.itemsService.getKeyByCc(this.navParams.data['persona'].cedula);
    this.navCtrl.push(SportActivityPage, {persona: personaKey});
  }


  openCardiac(){
    this.navCtrl.push(CardiacPage);
  }
}
