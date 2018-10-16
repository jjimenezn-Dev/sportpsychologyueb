import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CardiacPage } from '../cardiac/cardiac';
import leaflet from 'leaflet';

declare let L: any;
/**
 * Generated class for the SportActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sport-activity',
  templateUrl: 'sport-activity.html',
})
export class SportActivityPage {

  map: any;

  //Bogotá
  city = null;
  lat = 4.678140188339319;
  lng = -74.05835908984375;
  map_zoom = 7;

  // tipo de actividad fisica {a pie, bicicleta}
  activity = { walk: true, bike: false };
  actividad = "Iniciar Actividad";
  // timer
  timer;
  maxTime: any = 0;
  hidevalue: any = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.timer = 0;
  }

  ionViewDidLoad() {
    this.loadMap();
  }


  loadMap() {
    this.map = leaflet.map("map").fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    this.map.locate({
      setView: true,
      maxZoom: 10
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


  openCardiac() {
    this.navCtrl.push(CardiacPage);
  }
}
