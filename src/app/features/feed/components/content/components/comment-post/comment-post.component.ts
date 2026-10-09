import { Component, inject, Input, OnInit } from '@angular/core';
import { CommentsService } from './comments.service';
import { Comment } from './comment.interface';

@Component({
  selector: 'app-comment-post',
  imports: [],
  templateUrl: './comment-post.component.html',
  styleUrl: './comment-post.component.css',
})
export class CommentPostComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);

  @Input() postId: string = '';
  commentsList: Comment[] = [];
  commentImage!: File;
  commentImageUrl: string | ArrayBuffer | null | undefined;
  userImage: string = '';
  userName: string = '';

  ngOnInit(): void {
    this.getAllComments();
    const storedUserData = localStorage.getItem('userData');
    this.userImage = storedUserData ? JSON.parse(storedUserData).photo : null;
    this.userName = storedUserData ? JSON.parse(storedUserData).name : null;
  }

  changeCommentImage(e: Event): void {
    const inputImage = e.target as HTMLInputElement;
    if (inputImage.files) {
      this.commentImage = inputImage.files[0];
      this.getCommentImageUrl();
    }
  }

  getCommentImageUrl(): void {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.commentImage);
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      this.commentImageUrl = e.target?.result;
    };
  }

  removeCommentImage(inputImage: HTMLInputElement): void {
    this.commentImageUrl = null;
    inputImage.value = '';
  }

  getAllComments(): void {
    this.commentsService.getPostComments(this.postId).subscribe({
      next: (res) => {
        this.commentsList = res.data.comments;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  createComment(e: Event, form: HTMLFormElement): void {
    e.preventDefault();

    const formData = new FormData(form);
    const content = formData.get('content') as string | null;
    const image = formData.get('image') as File | null;

    if (!content?.trim() && !image) {
      return;
    }

    this.commentsService.createComment(formData, this.postId).subscribe({
      next: (res) => {
        if (res.success) {
          form.reset();
          this.commentImageUrl = null;
          this.getAllComments();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
