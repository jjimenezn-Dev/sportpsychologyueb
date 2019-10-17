import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { CardiacPage } from '../cardiac/cardiac';
import { AngularFireDatabase } from "angularfire2/database";
import { Geolocation } from "@ionic-native/geolocation"
import leaflet from 'leaflet';
import { ActividadItem } from '../../models/actividad_fisica/actividad_fisica';
import { ItemsProvider } from '../../providers/items/items';

declare let L: any;

@IonicPage()
@Component({
  selector: 'page-sport-activity',
  templateUrl: 'sport-activity.html',
})
export class SportActivityPage {

  map: any;

  // data base object
  actividad_fisica = {} as ActividadItem;
  refActividad: any;

  //Bogotá
  city = null;
  lat = 4.678140188339319;
  lng = -74.05835908984375;
  map_zoom = 7;

  myPosition: any;

  //[0]lat  [1]lng
  recorrido:any[] = [];
  polyline:any;

  // tipo de actividad fisica {a pie, bicicleta}
  activity = { walk: true, bike: false, positions:[] };
  actividad = "Iniciar Actividad";
  // timer
  timer;
  maxTime: any = 0;
  maxcharge: any = 0;
  hidevalue: any = true;
  // referencia facultad
  refFacultad: any;

  //funcion timeout
  activity_timeOut:any;
  offlineAct = false;
  myranges = [];

