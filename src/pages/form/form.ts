import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScoreBoardPage } from '../score-board/score-board';

/**
 * Generated class for the FormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
})
export class FormPage {
  persona: any= {
    nombre: "",
    carrera: "",
    altura: "",
    edad: "",
    genero: "",

  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openScoreBoard(){
    this.navCtrl.setRoot(ScoreBoardPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormPage');
  }

}
