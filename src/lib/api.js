import { getStoryblokApi } from './storyblok';

/**
 * Fetch a single story from Storyblok
 * @param {string} slug - The story slug
 * @param {object} options - Additional options
 * @returns {Promise<object>} The story data
 */
export async function getStory(slug, options = {}) {
	const storyblokApi = getStoryblokApi();

	const defaultOptions = {
		version: 'draft',
		...options,
	};

	try {
		const { data } = await storyblokApi.get(`cdn/stories/${slug}`, defaultOptions);
		return data.story;
	} catch (error) {
		console.error(`Error fetching story ${slug}:`, error);
		return null;
	}
}

/**
 * Fetch a story with resolved relations
 * @param {string} slug - The story slug
 * @param {string|string[]} relations - Relations to resolve (e.g., "article.author")
 * @returns {Promise<object>} The story data with resolved relations
 */
export async function getStoryWithRelations(slug, relations = []) {
	const params = {
		version: 'draft',
	};

	if (relations.length > 0) {
		params.resolve_relations = Array.isArray(relations) ? relations.join(',') : relations;
	}

	const result = await getStory(slug, params);

	// If author is not resolved (still an ID or array of IDs), fetch it separately
	if (result && result.content?.author) {
		const authorId = Array.isArray(result.content.author) 
			? result.content.author[0] 
			: result.content.author;
		
		if (typeof authorId === 'string') {
			const authorStory = await getStoryById(authorId);
			if (authorStory) {
				result.content.author = authorStory.content;
			}
		}
	}

	// Same for category
	if (result && result.content?.category) {
		const categoryId = typeof result.content.category === 'string' 
			? result.content.category 
			: result.content.category;
		
		if (typeof categoryId === 'string') {
			const categoryStory = await getStoryById(categoryId);
			if (categoryStory) {
				result.content.category = categoryStory.content;
			}
		}
	}

	return result;
}

/**
 * Fetch a story by its UUID/ID
 * @param {string} storyId - The story UUID
 * @returns {Promise<object>} The story data
 */
export async function getStoryById(storyId) {
	const storyblokApi = getStoryblokApi();

	try {
		const { data } = await storyblokApi.get(`cdn/stories`, {
			filter_query: {
				id: {
					eq: storyId,
				},
			},
			version: 'draft',
		});

		if (data.stories && data.stories.length > 0) {
			return data.stories[0];
		}
		return null;
	} catch (error) {
		console.error(`Error fetching story by ID ${storyId}:`, error);
		return null;
	}
}

/**
 * Fetch multiple stories
 * @param {object} options - Query options
 * @returns {Promise<array>} Array of stories
 */
export async function getStories(options = {}) {
	const storyblokApi = getStoryblokApi();

	const defaultOptions = {
		version: 'draft',
		...options,
	};

	try {
		const { data } = await storyblokApi.get('cdn/stories', defaultOptions);
		return data.stories;
	} catch (error) {
		console.error('Error fetching stories:', error);
		return [];
	}
}

/**
 * Fetch stories by content type
 * @param {string} contentType - The content type (e.g., "article")
 * @param {object} options - Additional query options
 * @returns {Promise<array>} Array of stories
 */
export async function getStoriesByType(contentType, options = {}) {
	return getStories({
		filter_query: {
			component: {
				in: contentType,
			},
		},
		...options,
	});
}

/**
 * Get all available story slugs
 * @param {object} options - Additional query options
 * @returns {Promise<array>} Array of slug strings
 */
export async function getAllSlugs(options = {}) {
	const stories = await getStories({
		per_page: 100,
		...options,
	});
	return stories.map((story) => ({
		slug: story.slug,
		full_slug: story.full_slug,
	}));
}
