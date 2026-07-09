import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARTICLES } from '../../core/data/articles';

@Component({
  selector: 'app-articles-page',
  imports: [RouterLink],
  templateUrl: './articles-page.html',
  styleUrl: './articles-page.scss',
})
export class ArticlesPage {
  protected readonly articles = ARTICLES;
}
