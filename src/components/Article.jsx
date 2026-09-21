import { storyblokEditable, renderRichText } from '@storyblok/react/rsc';
import Link from 'next/link';
import './Article.css';

const Article = ({ blok }) => {
	if (!blok) return null;

	const Author = blok.Author?.[0];

	return (
		<article className="article-detail" {...storyblokEditable(blok)}>
			{/* Header */}
			<header className="article-header">
				{blok.Category && (
					<span className="article-category-badge">{blok.Category.Title || blok.Category}</span>
				)}
				<h1 className="article-title">{blok.Title}</h1>
				<p className="article-summary">{blok.Summary}</p>

				{/* Author information */}
				{Author && (
					<div className="Author-info">
						{Author.content.Photo?.filename && (
							<img
								src={Author.content.Photo.filename}
								alt={Author.content.Name}
								className="Author-photo"
							/>
						)}
						<div className="Author-details">
						{Author.slug ? (
							<Link href={`/authors/${Author.slug}`} className="Author-name">
								{Author.content.Name}
							</Link>
						) : (
							<span className="Author-name">{Author.content.Name}</span>
						)}
							<p className="Author-bio">{Author.content.Bio}</p>
						</div>
					</div>
				)}
			</header>

			{/* Innehåll */}
			{blok.Content && (
				<div
					className="article-content"
					dangerouslySetInnerHTML={{ __html: renderRichText(blok.Content) }}
				/>
			)}
		</article>
	);
};

export default Article;