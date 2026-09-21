import { storyblokEditable } from '@storyblok/react/rsc';
import Link from 'next/link';
import './Article.css';

const Article = ({ blok }) => {
	if (!blok) return null;

	const author = blok.Author?.[0];

	return (
		<article className="article-detail" {...storyblokEditable(blok)}>
			// Header
			<header className="article-header">
				{blok.Category && (
					<span className="article-category-badge">{blok.Category.Title || blok.Category}</span>
				)}
				<h1 className="article-title">{blok.Title}</h1>
				<p className="article-summary">{blok.Summary}</p>

				// Authorinformation
				{author && (
					<div className="article-Author-info">
						{author.content.Photo && (
							<img
								src={author.content.Photo.filename}
								alt={author.content.Name}
								className="Author-photo"
							/>
						)}
						<div className="Author-details">
						{author.slug ? (
							<Link href={`/authors/${author.slug}`} className="Author-name">
								{author.content.Name}
							</Link>
						) : (
							<span className="Author-name">{author.content.Name}</span>
						)}
							<p className="Author-bio">{author.content.Bio}</p>
						</div>
					</div>
				)}
			</header>

			// Innehåll
			{blok.Content && (
				<div className="article-content">
					{typeof blok.Content === 'string' ? (
						<div dangerouslySetInnerHTML={{ __html: blok.Content }} />
					) : (
						// liten fallback för rich text JSON
						<p>{JSON.stringify(blok.Content)}</p>
					)}
				</div>
			)}
		</article>
	);
};

export default Article;