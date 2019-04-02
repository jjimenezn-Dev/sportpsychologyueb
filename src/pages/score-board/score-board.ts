import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';
import { SportActivityPage } from '../sport-activity/sport-activity';
import { CardiacPage } from '../cardiac/cardiac';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { ItemsProvider } from '../../providers/items/items';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database"; 
import { HomePage } from '../home/home';


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
    genero: ""
  }
  facultad:any;
  facultades:any[] = [];
  months = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public configService: ConfigServiceProvider,
    public itemsService: ItemsProvider,
    private database: AngularFireDatabase,
    ) {
      if(navParams.data['persona']){
        this.facultad = navParams.data['persona'].facultad;
        this.user.nombre = navParams.data['persona'].nombres + " " + navParams.data['persona'].apellidos;
        this.user.score = navParams.data['persona'].puntos;
        this.user.genero = navParams.data['persona'].genero;
        
      }
      console.log(this.user);
      this.loadFacultades().then(()=>{
        this.topFacultades();
      });
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


  topFacultades(){
    for (let index = this.itemsService.itemsList2.length-1; index !=  (this.itemsService.itemsList2.length - 4); index--) {
      let elem = {
        id: this.itemsService.itemsList2[index].value.id, 
        nombre:this.itemsService.itemsList2[index].value.nombre, 
        score:this.itemsService.itemsList2[index].value.puntos
      }
      this.facultades.push(elem);
    }
    this.user.facultad = this.itemsService.facByName(this.facultad);
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


  openMessage(){

  }

  end(){
    this.openMessage();
    this.navCtrl.setRoot(HomePage);
  }
}
