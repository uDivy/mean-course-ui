import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from "./mime-type-validator";
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  enteredTitle='';
  enteredContent = '';
  post: Post;
  private mode = 'create';
  private postId: string;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, public route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'Content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

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
                Content: postData.Content,
                imagePath: postData.imagePath,
                creator: postData.creator
              };
            // console.log(this.post)
          this.form.setValue({
            'title': this.post.title,
            'Content': this.post.Content,
            'image': this.post.imagePath
          });
        });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      }
    );
  }

  onSavePost() {
    // console.dir(postInput)

    if(this.form.invalid){
      return;
    }
    const post: Post = {
      id: null,
      title: this.form.value.title,
      Content: this.form.value.Content,
      imagePath: null,
      creator: null
    };
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.Content,
        this.form.value.image
      );
    }
    else{
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.Content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement ).files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
