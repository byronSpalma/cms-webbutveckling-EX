import { getStoryblokApi } from "@/lib/storyblok";
import { StoryblokServerComponent } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
	const storyblokApi = getStoryblokApi();
	const { data } = await storyblokApi.getStories({
		version: "published",
		content_type: "article",
	});

	return data.stories.map((story) => ({
		slug: story.slug,
	}));
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const storyblokApi = getStoryblokApi();

	const { data } = await storyblokApi.get(`cdn/stories/articles/${slug}`, {
		version: "published",
	});

	return {
		title: data.story.content.Title,
		description: data.story.content.Summary,
	};
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const storyblokApi = getStoryblokApi();

  let story;
  try {
    const { data } = await storyblokApi.get(`cdn/stories/articles/${slug}`, {
      version: "published",
      resolve_relations: "article.Author",
    });
    
    story = data.story;
  } catch {
    notFound();
  }

  return <StoryblokServerComponent blok={story.content} />;
}