import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import 'leaflet';

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

  map:any;

  //Bogotá
  city = null;
  lat = 4.678140188339319;
  lng = -74.05835908984375;
  map_zoom = 7;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }


  loadMap() {
    this.map = L.map('mapId').setView([this.lat, this.lng], this.map_zoom);
    
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }
}
