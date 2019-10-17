import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { PubNubAngular } from 'pubnub-angular2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Flashlight } from '@ionic-native/flashlight';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { AngularFireDatabase } from 'angularfire2/database';
//import { heartbeat } from '../../../plugins/com.wilco124124.cordova.plugins.heartbeat/www/heartbeat.js';


@IonicPage()
@Component({
  selector: 'page-cardiac',
  templateUrl: 'cardiac.html',
})
export class CardiacPage {
  refRithm:any;
  // attributes

  measuring = false;
  connectionB = false;

  value = '--';

  constructor(public navCtrl: NavController, public navParams: NavParams,
        public platform: Platform,
        public configService: ConfigServiceProvider,
    public alertController: AlertController,
    private database: AngularFireDatabase,
    ) {        
      this.configService.showLoader("Verificando Conexión Bluetooth");
          this.connectionCheck()
    }
  
    connectionCheck(){
      setTimeout(() => {
        this.connectionB = true;
        
        this.configService.dismissAllLoaders();
      }, 8000);
    }

    read_cardiac(){
     this.measuring = true; 
    this.value = '--';

     const alert = this.alertController.create({
      title: 'Reviza tener tu dispositivo conectado',
      buttons: [
        {
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.value = '0';
            this.refRithm = this.database.database.ref("Sport");       
            this.changeRithm();
            setTimeout(() => {
             this.measuring = false; 
            }, 15000);
            
          }
        }
      ]
    });
  
     alert.present(); 
    }

    changeRithm(){
      setTimeout(() => {
        var rithmVal = '0';
        this.refRithm.orderByChild('time').once("value").then(snapshot => {
        snapshot.forEach(element => {
          let item = {
            key: element.key,
            value: element.val()
          }
          rithmVal = item.value.BPM.toFixed(0) + '';
          
        });   
        this.value = rithmVal;
      
        if(this.measuring)
          this.changeRithm() 
      });
      }, 3000);
    }

  back(){
    this.navCtrl.pop();
  }
}
