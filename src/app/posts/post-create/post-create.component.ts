import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle='';
  enteredContent = '';
  post: Post;
  private mode = 'create';
  private postId: string;
  isLoading = false;

  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postsService.getPost(this.postId).subscribe(
            (postData) => {
              this.isLoading = false;
              this.post = {
                id: postData._id,
                title: postData.title,
                Content: postData.Content
              };
            }
          );
          // console.log(this.post)
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      }
    );
  }

  onSavePost(postForm: NgForm) {
    // console.dir(postInput)

    if(postForm.invalid){
      return;
    }
    const post: Post = {
      id: null,
      title: postForm.value.title,
      Content: postForm.value.Content
    };
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(post.title,post.Content);
    }
    else{
      this.postsService.updatePost(this.postId, postForm.value.title,postForm.value.Content)
    }
    postForm.resetForm();
  }

}
