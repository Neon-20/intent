-- Insert sample jobs for testing
-- Run this in your Supabase SQL Editor to add dummy jobs

INSERT INTO jobs (
  title,
  company,
  description,
  requirements,
  category,
  job_type,
  experience_level,
  location,
  salary_range,
  skills,
  apply_url,
  is_active
) VALUES
(
  'Senior Full Stack Developer',
  'TechCorp Solutions',
  '## About the Role

We are looking for an experienced Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.

## Responsibilities

- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews
- Mentor junior developers',
  '## Requirements

- 5+ years of experience in full stack development
- Strong proficiency in React, Node.js, and TypeScript
- Experience with PostgreSQL or similar databases
- Familiarity with cloud platforms (AWS, GCP, or Azure)
- Excellent problem-solving skills
- Strong communication skills',
  'Engineering',
  'Full-time',
  'Senior',
  'San Francisco, CA (Remote)',
  '$120,000 - $180,000',
  ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
  'https://example.com/apply/senior-fullstack',
  true
),
(
  'Product Designer',
  'DesignHub Inc',
  '## About the Role

Join our design team to create beautiful and intuitive user experiences. You will work closely with product managers and engineers to bring ideas to life.

## What You''ll Do

- Create wireframes, prototypes, and high-fidelity designs
- Conduct user research and usability testing
- Collaborate with engineering teams
- Maintain design systems and component libraries',
  '## What We''re Looking For

- 3+ years of product design experience
- Proficiency in Figma and other design tools
- Strong portfolio demonstrating UX/UI skills
- Understanding of design systems
- Excellent communication skills',
  'Design',
  'Full-time',
  'Mid',
  'New York, NY (Hybrid)',
  '$90,000 - $130,000',
  ARRAY['Figma', 'UI/UX', 'Prototyping', 'User Research'],
  'https://example.com/apply/product-designer',
  true
),
(
  'Marketing Manager',
  'GrowthLabs',
  '## About the Position

We''re seeking a creative and data-driven Marketing Manager to lead our marketing initiatives and drive growth.

## Key Responsibilities

- Develop and execute marketing strategies
- Manage social media and content marketing
- Analyze campaign performance
- Collaborate with sales team
- Manage marketing budget',
  '## Qualifications

- 4+ years of marketing experience
- Proven track record in digital marketing
- Experience with marketing automation tools
- Strong analytical skills
- Excellent written and verbal communication',
  'Marketing',
  'Full-time',
  'Mid',
  'Austin, TX (Remote)',
  '$80,000 - $110,000',
  ARRAY['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
  'https://example.com/apply/marketing-manager',
  true
),
(
  'Junior Software Engineer',
  'StartupXYZ',
  '## About Us

StartupXYZ is a fast-growing tech startup looking for passionate junior developers to join our team.

## What You''ll Learn

- Modern web development practices
- Agile development methodologies
- Code review and collaboration
- Cloud infrastructure basics',
  '## Requirements

- 0-2 years of professional experience
- Knowledge of JavaScript/TypeScript
- Familiarity with React or Vue.js
- Basic understanding of Git
- Eagerness to learn and grow',
  'Engineering',
  'Full-time',
  'Entry',
  'Remote',
  '$60,000 - $85,000',
  ARRAY['JavaScript', 'React', 'Git', 'HTML/CSS'],
  'https://example.com/apply/junior-engineer',
  true
),
(
  'Data Analyst',
  'DataDriven Co',
  '## Role Overview

Help us turn data into actionable insights. You''ll work with large datasets to identify trends and support business decisions.

## Responsibilities

- Analyze complex datasets
- Create dashboards and reports
- Collaborate with stakeholders
- Present findings to leadership',
  '## Requirements

- 2+ years of data analysis experience
- Proficiency in SQL and Python
- Experience with BI tools (Tableau, Power BI)
- Strong statistical knowledge
- Excellent presentation skills',
  'Data',
  'Full-time',
  'Mid',
  'Chicago, IL (Hybrid)',
  '$75,000 - $100,000',
  ARRAY['SQL', 'Python', 'Tableau', 'Statistics'],
  'https://example.com/apply/data-analyst',
  true
);

