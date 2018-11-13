import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScoreBoardPage } from '../score-board/score-board';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database"; 

import { PersonaItem } from '../../models/persona-item/persona-item';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';

@IonicPage()
@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
})
export class FormPage {
  persona = {} as PersonaItem; 
  refPersona: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private database: AngularFireDatabase,
    public configService: ConfigServiceProvider){

      this.refPersona = database.list("Usuario_mobil");
      console.log("Ref persona ---",this.refPersona);
      
      if(this.navParams.data['cedula']){
        this.persona.cedula = Number(this.navParams.data['cedula']);
      }
      this.persona.puntos = 0;
    }


  openScoreBoard(){
    if (this.validateFields()){
      this.addPersona();
      this.navCtrl.setRoot(ScoreBoardPage, {"persona":this.persona});
    }
  }


  addPersona(){
    this.refPersona.push(this.persona);
  }


  validateFields(){
    if(!this.persona.cedula || this.persona.cedula == 0){
      this.configService.showToast2("cedula incorrecta", "toast-failed");
      return false;
    }
    if(!this.persona.nombres || this.persona.nombres == "" || this.persona.nombres.length > 100){
      this.configService.showToast2("nombres incorrectos", "toast-failed");
      return false;
    }
    if(!this.persona.apellidos || this.persona.apellidos == ""  || this.persona.apellidos.length > 100){
      this.configService.showToast2("apellidos incorrectos", "toast-failed");
      return false;
    }
    if(!this.persona.facultad || this.persona.facultad == ""){
      this.configService.showToast2("facultad incorrecta", "toast-failed");
      return false;
    }
    if(!this.persona.carrera || this.persona.carrera == ""){
      this.configService.showToast2("carrera incorrecta", "toast-failed");
      return false;
    }
    if(!this.persona.altura || this.persona.altura == ""  || this.persona.altura.length > 5){
      this.configService.showToast2("altura incorrecta", "toast-failed");
      return false;
    }
    if(!this.persona.peso || this.persona.peso == ""  || this.persona.peso.length > 5){
      this.configService.showToast2("peso incorrecto", "toast-failed");
      return false;
    }
    if(!this.persona.edad || this.persona.edad > 100){
      this.configService.showToast2("edad incorrecta", "toast-failed");
      return false;
    }
    if(!this.persona.genero || this.persona.genero == "" ){
      this.configService.showToast2("genero incorrecto", "toast-failed");
      return false;
    }
    return true;
  }
}
