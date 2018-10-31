import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-map-west',
  templateUrl: './map-west.component.html',
  styleUrls: ['./map-west.component.scss']
})
export class MapWestComponent implements OnInit {

  _found: any[] = [];

  @Input() 
  set found(value){
    this._found = value.map(x => x.shelf);
  }

  get found(){
    return this._found;
  }
  
  @Output() onShelfClick: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  activeShelf: number;

  ngOnInit() {
  }

  emitShelf(shelf){
    this.activeShelf = shelf;
    this.onShelfClick.emit({ shelf: `S.${shelf}`, found: this.isFound(shelf)});
  }

  isFound(shelf){
    return this.found.includes(shelf);
  }

}
