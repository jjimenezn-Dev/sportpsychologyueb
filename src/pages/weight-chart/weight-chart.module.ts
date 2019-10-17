import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeightChartPage } from './weight-chart';

@NgModule({
  declarations: [
    WeightChartPage,
  ],
  imports: [
    IonicPageModule.forChild(WeightChartPage),
  ],
})
export class WeightChartPageModule {}
