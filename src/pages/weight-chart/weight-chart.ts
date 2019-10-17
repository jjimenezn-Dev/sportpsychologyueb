import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from "chart.js";
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-weight-chart',
  templateUrl: 'weight-chart.html',
})
export class WeightChartPage {
  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("barCanvas") canvasMasa: ElementRef;

  private barChart: Chart;
  private chartMasa: Chart;
  loadedDataPeso;
  loadedDataMasa;
  labels = [];
  actividades = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public database: AngularFireDatabase, public configService: ConfigServiceProvider,) {
  }

  ionViewDidLoad() {
    this.loadInfo();
  }
  
  async loadInfo() {
    this.loadedDataPeso = [];
    this.loadedDataMasa = [];
    try {
      this.configService.showLoader("Cargando");
      let historyRef = this.database.database.ref("Historial_peso");
      await historyRef.once("value").then(snapshot => {
        snapshot.forEach(element => {
          let item = {
            key: element.key,
            value: element.val()
          }
          if(this.navParams.data.personKey && item.value.persona == this.navParams.data.personKey){
            this.loadedDataPeso.push(Number.parseInt( item.value.peso));
            this.loadedDataMasa.push(Number.parseInt( item.value.masaCorporal));
            this.labels.push('');
          }
        });
        this.configService.dismissAllLoaders();
      });
      this.createChart()
    } catch (err) {
        this.configService.dismissAllLoaders();
        console.log("loadInfo() error>", err);
    }
  }

  createChart() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "line",
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "Masa corporal",
            data: this.loadedDataMasa.map((val=>{return val})),
            backgroundColor: [
              "rgba(255, 206, 86, 0.2)",
            ],
            borderColor: [
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1
          },
          {
            label: "Peso",
            data: this.loadedDataPeso.map((val=>{return val})),
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1
          },
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

  }

  back(){
    this.navCtrl.pop();
  }
}
