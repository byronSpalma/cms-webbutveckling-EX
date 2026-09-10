import Link from 'next/link';
import Image from 'next/image';
import { getStory, getStories } from '@/lib/api';
import './author.css';

export const metadata = {
	title: 'Author - NYHETER',
	description: 'Read articles by this author',
};

export default async function AuthorPage({ params }) {
	const { slug } = await params;

	// Fetch the author story
	const authorStory = await getStory(`authors/${slug}`);

	if (!authorStory) {
		return (
			<div className="error-page">
				<h1>Author not found</h1>
				<p>The author you're looking for doesn't exist.</p>
				<p style={{ fontSize: '12px', color: '#999' }}>Slug: {slug}</p>
				<Link href="/articles">← Back to articles</Link>
			</div>
		);
	}

	const authorContent = authorStory.content;

	// Fetch all articles by this author
	let articles = [];
	try {
		console.log('🔍 Fetching articles for author UUID:', authorStory.uuid);
		
		const allStories = await getStories({
			filter_query: {
				component: {
					in: 'article',
				},
				author: {
					in: authorStory.uuid,
				},
			},
			per_page: 100,
			version: 'draft',
		});
		
		console.log('📚 Articles found:', allStories?.length || 0);
		console.log('📦 Raw response:', JSON.stringify(allStories, null, 2));
		
		articles = allStories || [];
	} catch (error) {
		console.error(`❌ Error fetching articles for author ${slug}:`, error);
		articles = [];
	}

	return (
		<div className="author-container">
			{/* Author Profile Section */}
			<div className="author-profile-section">
				{authorContent.Photo && authorContent.Photo.filename && (
					<div className="author-photo-wrapper">
						<Image
							src={authorContent.Photo.filename}
							alt={authorContent.Name}
							width={300}
							height={300}
							className="author-photo"
							priority
						/>
					</div>
				)}

				<div className="author-info">
					<h1 className="author-name">{authorContent.Name}</h1>
					{authorContent.Bio && <p className="author-bio">{authorContent.Bio}</p>}
				</div>
			</div>

			{/* Articles by Author Section */}
			<div className="author-articles-section">
				<h2 className="articles-heading">Articles by {authorContent.Name}</h2>

				{articles.length === 0 ? (
					<p className="no-articles">No articles published by this author yet.</p>
				) : (
					<div className="articles-list">
						{articles.map((article) => (
							<article key={article.id} className="article-item">
								<Link href={`/articles/${article.slug}`} className="article-item-link">
									<h3 className="article-item-title">{article.content.Title}</h3>
									{article.content.Summary && (
										<p className="article-item-summary">{article.content.Summary}</p>
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

// Generate static paths for all authors
export async function generateStaticParams() {
	try {
		const authorStories = await getStories({
			filter_query: {
				component: {
					in: 'author',
				},
			},
			per_page: 100,
			version: 'draft',
		});

		return authorStories.map((story) => ({
			slug: story.slug,
		}));
	} catch (error) {
		console.error('Error generating static params for authors:', error);
		return [];
	}
}
