import { getStoryblokApi } from '@/lib/storyblok';
import { StoryblokServerComponent } from "@storyblok/react/rsc"


export default async function CategoryPage({ params}) {
	const { slug } = await params;
	const storyblokApi = getStoryblokApi();

	const { data } = await storyblokApi.get("cdn/stories/category-page", {
		version: "published"
	})
	return <StoryblokServerComponent blok={data.story.content} slug={slug} />;
}	