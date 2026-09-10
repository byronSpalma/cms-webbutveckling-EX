import Link from 'next/link';
import { getStoriesByType } from '@/lib/api';
import { getStoryblokApi } from '@/lib/storyblok';
import './articles.css';

export const metadata = {
	title: 'Articles - NYHETER',
	description: 'Read all our latest articles',
};

async function resolveArticleAuthors(articles) {
	const storyblokApi = getStoryblokApi();

	// Resolve authors for all articles
	return Promise.all(
		articles.map(async (article) => {
			// If Author is an array of IDs, fetch the first author
			if (article.content?.Author) {
				const authorId = Array.isArray(article.content.Author)
					? article.content.Author[0]
					: article.content.Author;

				if (typeof authorId === 'string') {
					try {
						const { data } = await storyblokApi.get(`cdn/stories`, {
							filter_query: {
								id: {
									eq: authorId,
								},
							},
							version: 'draft',
						});

						if (data.stories && data.stories.length > 0) {
							const authorStory = data.stories[0];
							article.content.Author = {
								...authorStory.content,
								slug: authorStory.slug,
							};
						}
					} catch (error) {
						console.error(`Error fetching author ${authorId}:`, error);
					}
				}
			}

			return article;
		})
	);
}

export default async function ArticlesPage() {
	// Fetch all articles
	const articles = await getStoriesByType('article', {
		per_page: 100,
		resolve_relations: 'article.Author',
	});

	// Resolve authors that weren't resolved by API
	const resolvedArticles = await resolveArticleAuthors(articles);

	return (
		<div className="articles-container">
			<h1 className="articles-title">All Articles</h1>

			{resolvedArticles.length === 0 ? (
				<p className="no-articles">No articles found.</p>
			) : (
				<div className="articles-grid">
					{resolvedArticles.map((article) => (
						<article key={article.id} className="article-card">
							<Link href={`/articles/${article.slug}`} className="article-link">
								<h2 className="article-card-title">{article.content.Title}</h2>
								<p className="article-card-summary">{article.content.Summary}</p>

								{article.content.Author && (
									<div className="article-card-author">
										<span className="author-label">By:</span>
										<span className="author-name">
											{article.content.Author.Name || 'Unknown Author'}
										</span>
									</div>
								)}
							</Link>
						</article>
					))}
				</div>
			)}
		</div>
	);
}
