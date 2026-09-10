import Link from 'next/link';
import { getStory, getStories } from '@/lib/api';
import './category.css';

export const metadata = {
	title: 'Category - NYHETER',
	description: 'Browse articles by category',
};

export default async function CategoryPage({ params }) {
	const { slug } = await params;

	// Fetch the category story
	const categoryStory = await getStory(`categories/${slug}`);

	if (!categoryStory) {
		return (
			<div className="error-page">
				<h1>Category not found</h1>
				<p>The category you're looking for doesn't exist.</p>
				<Link href="/articles">← Back to articles</Link>
			</div>
		);
	}

	const categoryContent = categoryStory.content;

	// Fetch all articles in this category
	let articles = [];
	try {
		console.log('🔍 Fetching articles for category:', slug);
		
		const allStories = await getStories({
			filter_query: {
				component: {
					in: 'article',
				},
				Category: {
					in: slug,
				},
			},
			per_page: 100,
			version: 'draft',
		});
		
		console.log('📚 Articles found for category:', allStories?.length || 0);
		console.log('📦 Raw articles response:', JSON.stringify(allStories, null, 2));
		
		articles = allStories || [];
	} catch (error) {
		console.error(`❌ Error fetching articles for category ${slug}:`, error);
		articles = [];
	}

	return (
		<div className="category-container">
			{/* Category Header */}
			<div className="category-header">
				<h1 className="category-title">{categoryContent.Title}</h1>
			</div>

			{/* Articles in Category Section */}
			<div className="category-articles-section">
				<h2 className="articles-count">
					{articles.length} {articles.length === 1 ? 'Article' : 'Articles'}
				</h2>

				{articles.length === 0 ? (
					<p className="no-articles">No articles in this category yet.</p>
				) : (
					<div className="articles-grid">
						{articles.map((article) => (
							<article key={article.id} className="article-card">
								<Link href={`/articles/${article.slug}`} className="article-link">
									<h3 className="article-card-title">{article.content.Title}</h3>
									{article.content.Summary && (
										<p className="article-card-summary">{article.content.Summary}</p>
									)}
								</Link>
							</article>
						))}
					</div>
				)}
			</div>

			<Link href="/articles" className="back-link">
				← Back to all articles
			</Link>
		</div>
	);
}

// Generate static paths for all categories
export async function generateStaticParams() {
	try {
		const categoryStories = await getStories({
			filter_query: {
				component: {
					in: 'category',
				},
			},
			per_page: 100,
			version: 'draft',
		});

		return categoryStories.map((story) => ({
			slug: story.slug,
		}));
	} catch (error) {
		console.error('Error generating static params for categories:', error);
		return [];
	}
}
