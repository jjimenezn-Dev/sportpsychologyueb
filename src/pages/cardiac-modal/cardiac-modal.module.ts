import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardiacModalPage } from './cardiac-modal';

@NgModule({
  declarations: [
    CardiacModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CardiacModalPage),
  ],
})
export class CardiacModalPageModule {}
