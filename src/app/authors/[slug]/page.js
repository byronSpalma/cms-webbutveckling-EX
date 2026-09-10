import { StoryblokStory } from '@storyblok/react/rsc';
import { getStoryWithRelations, getStoriesByType } from '@/lib/api';

export const metadata = {
	title: 'Author - NYHETER',
	description: 'Meet our writers',
};

export default async function AuthorPage({ params }) {
	const { slug } = await params;

	// Fetch the author story
	const story = await getStoryWithRelations(`authors/${slug}`);

	if (!story) {
		return (
			<div className="error-page">
				<h1>Author not found</h1>
				<p>The author you're looking for doesn't exist.</p>
			</div>
		);
	}

	return <StoryblokStory story={story} />;
}

// Generate static paths for all authors
export async function generateStaticParams() {
	const stories = await getStoriesByType('author', {
		per_page: 100,
	});

	return stories.map((story) => ({
		slug: story.slug,
	}));
}
