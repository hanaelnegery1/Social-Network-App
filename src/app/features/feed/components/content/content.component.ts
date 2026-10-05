import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/auth/services/posts.service';
import { Post, User } from '../../../../core/models/post.interface';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-content',
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  postsData: Post[] = [];
  userData: User | null = null;
  userId: string = '';

  ngOnInit(): void {
    this.getAllPostsData();
    const storedUserData = localStorage.getItem('userData');
    this.userData = storedUserData ? JSON.parse(storedUserData) : null;
    this.userId = this.userData?._id!;
  }

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
}
