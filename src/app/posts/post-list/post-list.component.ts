import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   {title: "First Post", Content: "This is the first post's content"},
  //   {title: "Second Post", Content: "This is the second post's content"},
  //   {title: "Third Post", Content: "This is the third post's content"}
  // ];

  posts: Post[] = [];

  private postsSub: Subscription;
  isLoading=false;

  constructor( public postsService: PostsService) {

   }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe
      (
        (posts: Post[])=>{
          this.isLoading = false;
          this.posts = posts;}
      )
      ;
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
