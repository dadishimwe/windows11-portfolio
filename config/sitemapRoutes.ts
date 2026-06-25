/** Public routes included in sitemap.xml (no query strings). */
export const sitemapRoutes: { path: string; changefreq?: string; priority?: number }[] =
	[
		{ path: '/', changefreq: 'weekly', priority: 1 },
		{ path: '/notepad/about', changefreq: 'monthly', priority: 0.8 },
		{ path: '/terminal', changefreq: 'monthly', priority: 0.5 },
		{ path: '/explorer/quick-access', changefreq: 'monthly', priority: 0.6 },
		{ path: '/explorer/desktop', changefreq: 'monthly', priority: 0.6 },
		{ path: '/explorer/documents', changefreq: 'monthly', priority: 0.6 },
		{ path: '/explorer/certifications', changefreq: 'monthly', priority: 0.8 },
		{ path: '/explorer/projects', changefreq: 'weekly', priority: 0.8 },
		{ path: '/explorer/pictures', changefreq: 'weekly', priority: 0.7 },
		{ path: '/explorer/videos', changefreq: 'weekly', priority: 0.7 },
		{ path: '/explorer/links', changefreq: 'monthly', priority: 0.7 },
		{ path: '/explorer/tools', changefreq: 'monthly', priority: 0.5 },
		{ path: '/explorer/podcasts', changefreq: 'monthly', priority: 0.5 },
		{ path: '/explorer/downloads', changefreq: 'monthly', priority: 0.5 },
		{ path: '/explorer/this-pc', changefreq: 'monthly', priority: 0.4 },
		{ path: '/explorer/drives/C', changefreq: 'yearly', priority: 0.3 },
		{ path: '/explorer/recycle-bin', changefreq: 'yearly', priority: 0.2 },
	];
