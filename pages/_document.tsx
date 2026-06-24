import { getSiteUrl, site } from '../config/site';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	const siteUrl = getSiteUrl();

	return (
		<Html lang="en">
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600&display=swap"
					rel="stylesheet"
				/>

				<meta name="theme-color" content="#55FFFF" />
				<meta charSet="utf-8" />
				<meta name="language" content="english" />
				<meta name="author" content={site.username} />
				<meta name="designer" content={site.name} />
				<meta name="publisher" content={site.name} />
				<meta name="keywords" content={site.keywords} />
				<meta name="robots" content="index, follow" />
				<meta name="subject" content="Personal" />

				<meta property="og:site_name" content={site.ogSiteName} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={siteUrl} />
				<meta property="og:description" content={site.description} />
				<meta
					property="og:image"
					content={`${siteUrl}${site.ogImage}`}
				/>
				<meta property="og:image:alt" content={site.ogImageAlt} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content={`${site.name} — Windows Portfolio`}
				/>
				<meta name="twitter:description" content={site.description} />
				<meta
					name="twitter:image"
					content={`${siteUrl}${site.ogImage}`}
				/>

				{process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
					<>
						<script
							async
							src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
						/>
						<script
							dangerouslySetInnerHTML={{
								__html: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
							page_path: window.location.pathname,
							});
						`,
							}}
						/>
					</>
				)}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
