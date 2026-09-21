import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import './Author.css';

const Author = ({ blok }) => {
	if (!blok) return null;

	return (
		<div className="Author-profile" {...storyblokEditable(blok)}>
			{blok.Photo?.filename && (
				<div className="Author-photo-container">
					<img
						src={blok.Photo.filename}
						alt={blok.Name}
						width={300}
						height={300}
						className="Author-photo"
					/>
				</div>
			)}
			<div className="Author-content">
				<h1 className="Author-name">{blok.Name}</h1>
				{blok.Bio && <p className="Author-bio">{blok.Bio}</p>}
			</div>
		</div>
	);
};

export default Author;
