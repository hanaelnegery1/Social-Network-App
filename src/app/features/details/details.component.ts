import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostsService } from '../../core/auth/services/posts.service';
import { Post, User } from '../../core/models/post.interface';
import { CommentPostComponent } from '../feed/components/content/components/comment-post/comment-post.component';

@Component({
  selector: 'app-details',
  imports: [RouterLink, CommentPostComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);

  postDetails: Post | null = null;
  postId: string = '';
  userData: User | null = null;
  userId: string = '';

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.postId = param.get('id')!;
      this.getPostDetails();
    });

    const storedUserData = localStorage.getItem('userData');
    this.userData = storedUserData ? JSON.parse(storedUserData) : null;
    this.userId = this.userData?._id ?? '';
  }

  getPostDetails(): void {
    if (!this.postId) return;

    this.postsService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        this.postDetails = res.data.post;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deletePost(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        if (res.success) {
          this.postDetails = null;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
