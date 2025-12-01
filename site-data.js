(function () {
    const STORAGE_KEY = 'mu-chatrodol-cms/v1';

    const defaultData = {
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
            },
            {
                id: 'slide-2',
                title: 'Leadership & Service',
                subtitle: 'Hands-on leadership programs that strengthen confidence and real-world problem solving.',
                ctaText: 'Join a Program',
                ctaLink: 'join-program.html',
                meta: ['Mentorship Pods', 'Weekly Workshops'],
                background: 'linear-gradient(135deg, rgba(16,185,129,0.9) 0%, rgba(20,184,166,0.9) 100%)',
                image: 'images/pro-vc.jpg',
                imageAlt: 'Pro Vice Chancellor supporting student leaders'
            },
            {
                id: 'slide-3',
                title: 'Create Positive Change',
                subtitle: "Volunteer initiatives that transform neighborhoods while elevating every volunteer's voice.",
                ctaText: 'See Upcoming Events',
                ctaLink: '#events',
                meta: ['Community Outreach', 'Wellness Support'],
                background: 'linear-gradient(135deg, rgba(168,85,247,0.9) 0%, rgba(220,38,38,0.9) 100%)',
                image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
                imageAlt: 'Volunteers working together to help the community'
            }
        ],
        members: [
            {
                id: 'member-1',
                name: 'Kawser Ahmed',
                role: 'President',
                type: 'executive',
                department: 'LLB',
                photo: 'images/581317404_18053084927652359_318468152958173845_n.jpg',
                bio: "Kawser guides MU Chatrodol's strategic direction and mentors every executive to keep projects aligned with our mission."
            },
            {
                id: 'member-2',
                name: 'Md Jakariya Ahmed',
                role: 'Senior Vice President',
                type: 'executive',
                department: 'English',
                photo: 'images/121622784_739956223227261_407557725966673797_n.jpg',
                bio: 'Jakariya facilitates cross-campus partnerships and curates leadership clinics focused on communication.'
            },
            {
                id: 'member-3',
                name: 'Abu Tanim',
                role: 'Secretary',
                type: 'executive',
                department: 'LLB',
                photo: 'images/591315181_1578738500004585_4102081963493087870_n.jpg',
                bio: 'Abu keeps documentation spotless and ensures every resolution or event brief is delivered on time.'
            },
            {
                id: 'member-4',
                name: 'Md Fuyad Hassan',
                role: 'Senior Joint Secretary',
                type: 'executive',
                department: 'Software Engineering',
                photo: 'images/WhatsApp Image 2025-11-30 at 13.29.04_714dacf6.jpg',
                bio: 'Fuyad blends technology with community work, introducing digital tools that make volunteering smoother.'
            },
            {
                id: 'member-5',
                name: 'Naimur Rahman Talukder Nafees',
                role: 'Organizing Secretary',
                type: 'executive',
                department: 'LLB',
                photo: 'images/Screenshot 2025-11-30 133617.png',
                bio: 'Nafees coordinates large-scale events and trains new volunteers on inclusive facilitation.'
            },
            {
                id: 'member-6',
                name: 'Ashraf Ahmed',
                role: 'Vice President',
                type: 'committee',
                department: 'Communications',
                photo: '',
                bio: 'Ashraf oversees storytelling, media outreach, and keeps alumni updated on our milestones.'
            },
            {
                id: 'member-7',
                name: 'Ahsan Ahmed Rifat',
                role: 'Vice President',
                type: 'committee',
                department: 'Digital Media',
                photo: '',
                bio: 'Rifat designs content calendars that highlight student voices and event recaps.'
            },
            {
                id: 'member-8',
                name: 'Muzaddid Chowdhury',
                role: 'First Joint Secretary',
                type: 'committee',
                department: 'Computer Science and Engineering',
                photo: '',
                bio: 'Muzaddid mentors new members and pairs them with projects that match their passion.'
            },
            {
                id: 'member-9',
                name: 'Marzan Ahmed Shimul',
                role: 'Joint Secretary',
                type: 'member',
                department: 'Computer Science and Engineering',
                photo: '',
                bio: 'Shimul leads sustainability drives and campus clean-up efforts.'
            },
            {
                id: 'member-10',
                name: 'Ishtiak Uddin Shafi',
                role: 'Office Secretary',
                type: 'member',
                department: 'Computer Science and Engineering',
                photo: '',
                bio: 'Shafi facilitates wellness circles that prioritize empathy and peer support.'
            },
            {
                id: 'member-11',
                name: 'Emad Ahmed Rigve',
                role: 'Literary and Publishing Editor',
                type: 'member',
                department: 'BBA',
                photo: '',
                bio: 'Rigve tutors juniors in quantitative subjects and runs weekly study labs.'
            },
            {
                id: 'member-12',
                name: 'Nadir Hussain',
                role: 'Co Organizing Secretary',
                type: 'member',
                department: 'Literature',
                photo: '',
                bio: "Nadir curates the organization's newsletter and creative showcases."
            },
            {
                id: 'member-13',
                name: 'Rahib',
                role: 'Active Member',
                type: 'member',
                department: 'Literature',
                photo: '',
                bio: 'Rahib curates the organization\'s newsletter and creative showcases.'
            }
        ],
        events: [
            {
                id: 'event-1',
                title: 'Annual General Meeting',
                description: "Join us for our annual meeting where we'll discuss achievements, plans for the future, and elect new committee members.",
                date: '2025-12-15'
            },
            {
                id: 'event-2',
                title: 'Leadership Workshop',
                description: 'Enhance your leadership abilities with expert trainers and interactive sessions designed for student leaders.',
                date: '2026-01-10'
            },
            {
                id: 'event-3',
                title: 'Community Outreach Day',
                description: 'Participate in our community service initiative and make a difference in the local community.',
                date: '2026-02-05'
            }
        ],
        stats: [
            {
                id: 'stat-members',
                value: 150,
                label: 'Active Members'
            },
            {
                id: 'stat-events',
                value: 50,
                label: 'Events Organized'
            },
            {
                id: 'stat-impact',
                value: 1000,
                label: 'Lives Impacted'
            }
        ],
        posts: [
            {
                id: 'post-1',
                title: 'Orientation Circle Recap',
                summary: 'Highlights from our latest orientation where new members connected with mentors and project leads.',
                content: 'Our newest cohort met with executive mentors, explored leadership clinics, and mapped community engagement goals for the semester.',
                date: '2025-11-20',
                image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1400&q=80',
                imageAlt: 'Students collaborating during an orientation session'
            },
            {
                id: 'post-2',
                title: 'Tech Lab Launch',
                summary: 'MU Chatrodol introduced a hands-on innovation lab to prototype civic tech ideas.',
                content: 'The lab brings together cross-disciplinary teams to build solutions supporting campus wellbeing and local outreach partners.',
                date: '2025-10-05',
                image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1400&q=80',
                imageAlt: 'Innovation lab equipment and students experimenting'
            }
        ],
        applications: [],
        contactMessages: []
    };

    const cloneData = (data) => JSON.parse(JSON.stringify(data));

    window.MUChatrodolData = {
        STORAGE_KEY,
        getDefaultData() {
            return cloneData(defaultData);
        },
        cloneData
    };
})();
