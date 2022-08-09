import { Component, EventEmitter,
  OnInit,
  Output
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators
} from "@angular/forms";
import {
  ActivatedRoute,
  ParamMap
} from "@angular/router";

import {
  Post
} from '../post.model';
import {
  PostService
} from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.scss"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  private mode = "create";
  private postId: string | null;
  public post: Post | null;
  isLoading = false;
  imagePreview : string;
  form: FormGroup;
  constructor(public postService: PostService, public route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators : [mimeType]
      }),
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId')
        this.isLoading = true;
        this.postService.getPost(this.postId!).subscribe(post => {
          this.isLoading = false;
          console.log(post.title);
          console.log(post.content)
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath : null
          }
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'image' : this.post.imagePath
          })
        })


        // this.post = this.postService.getPost(this.postId!)
        // this.postId! is non-null assertion operator
        // tells TypeScript that even though something looks like it could be null, it can trust you that it's not
      } else {
        this.mode = 'create';
        this.postId = null
      }
    })
  }

  onSavePost() {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.updatePost(
        this.postId!,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset()
  }

  onImagePicked(event: Event) {
    let file = (event.target as HTMLInputElement).files?.item(0)
    console.log(file)
    this.form.patchValue({image : file})
    this.form.get('image')!.updateValueAndValidity()
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file!)
  }

}
