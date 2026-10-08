import { Component, inject } from '@angular/core';
import { PostsService } from '../../../../../../core/auth/services/posts.service';

@Component({
  selector: 'app-comment-post',
  imports: [],
  templateUrl: './comment-post.component.html',
  styleUrl: './comment-post.component.css',
})
export class CommentPostComponent {
  private readonly postsService = inject(PostsService);
}
