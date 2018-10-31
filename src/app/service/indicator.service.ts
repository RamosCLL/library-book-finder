import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

declare var JSON: any;
import * as _ from 'lodash';
import { DirectoryService } from './directory.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

declare var API: any;

@Injectable()
export class IndicatorService {

  data: any;
  books: any;

  constructor(private http: Http, private service: DirectoryService) { }

  search(query, shelf = null): Observable<{results: any, indicators: any[][]}> {
    return this.service.searchBooks(query)
      .map((res: any) => {
        let results = res;
        if(shelf){
          results = results.filter(book => book.shelf == parseInt(shelf.replace('S.','')));
          return { results , indicators : [[],[],[],[]] };
        } else {
          let foundResults = [];
          results.forEach(book => {
            const wings = {North: 0,East: 1,South: 2,West: 3}
            foundResults = [...foundResults, ...[{shelf: book.shelf, wing: wings[book.wing]}]];
          })
          let indicators = _.uniqBy(foundResults, 'shelf');
          let letIndicatorDict =  _.chain(indicators).groupBy('wing').value();
          indicators[0] = letIndicatorDict[0];
          indicators[1] = letIndicatorDict[1];
          indicators[2] = letIndicatorDict[2];
          indicators[3] = letIndicatorDict[3];
          return { results , indicators };  
        }
      })
      .flatMap(search => {
        if (search.results.length > 0) {
          return Observable.forkJoin(
            this.mapNearbyBooks(search)
          ).map(books => {
            return {results: books, indicators: search.indicators}
          })
        }
        return Observable.of({results:search.results, indicators: search.indicators });
      });
  } 
  
  getNearBooks(book): Observable<any>{
    let nearby = []
    if(book.nearby[0].includes('[')){
      nearby = book.nearby[0].match(/\'(.*?)\'/i);
      nearby = nearby.map(x => x.replace('\'','').replace('\'',''));
    } else {
      nearby = book.nearby;
    }
    return Observable.forkJoin(
      nearby.map(bookId => {
        return this.service.getBookInfo(bookId)
      })
    )
  }

  mapNearbyBooks(search){
    return search.results.map(book => {
      book.showCarousel = false;
      if(book.nearby){
        return this.getNearBooks(book).flatMap(books => {
          book.nearbyBooks = books
          return Observable.of(book)
        })
      } else {
        return Observable.of(book)
      }
    })
  }

  getBooksOnShelfCategory(shelf, category): Observable<any> {
    return Observable.forkJoin(
        this.service.getBooksOnCategory(category),
        this.service.getShelfInfo(shelf))
      .flatMap(([books, shelf]) => {
        return Observable.of({ results: books, shelf })
      })
      .flatMap(search => {
        if (search.results.length > 0) {
          return Observable.forkJoin(
            this.mapNearbyBooks(search)
          ).map(books => {
            return {results: books, shelf: search.shelf}
          })
        }
        return Observable.of({results:search.results, shelf: search.shelf });
      });
  }

}
