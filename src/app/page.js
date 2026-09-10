import { notFound } from "next/navigation";
import { StoryblokStory } from "@storyblok/react/rsc";
import { getStoryblokApi } from "@/lib/storyblok";

export default async function HomePage() {
  let story;
  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get("cdn/stories/home", {
      version: "draft",
    });
    story = data.story;
  } catch {
    notFound();
  }

  return <StoryblokStory story={story} />;
}
