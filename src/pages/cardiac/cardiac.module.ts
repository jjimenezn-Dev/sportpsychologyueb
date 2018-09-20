import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardiacPage } from './cardiac';

@NgModule({
  declarations: [
    CardiacPage,
  ],
  imports: [
    IonicPageModule.forChild(CardiacPage),
  ],
})
export class CardiacPageModule {}
