import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ARTICLES } from '../../core/data/articles';

@Component({
  selector: 'app-article-page',
  imports: [RouterLink],
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
})
export class ArticlePage {
  private readonly route = inject(ActivatedRoute);
  protected readonly article = ARTICLES.find(
    (item) => item.slug === this.route.snapshot.paramMap.get('slug'),
  );
}
