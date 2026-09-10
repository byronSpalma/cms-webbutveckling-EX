import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import './Author.css';

const Author = ({ blok }) => {
	if (!blok) return null;

	return (
		<div className="author-profile" {...storyblokEditable(blok)}>
			{blok.Photo && (
				<div className="author-photo-container">
					<Image
						src={blok.Photo.filename}
						alt={blok.Name}
						width={300}
						height={300}
						className="author-photo"
					/>
				</div>
			)}
			<div className="author-content">
				<h1 className="author-name">{blok.Name}</h1>
				{blok.Bio && <p className="author-bio">{blok.Bio}</p>}
			</div>
		</div>
	);
};

export default Author;
