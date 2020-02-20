import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  // posts = [
  //   {title: "First Post", Content: "This is the first post's content"},
  //   {title: "Second Post", Content: "This is the second post's content"},
  //   {title: "Third Post", Content: "This is the third post's content"}
  // ];

  @Input() posts = [];

  constructor() { }

  ngOnInit() {
  }

}
