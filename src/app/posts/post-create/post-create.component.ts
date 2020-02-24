import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle='';
  enteredContent = '';
  constructor(public postsService: PostsService) { }

  ngOnInit() {
  }

  onAddPost(postForm: NgForm) {
    // console.dir(postInput)

    if(postForm.invalid){
      return;
    }

    const post: Post = {
      title: postForm.value.title,
      Content: postForm.value.Content
    };
    this.postsService.addPost(post.title,post.Content);
  }

}
