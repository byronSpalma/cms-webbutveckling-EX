import Link from 'next/link';
import './ArticleItem.css';

// Extracts a short plain-text preview from a rich-text or HTML content field
function getContentPreview(content, maxLength = 140) {
	if (!content) return '';

	let text = '';
	if (typeof content === 'string') {
		text = content.replace(/<[^>]*>/g, ' ');
	} else if (typeof content === 'object') {
		const collectText = (node) => {
			if (!node) return '';
			if (node.text) return node.text;
			if (Array.isArray(node.content)) return node.content.map(collectText).join(' ');
			return '';
		};
		text = collectText(content);
	}

	text = text.replace(/\s+/g, ' ').trim();
	return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

export default function ArticleItem({ article }) {
	const { Title, Summary, Author, Content } = article.content;
	const contentPreview = getContentPreview(Content);

	return (
		<article className="article-card">
			<Link href={`/articles/${article.slug}`} className="article-card-link">
				<h3 className="article-card-title">{Title}</h3>

				{Author?.content?.Name && (
					<div className="article-card-author">
						{Author.content.Photo?.filename && (
							<img
								src={Author.content.Photo.filename}
								alt={Author.content.Name}
								className="article-card-author-photo"
							/>
						)}
						<span className="article-card-author-name">{Author.content.Name}</span>
					</div>
				)}

				{Summary && <p className="article-card-summary">{Summary}</p>}
				{contentPreview && <p className="article-card-content-preview">{contentPreview}</p>}
			</Link>
		</article>
	);
}
