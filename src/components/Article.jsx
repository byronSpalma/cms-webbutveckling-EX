import { storyblokEditable } from '@storyblok/react/rsc';
import Link from 'next/link';
import './Article.css';

const Article = ({ blok }) => {
	if (!blok) return null;

	return (
		<article className="article-detail" {...storyblokEditable(blok)}>
			{/* Header */}
			<header className="article-header">
				{blok.Category && (
					<span className="article-category-badge">{blok.Category.Title || blok.Category}</span>
				)}
				<h1 className="article-title">{blok.Title}</h1>
				<p className="article-summary">{blok.Summary}</p>

				{/* Author Info */}
				{blok.author && (
					<div className="article-author-info">
						{blok.author.Photo && (
							<img
								src={blok.author.Photo.filename}
								alt={blok.author.Name}
								className="author-photo"
							/>
						)}
						<div className="author-details">
						{blok.author.slug ? (
							<Link href={`/authors/${blok.author.slug}`} className="author-name">
								{blok.author.Name}
							</Link>
						) : (
							<span className="author-name">{blok.author.Name}</span>
						)}
							<p className="author-bio">{blok.author.Bio}</p>
						</div>
					</div>
				)}
			</header>

			{/* Content */}
			{blok.Content && (
				<div className="article-content">
					{typeof blok.Content === 'string' ? (
						<div dangerouslySetInnerHTML={{ __html: blok.Content }} />
					) : (
						// For rich text JSON, render as fallback
						<p>{JSON.stringify(blok.Content)}</p>
					)}
				</div>
			)}
		</article>
	);
};

export default Article;
