import Link from 'next/link';
import { getStoryblokApi } from '@/lib/storyblok';
import { notFound } from 'next/navigation';
import Author from '@/components/Author';
import ArticleItem from '@/components/ArticleItem';

export default async function AuthorPage({ params }) {
	const { slug } = await params;
	const storyblokApi = getStoryblokApi();

	let authorStory;
	try {
		const { data } = await storyblokApi.get(`cdn/stories/authors/${slug}`, {
			version: 'published',
		});
		authorStory = data.story;
	} catch {
		notFound();
	}

	const { data } = await storyblokApi.getStories({
		version: 'published',
		content_type: 'article',
		resolve_relations: 'article.Author',
		filter_query: {
			Author: {
				in: authorStory.uuid,
			},
		},
	});

	const articles = data.stories;

	return (
		<div className="author-container">
			<Author blok={authorStory.content} />

			<div className="author-articles-section">
				<h2 className="articles-heading">Articles by {authorStory.content.Name}</h2>

				{articles.length === 0 ? (
					<p className="no-articles">No articles published by this author yet.</p>
				) : (
					<div className="articles-grid">
						{articles.map((article) => (
							<ArticleItem key={article.id} article={article} />
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

export async function generateStaticParams() {
	const storyblokApi = getStoryblokApi();
	const { data } = await storyblokApi.getStories({
		version: 'published',
		content_type: 'author',
	});

	return data.stories.map((story) => ({
		slug: story.slug,
	}));
}