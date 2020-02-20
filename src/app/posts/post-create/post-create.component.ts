import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle='';
  enteredContent = '';
  constructor() { }

  ngOnInit() {
  }

  @Output() postCreated = new EventEmitter();

  onAddPost(postInput: HTMLTextAreaElement) {
    // console.dir(postInput)
    const post = {
      title: this.enteredTitle,
      Content: this.enteredContent
    };
    this.postCreated.emit(post)
  }

}
