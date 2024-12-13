export const sampleReferences = [
  {
    // Approved Reference 1
    status: 'approved',
    author: {
      id: '999',
      name: 'Demo User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
      title: 'Software Engineer',
      linkedin: 'https://linkedin.com/in/demo-user'
    },
    recipient: {
      id: '888',
      name: 'Jane Smith'
    },
    relationship: {
      type: 'manager',
      company: 'TechCorp',
      duration: '2-5'
    },
    endorsement: "Jane is an exceptional product manager who consistently delivers outstanding results. Her ability to balance stakeholder needs while maintaining a clear product vision is remarkable. She led our team through several critical launches, always ensuring clear communication and alignment across departments.",
    rating: 5,
    skills: [
      { name: "Leadership", type: "soft" },
      { name: "Product Strategy", type: "hard" },
      { name: "Stakeholder Management", type: "soft" }
    ],
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    // Pending Reference 1
    status: 'pending',
    author: {
      id: '777',
      name: 'Alice Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      title: 'Senior Product Designer',
      linkedin: 'https://linkedin.com/in/alice-johnson'
    },
    recipient: {
      id: '888',
      name: 'Jane Smith'
    },
    relationship: {
      type: 'colleague',
      company: 'DesignHub',
      duration: '1-2'
    },
    endorsement: "Working with Jane has been an incredible experience. Her product vision and ability to translate user needs into actionable requirements is outstanding. She's particularly skilled at fostering collaboration between design and development teams.",
    rating: 5,
    skills: [
      { name: "Cross-functional Collaboration", type: "soft" },
      { name: "User Research", type: "hard" },
      { name: "Agile Methodologies", type: "hard" }
    ],
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString()
  },
  {
    // Pending Reference 2
    status: 'pending',
    author: {
      id: '666',
      name: 'Bob Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      title: 'Engineering Manager',
      linkedin: 'https://linkedin.com/in/bob-wilson'
    },
    recipient: {
      id: '888',
      name: 'Jane Smith'
    },
    relationship: {
      type: 'colleague',
      company: 'InnovateNow',
      duration: '2-5'
    },
    endorsement: "Jane's strategic thinking and execution capabilities are top-notch. She has a unique ability to break down complex problems and rally teams around elegant solutions. Her commitment to product excellence and user satisfaction is evident in everything she does.",
    rating: 4,
    skills: [
      { name: "Strategic Planning", type: "hard" },
      { name: "Team Building", type: "soft" },
      { name: "Product Analytics", type: "hard" }
    ],
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString()
  }
];