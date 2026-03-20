import type { Job } from "@/components/job-card"

export const featuredJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$150k - $200k",
    type: "Full-time",
    posted: "2 days ago",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    description: "We are looking for a Senior Frontend Engineer to join our growing team..."
  },
  {
    id: "2",
    title: "Product Designer",
    company: "DesignStudio",
    location: "New York, NY",
    salary: "$120k - $160k",
    type: "Full-time",
    posted: "1 day ago",
    skills: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
    description: "Join our design team to create beautiful user experiences..."
  },
  {
    id: "3",
    title: "Backend Developer",
    company: "CloudScale",
    location: "Remote",
    salary: "$130k - $180k",
    type: "Remote",
    posted: "3 days ago",
    skills: ["Node.js", "PostgreSQL", "AWS", "Docker"],
    description: "Build scalable backend systems for our cloud platform..."
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "InfraTech",
    location: "Austin, TX",
    salary: "$140k - $190k",
    type: "Full-time",
    posted: "5 hours ago",
    skills: ["Kubernetes", "Terraform", "CI/CD", "Linux"],
    description: "Help us build and maintain our cloud infrastructure..."
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "DataDriven",
    location: "Seattle, WA",
    salary: "$145k - $195k",
    type: "Full-time",
    posted: "1 week ago",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    description: "Drive insights from our data using machine learning..."
  },
  {
    id: "6",
    title: "Mobile Developer",
    company: "AppWorks",
    location: "Los Angeles, CA",
    salary: "$125k - $170k",
    type: "Contract",
    posted: "4 days ago",
    skills: ["React Native", "iOS", "Android", "TypeScript"],
    description: "Build cross-platform mobile applications..."
  },
  {
    id: "7",
    title: "Marketing Manager",
    company: "GrowthLabs",
    location: "Chicago, IL",
    salary: "$90k - $130k",
    type: "Full-time",
    posted: "2 days ago",
    skills: ["SEO", "Content Marketing", "Analytics", "Social Media"],
    description: "Lead our marketing efforts and drive growth..."
  },
  {
    id: "8",
    title: "UX Researcher",
    company: "UserFirst",
    location: "Boston, MA",
    salary: "$100k - $140k",
    type: "Part-time",
    posted: "6 days ago",
    skills: ["User Research", "Usability Testing", "Interviews", "Data Analysis"],
    description: "Conduct research to improve our user experience..."
  },
]

export const companies = [
  { name: "TechCorp Inc.", jobs: 45, industry: "Technology" },
  { name: "DesignStudio", jobs: 23, industry: "Design" },
  { name: "CloudScale", jobs: 67, industry: "Cloud Computing" },
  { name: "InfraTech", jobs: 34, industry: "Infrastructure" },
  { name: "DataDriven", jobs: 28, industry: "Data & Analytics" },
  { name: "AppWorks", jobs: 19, industry: "Mobile Development" },
]

export const userApplications = [
  {
    id: "1",
    jobTitle: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    appliedDate: "Feb 28, 2026",
    status: "pending" as const,
  },
  {
    id: "2",
    jobTitle: "Product Designer",
    company: "DesignStudio",
    appliedDate: "Feb 25, 2026",
    status: "accepted" as const,
  },
  {
    id: "3",
    jobTitle: "UX Researcher",
    company: "UserFirst",
    appliedDate: "Feb 20, 2026",
    status: "rejected" as const,
  },
  {
    id: "4",
    jobTitle: "DevOps Engineer",
    company: "InfraTech",
    appliedDate: "Feb 15, 2026",
    status: "pending" as const,
  },
]

export const recruiterJobs = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    type: "Full-time" as const,
    posted: "Feb 20, 2026",
    applicants: 24,
    status: "active" as const,
  },
  {
    id: "2",
    title: "Backend Developer",
    location: "Remote",
    type: "Remote" as const,
    posted: "Feb 18, 2026",
    applicants: 45,
    status: "active" as const,
  },
  {
    id: "3",
    title: "Product Manager",
    location: "New York, NY",
    type: "Full-time" as const,
    posted: "Feb 10, 2026",
    applicants: 67,
    status: "closed" as const,
  },
]

export const applicants = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    position: "Senior Frontend Engineer",
    appliedDate: "Mar 1, 2026",
    status: "new" as const,
    experience: "5 years",
    skills: ["React", "TypeScript", "Node.js"],
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    position: "Senior Frontend Engineer",
    appliedDate: "Feb 28, 2026",
    status: "reviewed" as const,
    experience: "7 years",
    skills: ["React", "Vue.js", "GraphQL"],
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    position: "Backend Developer",
    appliedDate: "Feb 27, 2026",
    status: "shortlisted" as const,
    experience: "4 years",
    skills: ["Node.js", "Python", "PostgreSQL"],
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    position: "Backend Developer",
    appliedDate: "Feb 26, 2026",
    status: "new" as const,
    experience: "3 years",
    skills: ["Java", "Spring Boot", "MySQL"],
  },
]
