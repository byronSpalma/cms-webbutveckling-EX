import Link from 'next/link';
import './Header.css';

export default function Header() {
	return (
		<header className="header">
			<div className="header-container">
				<Link href="/" className="header-logo">
					NYHETER
				</Link>

				<nav className="header-nav">
					<Link href="/" className="nav-link">
						Start
					</Link>
					<Link href="/articles" className="nav-link">
						Artiklar
					</Link>
					<Link href="/categories/guide" className="nav-link">
						Guide
					</Link>
					<Link href="/categories/nyheter" className="nav-link">
						Nyheter
					</Link>
				</nav>
			</div>
		</header>
	);
}
