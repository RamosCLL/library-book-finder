import { OnInit } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { DirectoryService } from './service/directory.service';
import { BookPanelComponent } from './book-panel/book-panel.component';
import { MapNorthComponent } from './map-north/map-north.component';
import { MapEastComponent } from './map-east/map-east.component';
import { MapSouthComponent } from './map-south/map-south.component';
import { MapWestComponent } from './map-west/map-west.component';
import { IndicatorService } from './service/indicator.service';

declare var Defiant: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'app';
  data: any;
  wings = [];
  shelfs = [];
  books: any;
  activeWing: number = 0;
  activeShelf: string = '';
  openedCategory: string;
  query: string = '';
  isSearchMode: boolean =  false;
  bookSnapshot: any;
  _found: any;
  isOpen: boolean;

  set found(value){
    this._found = value;
    for(let i = 0; i < 4; i++){
      if(value[i]){
        this.toggleWingIndicator(i, value[i].length > 0);
      } else {
        value[i] = [];
        this.toggleWingIndicator(i, false);
      }
    }
  }

  get found() {
    return this._found;
  }

  @ViewChild(BookPanelComponent) bookPanel: BookPanelComponent;
  @ViewChild('mapNorth') mapNorth: MapNorthComponent;
  @ViewChild('mapEast') mapEast: MapEastComponent;
  @ViewChild('mapSouth') mapSouth: MapSouthComponent;
  @ViewChild('mapWest') mapWest: MapWestComponent;
  
  constructor(private service: DirectoryService, private indicatorService: IndicatorService) {}

  ngOnInit(): void {
    this.found = [[],[],[],[]];
    this.wings = [
      { label: 'North Wing', value: 'north'},
      { label: 'East Wing', value: 'east'},
      { label: 'South Wing', value: 'south'},
      { label: 'West Wing', value: 'west'},
    ];
    this.loadShelf({index: 0});
  }
  
  loadShelf(event){
    this.activeWing = event.index;
    this.service.getShelvesOnWing(this.wings[this.activeWing].value).subscribe((shelves) => {
      this.shelfs = [...shelves];
    })
  }
  
  shelfClick(data){
    setTimeout(()=>{
      let sidebarWrapper = document.getElementById('sidebar-wrapper');
      let element = document.getElementById(`shelf-${data.shelf}`);
      this.scrollTo(sidebarWrapper, element.offsetTop - 55, 100);
    }, 400);
    // need this much delay to get new position after preceding transitions
    this.activeShelf = data.shelf;
    this.isOpen = true;
    if(data.found) {
      this.search(null, data.shelf, data.found);
    }
  }
  
  wingClick(wing){
    this.loadShelf({index: wing});
  }
  
  onTabOpen(event) {
    this.activeShelf = this.shelfs[event.index].value;
    this.resetShelfActive(parseInt(this.activeShelf.replace('S.','')));
  }
  
  onTabClose(event) {
    this.activeShelf = '';
    this.resetShelfActive(0);
  }
  
  resetShelfActive(shelf) {
    switch(this.activeWing){
      case 0:
        this.mapNorth.activeShelf = shelf;
        break;
      case 1:
        this.mapEast.activeShelf = shelf;
        break;
      case 2:
        this.mapSouth.activeShelf = shelf;
        break;
      case 3:
        this.mapWest.activeShelf = shelf;
        break;
    }
  }
  
  openPanel(event, category){
    event.preventDefault();
    if(this.openedCategory != category.value && this.bookPanel.toggle){
      this.bookPanel.toggleData({category,shelf: '',books: [],search: false,loading: true});
    } else {
      this.bookPanel.togglePanel({category,shelf: '',books: [],search: false,loading: true});
    }
    this.indicatorService.getBooksOnShelfCategory(this.activeShelf, category.value)
      .subscribe(result => {
        const data = {
          category,
          shelf: result.shelf,
          books: result.results,
          search: false,
          loading: false
        }

        this.bookPanel.toggleData(data);
        
        this.openedCategory = category.value;
        if(this.isMobile){
          this.isOpen = false;
        }
      }, error => {
        this.bookPanel.toggleData({category,shelf: '',books: [],search: false,loading: false});
      });
  }

  get isMobile(){
    let mobileButton: any = document.querySelector('.mobile-only');
    return mobileButton.offsetHeight > 0;
  }
  
  scrollTo(element, to, duration) {
    if (duration <= 0) return;
    let difference = to - element.scrollTop;
    let perTick = difference / duration * 10;
    
    setTimeout(() => {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop == to) return;
      this.scrollTo(element, to, duration - 10);
    }, 10);
  };
  
  search(event, shelf = null, found = false){
    if(this.query.length < 1) {
      this.bookPanel.hidePanel(event);
      this.isSearchMode = false;
      this.found = [[],[],[],[]];
      return;
    }
    if((!this.isSearchMode && !this.bookPanel.toggle) || (found && !this.bookPanel.toggle)){
      this.bookPanel.togglePanel({books: [], loading: true, search: true, query: this.query});
    } else {
      this.bookPanel.toggleData({books: [], loading: true, search: true, query: this.query});
    }
    this.indicatorService.search(this.query, shelf).subscribe(result => {
      if(shelf == null){
        this.found = [
          result.indicators[0],
          result.indicators[1],
          result.indicators[2],
          result.indicators[3]
        ]
      }

      this.bookPanel.toggleData({books: result.results, loading: false, search: true, query: this.query});

      this.isSearchMode = true;
      if(this.isMobile){
        this.isOpen = false;
      }
    }, err => {
      this.bookPanel.toggleData({books: [], loading: false, search: true, query: this.query});
    });
  }

  bookPanelClose(normal){
    if(this.isMobile && !this.isSearchMode && normal){
      this.isOpen = true;
    }
    this.isSearchMode = false;
  }

  toggleWingIndicator(wing, add){
    if(document.querySelector('.ui-tabview-nav')){
      let tab = document.querySelector('.ui-tabview-nav').children[wing]
      if(add){
        tab.classList.add('shelves-found');
      } else {
        tab.classList.remove('shelves-found');
      }
    }
  }
}
