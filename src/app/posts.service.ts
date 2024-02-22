import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };

    this.http
      .post<{ name: string }>(
        'https://angular-http-basic-548e2-default-rtdb.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response',
        }
      )
      .subscribe(
        (respnseData) => {
          console.log(respnseData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    let searchParmas = new HttpParams();
    searchParmas = searchParmas.append('print', 'pretty');
    searchParmas = searchParmas.append('custom', 'key');
    return this.http
      .get<{ [key: string]: Post }>(
        'https://angular-http-basic-548e2-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({ 'custom-Header2': 'Hello' }),
          params: searchParmas,
        }
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          //send to analytics server
          return throwError(errorRes);
        })
      );
  }
  deletePosts() {
    return this.http
      .delete(
        'https://angular-http-basic-548e2-default-rtdb.firebaseio.com/posts.json',
        {
          observe: 'events',
          responseType: "text",
        }
      )
      .pipe(
        tap((event) => {
          console.log(event);
          if(event.type === HttpEventType.Sent){
            //..
          }
        if(event.type === HttpEventType.Response)
        console.log(event.body);
        })
      );
  }
}
