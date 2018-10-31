import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

declare var API: any;

@Injectable()
export class DirectoryService {

  constructor(private http: Http) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append(API.key, API.value); 
  }

  // api that are currently being used

  getBookInfo(bookId): Observable<any> {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = API.config.books.info.replace(':id',bookId);
    return this.http.get(url, {headers})
      .map((res: any) => res.json()[""]);
  }

  getShelvesOnWing(wingId){
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = API.config.shelves.fromWing.replace(':wing',wingId);
    return this.http.get(url, {headers})
      .map((res: any) => res.json()[""]);
  }

  getBooksOnCategory(categoryId){
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = API.config.books.byCategory.replace(':id',categoryId);
    return this.http.get(url, {headers})
      .map((res: any) => res.json()[""]);
  }

  getShelfInfo(shelfId){
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = API.config.shelves.info.replace(':id',shelfId);
    return this.http.get(url, {headers})
      .map((res: any) => res.json()[""]);
  }

  searchBooks(query){
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = API.config.books.search.replace(':query',query);
    return this.http.get(url, {headers})
      .map((res: any) => res.json()[""]);
  }

}