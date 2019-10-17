import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';
import { SportActivityPage } from '../sport-activity/sport-activity';
import { CardiacPage } from '../cardiac/cardiac';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { ItemsProvider } from '../../providers/items/items';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database"; 
import { HomePage } from '../home/home';
import { PersonaItem } from '../../models/persona-item/persona-item';
import { WeightChartPage } from '../weight-chart/weight-chart';


@IonicPage()
@Component({
  selector: 'page-score-board',
  templateUrl: 'score-board.html',
})
export class ScoreBoardPage {
  today:any;
  user:any = {
    nombre: "",
    facultad: {},
    score: 0,
    genero: "",
    mensaje: "",
  }
  person:PersonaItem;
  refPerson:any;
  refWHistory:any;
  facultad:any;
  facultades:any[] = [];
  months = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];

  changing_weight = false;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public configService: ConfigServiceProvider,
    public itemsService: ItemsProvider,
    private database: AngularFireDatabase,
    public alertController: AlertController,
    ) {
      if(navParams.data['persona']){
        this.facultad = navParams.data['persona'].facultad;
        this.user.nombre = navParams.data['persona'].nombres + " " + navParams.data['persona'].apellidos;
        this.user.score = this.itemsService.getScoreByCc(this.navParams.data['persona'].cedula);
        this.user.genero = navParams.data['persona'].genero;
        this.user.mensaje = navParams.data['persona'].mensaje;
        this.person = navParams.data['persona'];
      }
      if(this.user.mensaje && this.user.mensaje != ''){
        this.openMessage();
      }
      console.log(this.user);
      this.loadFacultades().then(()=>{
        this.loadUsers();
        this.topFacultades();
      });
  }

  ionViewDidLoad() {  
    this.today = new Date();
    console.log(this.today);
  }


  openActivity(){
    let personaKey = this.itemsService.getKeyByCc(this.navParams.data['persona'].cedula);
    this.navCtrl.push(SportActivityPage, {persona: personaKey, facultad: this.facultad});
  }


  openCardiac(){
    this.navCtrl.push(CardiacPage);
  }

  changeW(){
    if(this.changing_weight){
      this.changing_weight = false;
    }
    else{
      this.changing_weight = true;
    }
  }

  topFacultades(){
    for (let index = this.itemsService.itemsList2.length-1; index !=  (this.itemsService.itemsList2.length - 4); index--) {
      let elem = {
        key: this.itemsService.itemsList2[index].key, 
        id: this.itemsService.itemsList2[index].value.id, 
        nombre:this.itemsService.itemsList2[index].value.nombre, 
        score:this.itemsService.itemsList2[index].value.puntos
      }
      this.facultades.push(elem);
    }
    this.user.facultad = this.itemsService.facByName(this.facultad).value;
    console.log('Usuario final:' + this.user);
    
    
  }


  async loadFacultades(){
    return new Promise((resolve,reject)=>{
      try {
        var usersRef = this.database.database.ref("Facultad");
        usersRef.orderByChild('puntos').once("value").then(snapshot => {
          this.itemsService.clear2();
          snapshot.forEach(element => {
            let item = {
              key: element.key,
              value: element.val()
            }
            this.itemsService.itemsAdd2(item);
          });
          return resolve(snapshot);
        });
      } catch (err) {
        return reject(err);
        // console.log("nextPage() error>", err);
      }
    });
  }

  async loadUsers(){
    try {
      this.itemsService.clear();
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
      });
    } catch (err) {
      console.log("nextPage() error>", err);
    }
  }


  openMessage(){
    let alert = this.alertController.create({
      title: 'Mensaje',
      subTitle: this.user.mensaje,
      buttons: ['cerrar']
    });
    alert.present();
  }

  end(){
    this.createMessage();
  }

  createMessage(){
    let alert = this.alertController.create({
      title: 'Deja un mensaje para tu próxima actividad',
      inputs: [
        {
          name: 'mensaje',
          placeholder: 'Mensaje'
        },
      ],
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
          this.navCtrl.setRoot(HomePage);
          var usersRef = this.database.list("Usuario_mobil");
          usersRef.update(this.itemsService.getKeyByCc(this.navParams.data['persona'].cedula),{
            mensaje: data.mensaje,
          });
          }
        }
      ]
    });
    alert.present();
  }

  changeMass(event){
    if(!this.person.altura || !this.person.peso)
      return;

    try {
      let Imc:any = 0;
      let altura = this.person.altura;
      Imc = (parseFloat(this.person.peso)/(parseFloat(altura) * parseFloat(altura))).toFixed(0);

      const alert = this.alertController.create({
        title: 'Índice de masa corporal:',
        message: '' + Imc,
        buttons: [
          {
            handler: () => {
            }
          }, {
            text: 'Continuar',
            handler: () => {
              this.addScore();
              this.changeW();
            }
          }
        ]
      });
    
       alert.present();      
    } catch (error) {
      console.log(error);
      
    }
  }


  addScore(): void {
    let Imc:any = 0;
    let altura = this.person.altura;
    Imc = (parseFloat(this.person.peso)/(parseFloat(altura) * parseFloat(altura))).toFixed(0);

    let actualUsr = this.itemsService.getUserByKey(this.itemsService.getKeyByCc(this.navParams.data['persona'].cedula));
    this.refPerson = this.database.list("Usuario_mobil");
    this.refWHistory = this.database.list("Historial_peso");
    this.refPerson.update(actualUsr.key,{
      masaCorporal: Imc,
      peso: this.person.peso,
    });
    this.refWHistory.push({
      fecha: new Date() + "",
      persona: this.itemsService.getKeyByCc(this.navParams.data['persona'].cedula) + '',
      masaCorporal: Imc + '',
      peso: this.person.peso+'',
    });
  }
  
  pageW(){
    this.navCtrl.push(WeightChartPage, {personKey:this.itemsService.getKeyByCc(this.navParams.data['persona'].cedula) + ''});
  }


  pageH(){
    this.navCtrl.push(CardiacPage, {personKey:this.itemsService.getKeyByCc(this.navParams.data['persona'].cedula) + ''});
  }

}
