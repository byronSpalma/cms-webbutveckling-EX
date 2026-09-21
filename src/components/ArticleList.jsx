import { getStoryblokApi } from '@/lib/storyblok';
import ArticleItem from './ArticleItem';

export default async function ArticleList({ blok, slug }) {
	const storyblokApi = getStoryblokApi();

	const { data } = await storyblokApi.getStories({
		version: 'published',
		content_type: 'article',
		resolve_relations: 'article.Author',
        filter_query: {
            category: {
                in: slug
            }
        }
	});

	const stories = data.stories;

	console.log("author field:", stories[3]?.content.Author);

	return (
		<div className="articles-list">
			{blok.headline && <h2>{blok.headline}</h2>}
			<div className="articles-grid">
				{stories.map((article) => (
					<ArticleItem key={article.id} article={article} />
				))}
			</div>
		</div>
	);
}

