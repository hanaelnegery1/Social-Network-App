import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  headers: object = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('socialToken')}`,
    },
  };

  getPostComments(postId: string): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `/posts/${postId}/comments?page=1&limit=10`,
      this.headers,
    );
  }

  createComment(data: object, postId: string): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `/posts/${postId}/comments`,
      data,
      this.headers,
    );
  }
}
