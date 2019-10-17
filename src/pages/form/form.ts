import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ScoreBoardPage } from '../score-board/score-board';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database"; 

import { PersonaItem } from '../../models/persona-item/persona-item';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { ItemsProvider } from '../../providers/items/items';

@IonicPage()
@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
})
export class FormPage {
  persona = {} as PersonaItem; 
  refPersona: any;
  refFacultad: any;
  altura1: Number;
  altura2: Number;
  facultades = ['Creación y Comunicación',
    'Docencia',
    'Medicina',
    'Odontología',
    'Ciencias',
    'Enfermería',
    'Humanidades',
    'Educación',
    'Psicología',
    'Ciencias Económicas y Administrativas',
    'Ingeniería',
    'Ciencias Políticas y Jurídicas',
    // Si existen mas facultades agregar a partir de aca ...
  ]


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private database: AngularFireDatabase,
    public configService: ConfigServiceProvider,
    public itemsService: ItemsProvider,
    public alertController: AlertController,){
      /* codigo para rellenar facultades 
      this.refFacultad = database.list("Facultad");
      for (let index = 0; index < this.facultades.length; index++) {
        let elem = {
          'id': index,
          'nombre':this.facultades[index], 
          'posicion': 0,
          'puntos':0
        };     
        this.refFacultad.push(elem); 
      }
      */
      this.refPersona = database.list("Usuario_mobil");
      console.log("Ref persona ---",this.refPersona);
      
      if(this.navParams.data['cedula']){
        this.persona.cedula = Number(this.navParams.data['cedula']);
      }
      this.persona.puntos = 0;
      this.persona.mensaje = "";
    }


  openScoreBoard(){
    if (this.validateFields()){
      this.addPersona();
      this.navCtrl.setRoot(ScoreBoardPage, {"persona":this.persona});
    }
  }


  addPersona(){
    //Indice de masa corporal
    try {
      this.persona.masaCorporal = '' + (parseFloat(this.persona.peso) / (parseFloat(this.persona.altura) * parseFloat(this.persona.altura))).toFixed(0);
      
    } catch (error) {
      this.persona.masaCorporal = '';
    }

    this.refPersona.push(this.persona);
    let valAux = {value : this.persona}
    this.itemsService.itemsAdd(valAux);
  }


  validateFields(){
    if(!this.persona.cedula || this.persona.cedula == 0){
      this.configService.showToast2("cédula incorrecta", "toast-failed");
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
    if(!this.persona.semestre || this.persona.semestre == ""){
      this.configService.showToast2("semestre incorrecto", "toast-failed");
      return false;
    }
    this.persona.altura = this.altura1 + "." + this.altura2 + "";
    if(!this.altura1 || !this.altura2 || this.persona.altura == ""){
      this.configService.showToast2("altura incorrecta", "toast-failed");
      return false;
    }
    this.persona.peso = this.persona.peso + '';
    if(!this.persona.peso || this.persona.peso == ""){
      this.configService.showToast2("peso incorrecto", "toast-failed");
      return false;
    }
    if(!this.persona.edad || this.persona.edad > 100){
      this.configService.showToast2("edad incorrecta", "toast-failed");
      return false;
    }
    if(!this.persona.genero || this.persona.genero == "" ){
      this.configService.showToast2("género incorrecto", "toast-failed");
      return false;
    }
    return true;
  }

  async onBlur(event){
    if(!this.altura1 || !this.altura2 || !this.persona.peso)
      return;

    try {
      let Imc:any = 0;
      let altura = this.altura1 + "." + this.altura2;
      Imc = (parseFloat(this.persona.peso)/(parseFloat(altura) * parseFloat(altura))).toFixed(0);

      const alert = await this.alertController.create({
        title: 'Índice de masa corporal:',
        message: '' + Imc,
        buttons: [
          {
            handler: () => {
            }
          }, {
            text: 'Continuar',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      });
    
      await alert.present();      
    } catch (error) {
      console.log(error);
      
    }

  }
}
