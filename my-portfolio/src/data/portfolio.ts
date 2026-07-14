export const personal = {
  name: "Simran Verma",
  tagline: "Digital Marketing Specialist | SEO & Google My Business Expert",
  email: "simranv370@gmail.com",
  phone: "", // TODO: add phone number
  resumeHref: "/resume.pdf",
  bio: "I'm a B.Com graduate with hands-on experience in Google My Business, SEO, and Google Ads. Currently working as a freelance digital marketer, I help local businesses improve their online visibility and manage their presence across search. I'm a quick learner, detail-oriented, and communicate clearly with clients and teams alike.",
};

export type Skill = {
  name: string;
};

export const skills: Skill[] = [
  { name: "Google My Business" },
  { name: "SEO" },
  { name: "Google Ads" },
  { name: "WordPress (Basic)" },
  { name: "Canva" },
  { name: "MS Office (Word/Excel/PowerPoint)" },
  { name: "Google Docs/Sheets" },
  { name: "Tally (Basic)" },
];

export type ExperienceEntry = {
  role: string;
  organization: string;
  period: string;
  points: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "Freelance Digital Marketer",
    organization: "Self-Employed",
    period: "Feb 2026 – Present",
    points: [
      "Managing two Google My Business accounts end-to-end",
      "Improving local search visibility through consistent GMB optimization",
      "Maintaining accurate, up-to-date business listings",
    ],
  },
  {
    role: "Content Creation Intern",
    organization: "Humble Solutions Private Limited",
    period: "Jan 2026 – Mar 2026",
    points: [
      "Created content for digital marketing campaigns",
      "Produced content for social media platforms",
    ],
  },
];

export const certifications: string[] = [
  "SEO Course (Udemy)",
  "SEO Basics",
  "Basic Computer Course",
  "WordPress Basics",
];

export type EducationEntry = {
  degree: string;
  institution: string;
  period: string;
};

export const education: EducationEntry[] = [
  {
    degree: "B.Com",
    institution: "Hans Raj Mahila Maha Vidyalaya, Jalandhar",
    period: "2022 – 2025",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];
