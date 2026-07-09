import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARTICLES } from '../../core/data/articles';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly articles = ARTICLES;
  protected readonly featuredArticle = ARTICLES.find((article) => article.featured) ?? ARTICLES[0];
}