  escala_borg = {
    0 :{porcentaje: '0%', pulsaciones:'60-80', mensaje:'Reposo total', puntos:0},
    1 :{porcentaje: '10%', pulsaciones:'70-90', mensaje:'Esfuerzo muy suave', puntos:1},
    2 :{porcentaje: '20%', pulsaciones:'90-110', mensaje:'Esfuerzo suave' , puntos:2},
    3 :{porcentaje: '30%', pulsaciones:'110-130', mensaje:'Esfuerzo moderado', puntos:3},
    4 :{porcentaje: '40%', pulsaciones:'120-140', mensaje:'Un poco duro', puntos:4},
    5 :{porcentaje: '50%', pulsaciones:'130-150', mensaje:'Esfuerzo duro', puntos:5},
    6 :{porcentaje: '60%', pulsaciones:'140-160', mensaje:'Esfuerzo duro', puntos:6},
    7 :{porcentaje: '70%', pulsaciones:'150-170', mensaje:'Esfuerzo muy duro', puntos:7},
    8 :{porcentaje: '80%', pulsaciones:'170-190', mensaje:'Esfuerzo muy duro', puntos:8},
    9 :{porcentaje: '90%', pulsaciones:'180-200', mensaje:'Esfuerzo muy duro', puntos:9},
    10:{porcentaje: '100%', pulsaciones:'190-220', mensaje:'Esfuerzo máximo', puntos:10},
}    

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private database: AngularFireDatabase,
    public geo: Geolocation,
    private platform: Platform,
    public itemsService: ItemsProvider,
    public alertController: AlertController,) {
      this.refActividad = this.database.list("Atividad_fisica");
      // clear DB by code
      //this.clearActivities()
      if(this.navParams.data){
        console.log("muajaja", this.navParams.data);
        this.actividad_fisica.persona = this.navParams.data['persona'];
      }
  }

  getPosition(){
    return new Promise((resolve,reject)=>{ 
      this.platform.ready().then(()=>{
        let watch = this.geo.watchPosition();
        watch.subscribe((data) => {
          console.log('response of gps>>', data);
         });
          this.geo.getCurrentPosition().then( resp =>{
          this.recorrido.push({
            lat: resp.coords.latitude,
            lng: resp.coords.longitude,
            spd: resp.coords.speed,
            alt: resp.coords.altitudeAccuracy,
          })
          return resolve()
        }).catch( err => {
          reject(err);
          console.log("Error obteniendo posicion");
          
        })
      });
    })
  }

  ionViewDidLoad() {
    this.platform.ready().then(()=>{
      this.loadMap();
    });
  }


  loadMap() {
    this.map = leaflet.map("map").fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 36
    }).addTo(this.map);
    this.map.locate({
      setView: true,
      maxZoom: 36
    }).on('locationfound', (e) => {
      this.myPosition = leaflet.featureGroup();
      let myPosition = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
        alert('Esta es mi posición!');
      });
      this.myPosition.addLayer(myPosition);
      this.map.addLayer(this.myPosition);
      this.map.setZoom(17);
      //this.map.dragging.disable();
    }).on('locationerror', (err) => {
      alert(err.message);
    })
  }


  selecIcon(tipe) {
    for (let act in this.activity) {
      if (act != tipe)
        this.activity[act] = false;
    }
    this.activity[tipe] = true;

  }


  startTime() {
    if (this.maxTime < 1){
      this.actividad = "Finalizar Actividad";
      this.timerOn();
    }
      else {
      if(!this.hidevalue){
        this.actividad = "Finalizar Actividad";
        this.hidevalue = true;
      }
      else{
        this.actividad = "Iniciar Actividad";
        this.hidevalue = false;
      }
    }
  }

  timerOn() {
    if(this.maxTime%10==0 && this.maxTime != 0){
      this.presentEffortAlert();
    }
    this.timer = setTimeout(x => {
      if (this.hidevalue) {
        this.maxTime += 1;
        this.timerOn();
      }
      else {
        this.timerOn();
      }
    }, 1000);
  }

  newActivity(){
    if(this.actividad != "Finalizar Actividad"){
      this.startTime();
      this.getPosition();
      this.startActivity();
    }
    else{
      this.startActivity(false);
    }
  }

  startActivity(action=true){
    if(action){
      this.startTime();
      if(!this.offlineAct)
        this.getPosition();
    }
    if(this.actividad == "Finalizar Actividad"){
      this.activity_timeOut = setTimeout(()=>
      {
        if(!this.offlineAct)
         this.getPosition();
        this.recorridoMapa();
        //console.log(this.recorrido);
        this.startActivity(false);
        //Tiempo de espera
      }, 3000);
    }
    else{
      if(this.maxcharge == 0){
        this.maxcharge = 1;
        this.calcDistancia().then(() => {
          this.actividad_fisica.Fecha = new Date() + "";
          this.actividad_fisica.Tiempo = this.transform2(this.maxTime);
          this.actividad_fisica.pasos = Number((this.actividad_fisica.distancia * 1000 / 0.7).toFixed(0));
          this.addScore(this.actividad_fisica.pasos);
          if(this.activity.walk)
            this.actividad_fisica.tipo_actividad = "PIE";
          if(this.activity.bike)
            this.actividad_fisica.tipo_actividad = "BICICLETA";
          //this.actividad_fisica.velocidad = this.velProm();
          this.actividad_fisica.altitud = this.altProm();
          //esfuerzo
          this.actividad_fisica.esfuerzo = this.caclEsfuerzo();
          this.presentAlertConfirm();
          this.refActividad.push(this.actividad_fisica);
        });
      }
    }
  }


  recorridoMapa(){
    this.polyline = new L.Polyline(this.recorrido, {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    });
    if (this.recorrido.length > 0){
      this.map.removeLayer(this.myPosition);
      this.myPosition = leaflet.featureGroup();
      let myPosition = leaflet.marker([this.recorrido[this.recorrido.length-1].lat, this.recorrido[this.recorrido.length-1].lng]).on('click', () => {
        alert('Esta es mi posición!');
      });
      this.myPosition.addLayer(myPosition);
      this.map.addLayer(this.myPosition);
    }
    this.polyline.addTo(this.map);
  }

  openCardiac() {
    this.navCtrl.push(CardiacPage);
  }


  toRadian(degree) {
    return degree*Math.PI/180;
  }

  calcDistancia(){
    return new Promise((resolve, reject) => {
      let dist = 0;
      if (this.recorrido.length > 1){
        for(let i in this.recorrido){
          if(parseInt(i) > 1  && this.recorrido[i] != this.recorrido[this.recorrido.length-1]){
            dist += this.getDistanceFromLatLonInKm(this.recorrido[parseInt(i)-1].lat, this.recorrido[parseInt(i)-1].lng, this.recorrido[i].lat, this.recorrido[i].lng);
          }
        }
      }
      
      this.actividad_fisica.distancia = Number(dist.toFixed(3));
      // function of vel = meters / seconds ^ 2
      this.actividad_fisica.velocidad = Number((((dist * 1000) / (this.maxTime * this.maxTime))*1000).toFixed(3));
      return resolve(1);
    });
  }


  velProm(){
    let total = 0;
    for(let e of this.recorrido){
      if(e.spd)
        total += e.spd
    }
    if (total > 0)
      return total / this.recorrido.length;
    return total;
  }


  altProm(){
    let total = 0;
    for(let e of this.recorrido){
      if(e.alt)
        total += e.alt
    }
    if (total > 0)
      return total / this.recorrido.length;
    return total;
  }


  getDistance(origin, destination) {
    // return distance in meters
    let lon1 = this.toRadian(origin[1]);
    let lat1 = this.toRadian(origin[0]);
    let lon2 = this.toRadian(destination[1]);
    let lat2 = this.toRadian(destination[0]);

    let deltaLat = lat2 - lat1;
    let deltaLon = lon2 - lon1;

    let a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    if(minutes > 9)
      if((value - minutes * 60) > 9)
        return minutes + ':' + (value - minutes * 60);
      else
        return  minutes + ':' + '0' + (value - minutes * 60);
    else
      if((value - minutes * 60) > 9)
        return '0' + minutes + ':' + (value - minutes * 60);
      else
        return  '0' + minutes + ':' + '0' + (value - minutes * 60);
 }

 //Value to data base
 transform2(value: number): string {
  const minutes: number = Math.floor(value / 60);
  if(minutes > 9)
    if((value - minutes * 60) > 9)
      return minutes + '.' + (value - minutes * 60);
    else
      return  minutes + '.' + '0' + (value - minutes * 60);
  else
    if((value - minutes * 60) > 9)
      return '0' + minutes + '.' + (value - minutes * 60);
    else
      return  '0' + minutes + '.' + '0' + (value - minutes * 60);
}

 volver(){
   if(this.actividad == "Finalizar Actividad"){
    this.startActivity()
   }
   else this.navCtrl.pop();
 }

 async presentAlertConfirm() {
  let actualUsr = await this.itemsService.getUserByKey(this.actividad_fisica.persona);
  console.log('sisisis'+ actualUsr);
  
  let act_message = 
    '<div class="act_titulo">Tiempo:</div><div style="border: solid 1px black !important;border-radius: 30px !important;text-align: center !important;margin: 5px !important;">' + this.actividad_fisica.Tiempo + '</div>' +
    '<div class="act_titulo">Esfuerzo:</div><div style="border: solid 1px black !important;border-radius: 30px !important;text-align: center !important;margin: 5px !important;">' + this.escala_borg[ this.actividad_fisica.esfuerzo].mensaje +' </div>' +
    '<div class="act_titulo">Aprox. Ritmo cardiaco:</div><div style="border: solid 1px black !important;border-radius: 30px !important;text-align: center !important;margin: 5px !important;">' + this.FormulaInvar(actualUsr.value.genero, actualUsr.value.edad) + '</div>'

  if(!this.offlineAct)
    act_message +=
    '<div class="act_titulo">distancia:</div><div style="border: solid 1px black !important;border-radius: 30px !important;text-align: center !important;margin: 5px !important;">' + this.actividad_fisica.distancia +' Km</div>' +
    '<div class="act_titulo">pasos:</div><div style="border: solid 1px black !important;border-radius: 30px !important;text-align: center !important;margin: 5px !important;">' + this.actividad_fisica.pasos +'</div>' 
   // +'<div class="act_titulo">tipo de actividad:</div><div style="border: solid 1px black !important;border-radius: 30px !important;text-align: center !important;margin: 5px !important;">' + this.actividad_fisica.tipo_actividad.toLowerCase() +'</div>';
  this.recorrido = [];
  this.polyline = [];
  this.maxTime = 0;
  clearTimeout(this.activity_timeOut);
  this.map.remove();
  const alert = await this.alertController.create({
    title: 'Actividad finalizada!',
    message: act_message,
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
  }

  presentEffortAlert(){
    let alert2 =  this.alertController.create({
      title: 'Esfuerzo',
      message:'suave(azul) a fuerte(naranja)',
      inputs: [
        {
          name: 'myrange',
          type: 'range',
          placeholder: 'Mensaje',
          min: 1,
          max: 10,
          
        },
      ],
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
          this.myranges.push(data.myrange);
          }
        }
      ]
    });
  alert2.present();
}

  addScore(value): void {
    let actualFac = this.itemsService.facByName(this.navParams.data.facultad);
    this.refFacultad = this.database.list("Facultad");
    this.refFacultad.update(actualFac.key,{
      puntos: parseInt(actualFac.value.puntos) + parseInt(value),
    });

    let actualUsr = this.itemsService.getUserByKey(this.actividad_fisica.persona);
    this.refFacultad = this.database.list("Usuario_mobil");
    this.refFacultad.update(actualUsr.key,{
      puntos: parseInt(actualUsr.value.puntos) + parseInt(value),
    });
    this.itemsService.changeValues(value, actualUsr.key, actualFac.key);
  }

  clearActivities(){
    
    this.database.list("Atividad_fisica").remove().then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
    
  }

  onToggleChange(){
    console.log('entra');
    
    if(this.offlineAct){
      let alert = this.alertController.create({
        title: 'Al activar estado estático no se tendrá en cuenta tu distancia recorrida',
        buttons: [
          {
            text: 'Ok',
            
          }
        ]
      });
      alert.present();
    }
  }

  FormulaInvar(gender:string, age:number ) {
    console.log(gender + '///'+age);
    
    let frecuencia_gender = gender === 'Masculino'? 220 : 226;
    return frecuencia_gender-age;
  }

  caclEsfuerzo(){
    if(this.myranges.length == 0){
      return this.escala_borg[0].puntos;
    }
    let val = 0
    for (const iterator of this.myranges) {
      if(Number.isInteger(iterator))
        val += Number.parseInt( iterator);
      else
        val += 5;
    }
    let index = (val/(this.myranges.length)).toFixed(0);
    console.log(this.myranges);
    
    console.log(index + '= '+ val + '/' + this.myranges.length.toFixed(0));
    
    return this.escala_borg[index].puntos;
  }
}
