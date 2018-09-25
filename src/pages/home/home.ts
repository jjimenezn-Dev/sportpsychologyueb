import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ScoreBoardPage } from '../score-board/score-board';
import { FormPage } from '../form/form';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  start(){
    this.navCtrl.setRoot(FormPage);
  }

}
