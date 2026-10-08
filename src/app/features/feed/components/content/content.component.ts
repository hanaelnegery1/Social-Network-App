import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/auth/services/posts.service';
import { Post, User } from '../../../../core/models/post.interface';
import { initFlowbite } from 'flowbite';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentPostComponent } from './components/comment-post/comment-post.component';

@Component({
  selector: 'app-content',
  imports: [ReactiveFormsModule, CommentPostComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  postsData: Post[] = [];
  userData: User | null = null;
  userId: string = '';
  saveFile!: File;
  imageUrl: string | ArrayBuffer | null | undefined;

  ngOnInit(): void {
    this.getAllPostsData();
    const storedUserData = localStorage.getItem('userData');
    this.userData = storedUserData ? JSON.parse(storedUserData) : null;
    this.userId = this.userData?._id!;
  }

  contentPost: FormControl = new FormControl('');
  privacyPost: FormControl = new FormControl('public');

  getAllPostsData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        this.postsData = res.data.posts;
        setTimeout(() => initFlowbite(), 0);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  changeImage(e: Event): void {
    const inputImage = e.target as HTMLInputElement;
    if (inputImage.files) {
      this.saveFile = inputImage.files[0];
    }
    this.getImageUrl();
  }

  getImageUrl(): void {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.saveFile);
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      this.imageUrl = e.target?.result;
    };
  }
  removeImage(inputImage: HTMLInputElement): void {
    this.imageUrl = null;
    inputImage.value = '';
  }

  submitPost(e: Event, form: HTMLFormElement): void {
    e.preventDefault();
    console.log(this.contentPost.value);
    console.log(this.privacyPost.value);
    console.log(this.saveFile);

    const formData = new FormData();

    if (this.contentPost.value) {
      formData.append('body', this.contentPost.value);
    }
    if (this.privacyPost.value) {
      formData.append('privacy', this.privacyPost.value);
    }
    if (this.saveFile) {
      formData.append('image', this.saveFile);
    }

    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          form.reset();
          this.imageUrl = null;
          this.getAllPostsData();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deletePost(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getAllPostsData();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
