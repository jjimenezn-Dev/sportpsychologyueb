import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';
import { SportActivityPage } from '../sport-activity/sport-activity';
import { CardiacPage } from '../cardiac/cardiac';

/**
 * Generated class for the ScoreBoardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-score-board',
  templateUrl: 'score-board.html',
})
export class ScoreBoardPage {
  today:any;
  user:any = {
    nombre: "pepito",
    facultad: {id:2, nombre:"Psicologia", score:50},
    score: 30
  }
  facultades:any[] = [
    {id:1, nombre:"Ingeniería de Sistemas", score:100},
    {id:2, nombre:"Psicologia", score:50},
    {id:3, nombre:"Biologia", score:10},
  ];
  months = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {  
    this.today = new Date();
    console.log(this.today);
    
    console.log('ionViewDidLoad ScoreBoardPage');
  }


  openActivity(){
    this.navCtrl.setRoot(SportActivityPage);
  }


  openCardiac(){
    this.navCtrl.setRoot(CardiacPage);
  }
}
