import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredValue = 'Wait for it!!!';
  newPost = 'Wait for it!!!';

  constructor() { }

  ngOnInit() {
  }

  onAddPost(postInput: HTMLTextAreaElement) {
    // console.dir(postInput)
    this.newPost=this.enteredValue;
  }

}
