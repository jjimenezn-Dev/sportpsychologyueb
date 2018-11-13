import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { CardiacPage } from '../cardiac/cardiac';
import { AngularFireDatabase } from "angularfire2/database";
import { Geolocation } from "@ionic-native/geolocation"
import leaflet from 'leaflet';
import { ActividadItem } from '../../models/actividad_fisica/actividad_fisica';

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

  //[0]lat  [1]lng
  recorrido:any[] = [];
  polyline:any;

  // tipo de actividad fisica {a pie, bicicleta}
  activity = { walk: true, bike: false, positions:[] };
  actividad = "Iniciar Actividad";
  // timer
  timer;
  maxTime: any = 0;
  hidevalue: any = true;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private geo: Geolocation,
    private platform: Platform) {

      this.refActividad = this.database.list("Atividad_fisica");
      console.log("Ref actividad ---",this.refActividad);

      if(this.navParams.data['persona']){
        this.actividad_fisica.persona = this.navParams.data['persona'];
      }
  }

  getPosition(){
    return new Promise((resolve,reject)=>{
      this.platform.ready().then(()=>{
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
    this.loadMap();
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
      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
        alert('Marker clicked');
      })
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
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
      this.actividad = "Pausar Actividad";
      this.timerOn();
    }
      else {
      if(!this.hidevalue){
        this.actividad = "Pausar Actividad";
        this.hidevalue = true;
      }
      else{
        this.actividad = "Iniciar Actividad";
        this.hidevalue = false;
      }
    }
  }

  timerOn() {
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

  startActivity(action=true){
    if(action){
      this.startTime();
      this.getPosition();
    }
    if(this.actividad == "Pausar Actividad"){
      setTimeout(()=>
      {
        if(this.actividad == "Iniciar Actividad")
          return;
        this.getPosition();
        this.recorridoMapa();
        console.log(this.recorrido);
        this.startActivity(false);
      }, 50000);
    }
    else{
      this.calcDistancia().then(() => {
        this.actividad_fisica.Fecha = new Date() + "";
        this.actividad_fisica.Tiempo = this.maxTime;
        this.actividad_fisica.pasos = this.actividad_fisica.distancia * 1 / 0.8;
        if(this.activity.walk)
          this.actividad_fisica.tipo_actividad = "PIE";
        if(this.activity.bike)
          this.actividad_fisica.tipo_actividad = "BICICLETA";
        this.actividad_fisica.velocidad = this.velProm();
        this.actividad_fisica.altitud = this.altProm();

        this.refActividad.push(this.actividad_fisica);
      });
    }
  }


  recorridoMapa(){
    this.polyline = new L.Polyline(this.recorrido, {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
  });
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
      for(let i in this.recorrido){
        if(this.recorrido[i] != this.recorrido[this.recorrido.length-1] && this.recorrido.length > 1){
          dist += this.getDistance(this.recorrido[i], this.recorrido[parseInt(i)+1]);
        }
      }
      this.actividad_fisica.distancia = dist;
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

}
