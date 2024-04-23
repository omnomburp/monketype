import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StatsComponent } from './stats/stats.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent
    }
    ,
    {
        path: 'stats/:WPM/:ACC',
        component: StatsComponent
    },
];
