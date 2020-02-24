import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor() { }

  getPosts(){
    return [...this.posts]
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, Content: string){
    const post: Post = {title: title, Content: Content};
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }

}
