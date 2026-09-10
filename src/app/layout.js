import './globals.css';
import StoryblokProvider from '@/components/StoryblokProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
	title: 'NYHETER - News & Articles',
	description: 'Read our latest news and articles',
};

export default function RootLayout({ children }) {
	return (
		<StoryblokProvider>
			<html lang="en">
				<body>
					<Header />
					<main>{children}</main>
					<Footer />
				</body>
			</html>
		</StoryblokProvider>
	);
}
