import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router : Router) { }

  getPosts(){
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts').pipe(
      map(
        (postData) => {
          return postData.posts.map(
            (post) => {
              return {
                title: post.title,
                Content: post.Content,
                id: post._id
              }
            }
          )
        }
      )
    ).subscribe(
      (transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      }
    );
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string){
    // console.log(this.posts)
    return this.http.get<{_id: string, title: string, Content: string}>('http://localhost:3000/api/posts/'+id);
  }

  addPost(title: string, Content: string){
    const post: Post = {id: null, title: title, Content: Content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe(
      (responseData)=>{
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      }
    );
  }

  updatePost(id: string, title: string, Content: string) {
    const post : Post = {
      id: id,
      title: title,
      Content: Content
    }
    this.http.put<{message: string}>('http://localhost:3000/api/posts/' + id, post)
    .subscribe(
      (response)=>{
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p=>p.id === post.id );
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      }
    );
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId).subscribe(
      () => {
        const updatedPost = this.posts.filter(
          (post) => post.id != postId
        );
        this.posts = updatedPost;
        this.postUpdated.next([...this.posts]);
      }
    );
  }

}
