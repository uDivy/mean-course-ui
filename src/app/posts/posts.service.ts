import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment'

import { Post } from './post.model';
const BACKEND_URL = environment.apiUrl+"/posts/";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router : Router) { }

  // fetching all the posts
  getPosts(postsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts : number }>(BACKEND_URL+queryParams).pipe(
      map(
        (postData) => {
          return { posts:  postData.posts.map(
            (post) => {
              return {
                title: post.title,
                Content: post.Content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }
          ), maxPosts: postData.maxPosts
        };
        }
      )
    ).subscribe(
      (transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postUpdated.next({posts: [...this.posts],
        postCount: transformedPostData.maxPosts});
      }
    );
  }

  // to fetch the subject created
  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  // to fetch the post by id
  getPost(id: string){
    // console.log(this.posts)
    return this.http.get<{
      _id: string,
      title: string,
      Content: string,
      imagePath: string,
      creator: string
    }>(BACKEND_URL+id);
  }

  // to add a new post
  addPost(title: string, Content: string, image: File){
    const postData = new FormData();
    postData.append("title",title);
    postData.append("Content",Content);
    postData.append("image", image, title )
    this.http.post<{message: string, post: Post}>(BACKEND_URL, postData)
    .subscribe(
      (responseData)=>{
        this.router.navigate(["/"]);
      }
    );
  }

  // to update a old post
  updatePost(id: string, title: string, Content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) == 'object'){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("Content", Content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        Content: Content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put<{message: string}>(BACKEND_URL+ id, postData)
    .subscribe(
      (response)=>{
        this.router.navigate(["/"]);
      }
    );
  }

  // to delete the post
  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }

}
