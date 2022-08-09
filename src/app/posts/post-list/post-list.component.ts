import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from '../post.model';
import { PostService } from "../post.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"]
})
export class PostListComponent implements OnInit,OnDestroy {
  @Input() posts: Post[] = [];
  postSub : Subscription;
  isLoading = false;

  constructor(public postService : PostService){

  }
  ngOnInit(): void {
    this.postService.getPosts();
    this.isLoading = true;
    this.postSub = this.postService.getPostUpdateListener()
    .subscribe((posts : Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(id:string){
    this.postService.deletePost(id)
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

}
