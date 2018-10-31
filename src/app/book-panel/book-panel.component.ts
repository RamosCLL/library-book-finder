import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-book-panel',
  templateUrl: './book-panel.component.html',
  styleUrls: ['./book-panel.component.scss']
})
export class BookPanelComponent implements OnInit {

  toggle: boolean = false;
  category: any;
  shelf: any;
  books: any[] = [];
  slideConfig: any;
  searchMode: boolean = false;
  rows: number = 5;
  length: number = 0;
  bookChunks: any[] = [];
  loading: boolean = true;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.init();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const sidebarInside = document.getElementById('sidebar-wrapper').contains(targetElement);
    const insideMobileHeader = document.querySelector('.mobile-header .search-box').contains(targetElement);
    const clickedInside = this.element.nativeElement.contains(targetElement);
    const clickedShelf = this.searchMode && (targetElement.nodeName == 'text' || targetElement.nodeName == 'path');
    if (!clickedInside && !sidebarInside && !clickedShelf && !insideMobileHeader) {
      this.toggle = false;
      this.onClose.emit(!this.isMobile);
    }
  }

  get isMobile(){
    let mobileButton: any = document.querySelector('.mobile-only');
    return mobileButton.offsetHeight > 0;
  }

  hidePanel(event){
    if(event){
      try {
        event.preventDefault();
      } catch{};
    }
    this.toggle = false;
    this.onClose.emit(true);
  }

  togglePanel(data) {
    this.toggleData(data);
    this.toggle = !this.toggle;
    if(!this.toggle){
      this.onClose.emit(true);
    }
  }

  toggleData(data){
    const bookPanel = document.querySelector('.book-panel-box');
    const bookPanelHeight = bookPanel.clientHeight;
    this.rows = Math.floor( bookPanelHeight / 160 );

    this.category = data.category;
    this.shelf = data.shelf;
    this.books = data.books;
    this.loading = data.loading;
    this.length = this.books.length;
    if(this.length > 0){
      this.bookChunks = this.chunk(this.books, this.rows);
      this.books = this.bookChunks[0];
    }
    this.searchMode = data.search;
    if(this.searchMode) {
      this.shelf = { ...this.shelf ,label: 'Search results for' };
      this.category = { ...this.category ,label: data.query };
    }
  }

  paginate(event){
    this.books = this.bookChunks[event.page];
  }

  chunk(a, l) { 
    if (a.length == 0) return []; 
    else return [a.slice(0, l)].concat(this.chunk(a.slice(l), l)); 
  }


  toggleCarousel(event, book){
    event.preventDefault();
    book.showCarousel = !book.showCarousel;
  }

  init() {
    this.slideConfig = {
      grid: {xs: 1, sm: 1, md: 3, lg: 5, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true
      },
      load: 2,
      loop: true,
      custom: 'banner'
    };
  }
}
