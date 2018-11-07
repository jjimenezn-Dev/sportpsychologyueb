import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ScoreBoardPage } from '../pages/score-board/score-board';
import { CardiacPage } from '../pages/cardiac/cardiac';
import { FormPage } from '../pages/form/form';
import { SportActivityPage } from '../pages/sport-activity/sport-activity';

import { CardiacModalPage } from '../pages/cardiac-modal/cardiac-modal';
import { Geolocation } from '@ionic-native/geolocation';
import { ConfigServiceProvider } from '../providers/config-service/config-service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ScoreBoardPage,
    CardiacPage,
    FormPage,
    SportActivityPage,
    CardiacModalPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ScoreBoardPage,
    CardiacPage,
    FormPage,
    SportActivityPage,
    CardiacModalPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigServiceProvider
  ]
})
export class AppModule {}
