import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { NgxCarouselModule } from 'ngx-carousel';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DirectoryService } from './service/directory.service';
import { IndicatorService } from './service/indicator.service';

import { AppComponent } from './app.component';
import { MapNorthComponent } from './map-north/map-north.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { MapSouthComponent } from './map-south/map-south.component';
import { MapWestComponent } from './map-west/map-west.component';
import { MapEastComponent } from './map-east/map-east.component';
import { BookPanelComponent } from './book-panel/book-panel.component';


@NgModule({
  declarations: [
    AppComponent,
    MapNorthComponent,
    IndicatorComponent,
    MapSouthComponent,
    MapWestComponent,
    MapEastComponent,
    BookPanelComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    TabViewModule,
    AccordionModule,
    ButtonModule,
    NgxCarouselModule,
    PaginatorModule,
    ProgressSpinnerModule
  ],
  providers: [DirectoryService, IndicatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
