import { storyblokEditable } from '@storyblok/react/rsc';
import Link from 'next/link';
import './Article.css';

const Article = ({ blok }) => {
	if (!blok) return null;

	return (
		<article className="article-detail" {...storyblokEditable(blok)}>
			{/* Header */}
			<header className="article-header">
				{blok.category && (
					<span className="article-category-badge">{blok.category}</span>
				)}
				<h1 className="article-title">{blok.title}</h1>
				<p className="article-summary">{blok.summary}</p>

				{/* Author Info */}
				{blok.author && (
					<div className="article-author-info">
						{blok.author.photo && (
							<img
								src={blok.author.photo.filename}
								alt={blok.author.name}
								className="author-photo"
							/>
						)}
						<div className="author-details">
							<Link href={`/authors/${blok.author.slug}`} className="author-name">
								{blok.author.name}
							</Link>
							<p className="author-bio">{blok.author.bio}</p>
						</div>
					</div>
				)}
			</header>

			{/* Content */}
			{blok.content && (
				<div className="article-content">
					{typeof blok.content === 'string' ? (
						<div dangerouslySetInnerHTML={{ __html: blok.content }} />
					) : (
						// For rich text JSON, render as fallback
						<p>{JSON.stringify(blok.content)}</p>
					)}
				</div>
			)}
		</article>
	);
};

export default Article;
