import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { PersonalPage } from '../pages/personal/personal';
import { UpcomingPage } from '../pages/upcoming/upcoming';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { FilterDatePage } from '../pages/filterdate/filterdate'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { EventCard } from '../components/event-card/event-card';
import { AuthData } from '../providers/auth-data';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
    declarations: [
        MyApp,
        HelloIonicPage,
        ItemDetailsPage,
        ListPage,
        LoginPage,
        PersonalPage,
        UpcomingPage,
        ResetPasswordPage,
        SignupPage,
        EventCard,
        TabsPage,
        FilterDatePage
    ],
    imports: [
        IonicModule.forRoot(MyApp)

    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HelloIonicPage,
        ItemDetailsPage,
        LoginPage,
        PersonalPage,
        UpcomingPage,
        ListPage,
        EventCard,
        ResetPasswordPage,
        SignupPage,
        TabsPage,
        FilterDatePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler }, 
        AuthData
    ]
})
export class AppModule { }
