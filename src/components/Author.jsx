import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import './Author.css';

const Author = ({ blok }) => {
	if (!blok) return null;

	return (
		<div className="author-profile" {...storyblokEditable(blok)}>
			{blok.photo && (
				<div className="author-photo-container">
					<Image
						src={blok.photo.filename}
						alt={blok.name}
						width={300}
						height={300}
						className="author-photo"
					/>
				</div>
			)}
			<div className="author-content">
				<h1 className="author-name">{blok.name}</h1>
				{blok.bio && <p className="author-bio">{blok.bio}</p>}
			</div>
		</div>
	);
};

export default Author;
