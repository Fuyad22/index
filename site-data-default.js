// Default data structure - fallback when database is empty
module.exports = {
    heroSlides: [
        {
            id: 'slide-1',
            title: 'Welcome to MU Chatrodol',
            subtitle: 'Empowering students, building community, creating lasting impact across campus.',
            ctaText: 'Discover Our Mission',
            ctaLink: '#about',
            meta: ['150+ Active Members', '50 Annual Events'],
            background: 'linear-gradient(135deg, rgba(14,165,233,0.9) 0%, rgba(220,38,38,0.9) 100%)',
            image: 'images/cover.jpg',
            imageAlt: 'Student members celebrating at MU Chatrodol event'
        }
    ],
    members: [],
    events: [],
    stats: [
        { id: 'stat-1', label: 'Active Members', value: 150 },
        { id: 'stat-2', label: 'Annual Events', value: 50 },
        { id: 'stat-3', label: 'Community Projects', value: 25 }
    ],
    posts: [],
    applications: [],
    contactMessages: []
};
