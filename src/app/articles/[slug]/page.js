import { StoryblokStory } from '@storyblok/react/rsc';
import Article from '@/components/Article';
import { getStoryWithRelations, getStoriesByType } from '@/lib/api';

export async function generateMetadata({ params }) {
	const { slug } = await params;

	try {
		// Fetch the article story for metadata
		const story = await getStoryWithRelations(`articles/${slug}`, 'article.author');

		if (!story || !story.content) {
			return {
				title: 'Article - NYHETER',
				description: 'Read our latest articles',
			};
		}

		return {
			title: `${story.content.Title} - NYHETER`,
			description: story.content.Summary || 'Read this article on NYHETER',
			openGraph: {
				title: story.content.Title,
				description: story.content.Summary,
				type: 'article',
			},
		};
	} catch (error) {
		console.error('Error generating metadata:', error);
		return {
			title: 'Article - NYHETER',
			description: 'Read our latest articles',
		};
	}
}

export default async function ArticlePage({ params }) {
	const { slug } = await params;

	// Fetch the article story with resolved author relation
	const story = await getStoryWithRelations(`articles/${slug}`, 'article.author');

	if (!story) {
		return (
			<div className="error-page">
				<h1>Article not found</h1>
				<p>The article you're looking for doesn't exist.</p>
				<p style={{ fontSize: '12px', color: '#999' }}>Slug: {slug}</p>
			</div>
		);
	}

	return <Article blok={story.content} />;
}

// Generate static paths for all articles
export async function generateStaticParams() {
	const stories = await getStoriesByType('article', {
		per_page: 100,
	});

	return stories.map((story) => ({
		slug: story.slug,
	}));
}