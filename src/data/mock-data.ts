import type {
  Contact,
  BusinessUnit,
  KBFolder,
  KBArticle,
} from '@/types';

// ============================================================
// CONTACTS
// ============================================================

export const contacts: Record<string, Contact> = {
  oleksii: {
    id: 'c-oleksii',
    name: 'Oleksii Ku',
    email: 'oleksii@develux.com',
    role: 'Recruiter at HRM',
  },
  kushina: {
    id: 'c-kushina',
    name: 'Kushina Wu',
    email: 'kushina@develux.com',
    role: 'Recruiter at HRM',
  },
  temari: {
    id: 'c-temari',
    name: 'Temari Kim',
    email: 'temarikim@develux.com',
    role: 'Product Manager',
  },
  yuliana: {
    id: 'c-yuliana',
    name: 'Yuliana Pankiv',
    email: 'yuliana@develux.com',
    role: 'HR Manager',
  },
  dmytro: {
    id: 'c-dmytro',
    name: 'Dmytro Koval',
    email: 'dmytro@develux.com',
    role: 'CTO',
  },
  anna: {
    id: 'c-anna',
    name: 'Anna Shevchenko',
    email: 'anna@develux.com',
    role: 'Head of Design',
  },
  mykola: {
    id: 'c-mykola',
    name: 'Mykola Bondar',
    email: 'mykola@develux.com',
    role: 'Engineering Lead',
  },
};

// ============================================================
// BUSINESS UNITS
// ============================================================

export const unitTree: BusinessUnit = {
  id: 'develux',
  name: 'Develux',
  parentId: null,
  children: [
    {
      id: 'employo',
      name: 'Employo',
      parentId: 'develux',
      children: [
        { id: 'employo-dev', name: 'Development', parentId: 'employo' },
        {
          id: 'employo-product',
          name: 'Product',
          parentId: 'employo',
          children: [
            { id: 'employo-design', name: 'Design', parentId: 'employo-product' },
            { id: 'employo-ux', name: 'UX research', parentId: 'employo-product' },
          ],
        },
        { id: 'employo-marketing', name: 'Marketing', parentId: 'employo' },
        { id: 'employo-front', name: 'Front office', parentId: 'employo' },
        {
          id: 'employo-back',
          name: 'Back office',
          parentId: 'employo',
          children: [
            { id: 'employo-admin', name: 'Admin space', parentId: 'employo-back' },
          ],
        },
      ],
    },
    {
      id: 'client-ss',
      name: 'Client "Successful success"',
      parentId: 'develux',
      children: [
        { id: 'ss-admin', name: 'Administrators', parentId: 'client-ss' },
        { id: 'ss-people', name: 'People partners', parentId: 'client-ss' },
        { id: 'ss-marketing', name: 'Marketing', parentId: 'client-ss' },
        { id: 'ss-product', name: 'Product', parentId: 'client-ss' },
        { id: 'ss-front', name: 'Front office', parentId: 'client-ss' },
        { id: 'ss-dev', name: 'Development', parentId: 'client-ss' },
        { id: 'ss-back', name: 'Back office', parentId: 'client-ss' },
      ],
    },
    {
      id: 'edu',
      name: 'EDU',
      parentId: 'develux',
      children: [
        { id: 'edu-product', name: 'Product', parentId: 'edu' },
        { id: 'edu-dev', name: 'Development', parentId: 'edu' },
        { id: 'edu-marketing', name: 'Marketing', parentId: 'edu' },
      ],
    },
  ],
};

/** The unit selected in the prototype by default */
export const selectedUnitId = 'employo';

/** Flat map of all units for quick lookups */
export function flattenUnits(unit: BusinessUnit): BusinessUnit[] {
  const result: BusinessUnit[] = [unit];
  if (unit.children) {
    for (const child of unit.children) {
      result.push(...flattenUnits(child));
    }
  }
  return result;
}

export const allUnits = flattenUnits(unitTree);

export function getUnit(id: string): BusinessUnit | undefined {
  return allUnits.find((u) => u.id === id);
}

export function getUnitPath(id: string): BusinessUnit[] {
  const path: BusinessUnit[] = [];
  let current = getUnit(id);
  while (current) {
    path.unshift(current);
    current = current.parentId ? getUnit(current.parentId) : undefined;
  }
  return path;
}

// ============================================================
// KB CATEGORIES (global — not tied to any unit)
// ============================================================

/** Global categories. All units see the same categories; only articles have a unit. */
export const allFolders: KBFolder[] = [
  {
    id: 'cat-onboarding',
    parentFolderId: null,
    name: 'Onboarding',
    color: '#ff9124',
    status: 'active',
    sortOrder: 0,
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-06-01T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-03-28T09:00:00Z',
  },
  {
    id: 'cat-onboarding-eng',
    parentFolderId: 'cat-onboarding',
    name: 'Engineering setup',
    color: '#ff9124',
    status: 'active',
    sortOrder: 0,
    owner: contacts.mykola,
    createdBy: contacts.mykola,
    createdAt: '2025-12-01T10:00:00Z',
    updatedBy: contacts.mykola,
    updatedAt: '2026-03-27T14:00:00Z',
  },
  {
    id: 'cat-onboarding-design',
    parentFolderId: 'cat-onboarding',
    name: 'Design team setup',
    color: '#ff9124',
    status: 'active',
    sortOrder: 1,
    owner: contacts.anna,
    createdBy: contacts.anna,
    createdAt: '2026-01-10T10:00:00Z',
    updatedBy: contacts.anna,
    updatedAt: '2026-03-25T11:00:00Z',
  },
  {
    id: 'cat-engineering',
    parentFolderId: null,
    name: 'Engineering handbook',
    color: '#006bd6',
    status: 'active',
    sortOrder: 1,
    owner: contacts.dmytro,
    createdBy: contacts.dmytro,
    createdAt: '2025-10-20T10:00:00Z',
    updatedBy: contacts.mykola,
    updatedAt: '2026-03-23T16:00:00Z',
  },
  {
    id: 'cat-policies',
    parentFolderId: null,
    name: 'Company policies',
    color: '#16a34a',
    status: 'active',
    sortOrder: 2,
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-06-01T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-03-16T09:00:00Z',
  },
  {
    id: 'cat-policies-leave',
    parentFolderId: 'cat-policies',
    name: 'Leave policies',
    color: '#16a34a',
    status: 'active',
    sortOrder: 0,
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-06-15T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cat-benefits',
    parentFolderId: null,
    name: 'Benefits & perks',
    color: '#7c3aed',
    status: 'active',
    sortOrder: 3,
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-07-01T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'cat-qa',
    parentFolderId: null,
    name: 'QA standards',
    color: '#e11d48',
    status: 'active',
    sortOrder: 4,
    owner: contacts.mykola,
    createdBy: contacts.mykola,
    createdAt: '2026-01-05T10:00:00Z',
    updatedBy: contacts.mykola,
    updatedAt: '2026-03-23T10:00:00Z',
  },
];

// ============================================================
// KB ARTICLES
// ============================================================

export const allArticles: KBArticle[] = [
  // ── Employo > Onboarding ──
  {
    id: 'a-1',
    folderId: 'cat-onboarding',
    unitId: 'employo',
    title: 'Welcome to Employo',
    content: `<h2>Welcome aboard!</h2><p>We're excited to have you join the Employo team. This guide will help you navigate your first days and get set up for success.</p><h3>Key contacts</h3><ul><li><strong>Yuliana Pankiv</strong> — HR Manager, your go-to for any administrative questions</li><li><strong>Dmytro Koval</strong> — CTO, oversees all technical teams</li><li><strong>Anna Shevchenko</strong> — Head of Design, leads the product design practice</li></ul><h3>Your first week</h3><p>During your first week, you'll complete onboarding sessions with HR, meet your team, get access to all necessary tools, and attend a product overview presentation. Your manager will share a detailed schedule on your first day.</p><p>Don't hesitate to ask questions — everyone remembers what it's like to be new, and we're here to help you settle in quickly.</p>`,
    status: 'published',
    visibility: 'unit_and_subunits',
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-11-15T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-03-28T09:00:00Z',
    publishedAt: '2025-11-16T10:00:00Z',
  },
  {
    id: 'a-2',
    folderId: 'cat-onboarding',
    unitId: 'employo',
    title: 'Communication tools guide',
    content: `<h2>Communication at Employo</h2><p>We use several tools to stay connected. Here's what you need to know about each one.</p><h3>Slack</h3><p>Slack is our primary communication tool. Key channels to join:</p><ul><li><strong>#general</strong> — Company-wide announcements</li><li><strong>#random</strong> — Non-work chat, memes, and social stuff</li><li><strong>#dev-help</strong> — Technical questions and troubleshooting</li><li><strong>#your-team</strong> — Your team's private channel (your manager will invite you)</li></ul><h3>Email</h3><p>Use email for external communication and formal internal matters. For day-to-day team communication, prefer Slack.</p><h3>Meetings</h3><p>We use Google Meet for video calls. Calendar invites include meeting links automatically. We try to keep meetings focused and under 30 minutes when possible.</p>`,
    status: 'published',
    visibility: 'unit_and_subunits',
    owner: contacts.anna,
    createdBy: contacts.anna,
    createdAt: '2025-12-01T10:00:00Z',
    updatedBy: contacts.anna,
    updatedAt: '2026-03-23T14:00:00Z',
    publishedAt: '2025-12-02T10:00:00Z',
  },

  // ── Employo > Onboarding > Engineering setup ──
  {
    id: 'a-3',
    folderId: 'cat-onboarding-eng',
    unitId: 'employo',
    title: 'Development environment setup',
    content: `<h2>Prerequisites</h2><p>Before starting, make sure you have the following installed on your machine:</p><ul><li><strong>Node.js</strong> (v18 or higher) — <a href="https://nodejs.org">download here</a></li><li><strong>Docker Desktop</strong> — Required for running local services</li><li><strong>VS Code</strong> — Our recommended editor with team extensions</li></ul><h2>Repository access</h2><p>Request access to the following repositories through your team lead:</p><ul><li><strong>hrm-platform</strong> — Main application monorepo</li><li><strong>hrm-design-system</strong> — Shared component library</li><li><strong>hrm-infrastructure</strong> — Deployment configurations</li></ul><p>Clone the main repository and follow the setup instructions in the README.</p><h2>Local environment</h2><p>Run <code>docker compose up</code> to start all local services. The application will be available at <strong>localhost:3000</strong>. Database seeds are automatically applied on first run.</p><p>If you encounter issues, check the troubleshooting guide or reach out in the <strong>#dev-help</strong> Slack channel.</p>`,
    status: 'published',
    visibility: 'unit_and_subunits',
    owner: contacts.mykola,
    createdBy: contacts.mykola,
    createdAt: '2025-12-05T10:00:00Z',
    updatedBy: contacts.mykola,
    updatedAt: '2026-03-27T14:00:00Z',
    publishedAt: '2025-12-06T10:00:00Z',
  },
  {
    id: 'a-4',
    folderId: 'cat-onboarding-eng',
    unitId: 'employo',
    title: 'Git workflow & branching strategy',
    content: `<h2>Branching model</h2><p>We follow a trunk-based development approach with short-lived feature branches.</p><h3>Branch naming</h3><ul><li><strong>feature/TICKET-123-short-description</strong> — New features</li><li><strong>fix/TICKET-456-bug-description</strong> — Bug fixes</li><li><strong>chore/description</strong> — Maintenance tasks</li></ul><h3>Pull request process</h3><p>All changes require a pull request with at least one approval. PRs should be small and focused — aim for under 400 lines of changes. Include a clear description of what changed and why.</p><h2>Code review guidelines</h2><p>When reviewing code, focus on correctness, readability, and maintainability. Be constructive in your feedback and explain the reasoning behind suggestions. We use conventional comments to indicate the type of feedback (suggestion, issue, nitpick).</p>`,
    status: 'draft',
    visibility: 'unit_and_subunits',
    owner: contacts.dmytro,
    createdBy: contacts.dmytro,
    createdAt: '2026-03-25T10:00:00Z',
    updatedBy: contacts.dmytro,
    updatedAt: '2026-03-29T16:00:00Z',
    publishedAt: null,
  },

  // ── Employo > Onboarding > Design team setup ──
  {
    id: 'a-5',
    folderId: 'cat-onboarding-design',
    unitId: 'employo',
    title: 'Design tools & licenses',
    content: `<h2>Figma</h2><p>Figma is our primary design tool. You'll be added to the Employo workspace by your team lead. Key projects to bookmark:</p><ul><li><strong>Design System</strong> — Component library and design tokens</li><li><strong>Product Screens</strong> — Current production designs organized by module</li><li><strong>Explorations</strong> — Work-in-progress concepts and experiments</li></ul><h2>Other tools</h2><ul><li><strong>FigJam</strong> — For workshops, brainstorming, and flow mapping</li><li><strong>Loom</strong> — Screen recordings for async design reviews</li><li><strong>Maze</strong> — User testing and prototype testing</li></ul><h2>Design handoff</h2><p>We use Figma's Dev Mode for engineering handoff. All production-ready designs should be marked as "Ready for development" in Figma and linked in the Jira ticket.</p>`,
    status: 'published',
    visibility: 'unit_and_subunits',
    owner: contacts.anna,
    createdBy: contacts.anna,
    createdAt: '2026-01-10T10:00:00Z',
    updatedBy: contacts.anna,
    updatedAt: '2026-03-25T11:00:00Z',
    publishedAt: '2026-01-12T10:00:00Z',
  },

  // ── Employo > Engineering handbook ──
  {
    id: 'a-6',
    folderId: 'cat-engineering',
    unitId: 'employo',
    title: 'Code review guidelines',
    content: `<h2>Purpose</h2><p>Code reviews are a critical part of our development process. They help us maintain code quality, share knowledge across the team, and catch issues before they reach production.</p><h2>Review checklist</h2><ul><li>Does the code solve the stated problem?</li><li>Is the code readable and well-organized?</li><li>Are there adequate tests?</li><li>Are there any security concerns?</li><li>Does it follow our coding standards?</li></ul><h2>Approval requirements</h2><p>All pull requests require at least <strong>one approval</strong> from a team member. Changes to core infrastructure or shared libraries require <strong>two approvals</strong>, including one from a senior engineer.</p><h2>Feedback etiquette</h2><p>Use conventional comments to categorize your feedback. Prefix with <strong>suggestion:</strong>, <strong>issue:</strong>, <strong>question:</strong>, or <strong>nitpick:</strong> to help the author understand the severity and intent of each comment.</p>`,
    status: 'published',
    visibility: 'unit_and_subunits',
    owner: contacts.mykola,
    createdBy: contacts.mykola,
    createdAt: '2025-11-01T10:00:00Z',
    updatedBy: contacts.mykola,
    updatedAt: '2026-03-16T09:00:00Z',
    publishedAt: '2025-11-02T10:00:00Z',
  },
  {
    id: 'a-7',
    folderId: 'cat-engineering',
    unitId: 'employo',
    title: 'Release process',
    content: `<h2>Release cadence</h2><p>We release every <strong>two weeks</strong> on Tuesdays. Release branches are cut from main on the preceding Thursday, giving us Friday and Monday for final testing and fixes.</p><h2>Version tagging</h2><p>We use semantic versioning: <strong>MAJOR.MINOR.PATCH</strong>. The release manager creates the tag after all checks pass.</p><h2>Deployment steps</h2><ul><li>Merge release branch to main</li><li>CI/CD pipeline runs automated tests</li><li>Staging deployment (automatic)</li><li>QA sign-off on staging</li><li>Production deployment (manual trigger by release manager)</li><li>Post-deployment smoke tests</li></ul><h2>Rollback procedure</h2><p>If a critical issue is found post-deployment, the release manager can trigger a rollback to the previous version. Rollback should be completed within <strong>15 minutes</strong> of identifying the issue.</p>`,
    status: 'published',
    visibility: 'unit_and_subunits',
    owner: contacts.dmytro,
    createdBy: contacts.dmytro,
    createdAt: '2025-10-20T10:00:00Z',
    updatedBy: contacts.dmytro,
    updatedAt: '2026-03-23T16:00:00Z',
    publishedAt: '2025-10-22T10:00:00Z',
  },
  {
    id: 'a-8',
    folderId: 'cat-engineering',
    unitId: 'employo',
    title: 'Incident response procedure',
    content: `<h2>Severity levels</h2><ul><li><strong>SEV-1 (Critical):</strong> Complete service outage or data loss. Response within 15 minutes.</li><li><strong>SEV-2 (Major):</strong> Significant functionality degraded. Response within 1 hour.</li><li><strong>SEV-3 (Minor):</strong> Non-critical issue affecting some users. Response within 4 hours.</li></ul><h2>On-call rotation</h2><p>The on-call engineer is responsible for initial triage and response. The rotation schedule is managed in PagerDuty and changes weekly on Mondays.</p><h2>Escalation path</h2><p>If the on-call engineer cannot resolve the issue within the target response time, escalate to the Engineering Lead, then to the CTO if needed.</p><h2>Post-mortem</h2><p>Every SEV-1 and SEV-2 incident requires a blameless post-mortem within 48 hours. Use the post-mortem template in the Engineering Handbook folder.</p>`,
    status: 'published',
    visibility: 'current_unit_only',
    owner: contacts.dmytro,
    createdBy: contacts.dmytro,
    createdAt: '2025-11-10T10:00:00Z',
    updatedBy: contacts.dmytro,
    updatedAt: '2026-03-07T10:00:00Z',
    publishedAt: '2025-11-12T10:00:00Z',
  },

  // ── Employo > Policies & processes ──
  {
    id: 'a-9',
    folderId: 'cat-policies',
    unitId: 'employo',
    title: 'Time off request process',
    content: `<h2>How to request time off</h2><p>All time off requests are submitted through the HRM platform under the Time Off module. Submit your request at least <strong>5 business days</strong> in advance for planned leave.</p><h2>Approval chain</h2><p>Requests are approved by your direct manager. If your manager is unavailable, the request escalates to the unit lead after 48 hours.</p><h2>Blackout dates</h2><p>During release weeks and major project milestones, time off may be restricted. Your manager will communicate any blackout periods in advance. Emergency leave is always accommodated regardless of blackout dates.</p>`,
    status: 'published',
    visibility: 'unit_and_subunits',
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-10-01T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-02-28T09:00:00Z',
    publishedAt: '2025-10-02T10:00:00Z',
  },
  {
    id: 'a-10',
    folderId: 'cat-policies',
    unitId: 'employo',
    title: 'Remote work policy',
    content: `<h2>Eligibility</h2><p>All Employo employees are eligible for remote work after completing their first month. Some roles may require occasional in-office presence for team events or client meetings.</p><h2>Equipment</h2><p>Remote employees receive a one-time <strong>€500 home office stipend</strong> for ergonomic equipment. Laptops are provided by the company and should be returned upon departure.</p><h2>Work hours</h2><p>We operate on a <strong>flexible schedule</strong> with core hours from <strong>10:00 to 15:00 CET</strong>. During core hours, you should be available for meetings and synchronous communication.</p><h2>Communication expectations</h2><p>Update your Slack status to reflect your availability. If you'll be away for more than 2 hours during work hours, let your team know in your team channel.</p>`,
    status: 'published',
    visibility: 'unit_and_subunits',
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-10-15T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-03-16T09:00:00Z',
    publishedAt: '2025-10-16T10:00:00Z',
  },

  // ── Employo > QA standards ──
  {
    id: 'a-11',
    folderId: 'cat-qa',
    unitId: 'employo',
    title: 'Testing requirements',
    content: `<h2>Coverage targets</h2><p>All new code must meet the following minimum test coverage:</p><ul><li><strong>Unit tests:</strong> 80% line coverage for business logic</li><li><strong>Integration tests:</strong> Critical user flows must have E2E coverage</li><li><strong>API tests:</strong> All public endpoints must have contract tests</li></ul><h2>E2E testing strategy</h2><p>We use Playwright for end-to-end testing. E2E tests run on every PR and must pass before merging. Focus E2E tests on critical user journeys, not edge cases.</p><h2>QA sign-off</h2><p>Before a feature is considered "done," it must pass QA sign-off on the staging environment. The QA team uses a standardized checklist based on the acceptance criteria in the ticket.</p>`,
    status: 'published',
    visibility: 'unit_and_subunits',
    owner: contacts.mykola,
    createdBy: contacts.mykola,
    createdAt: '2026-01-15T10:00:00Z',
    updatedBy: contacts.mykola,
    updatedAt: '2026-03-23T10:00:00Z',
    publishedAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'a-12',
    folderId: 'cat-qa',
    unitId: 'employo',
    title: 'Bug reporting template',
    content: `<h2>Bug report structure</h2><p>When reporting a bug, include the following information:</p><h3>Summary</h3><p>A clear, concise one-line description of the issue.</p><h3>Steps to reproduce</h3><p>Numbered steps that anyone can follow to reproduce the bug. Be specific about inputs, clicks, and navigation.</p><h3>Expected behavior</h3><p>What should happen when following the steps above.</p><h3>Actual behavior</h3><p>What actually happens. Include screenshots or screen recordings if possible.</p><h3>Severity</h3><ul><li><strong>Blocker:</strong> Prevents core functionality from working</li><li><strong>Critical:</strong> Major feature broken, no workaround</li><li><strong>Major:</strong> Feature broken but workaround exists</li><li><strong>Minor:</strong> Cosmetic or low-impact issue</li></ul>`,
    status: 'draft',
    visibility: 'unit_and_subunits',
    owner: contacts.mykola,
    createdBy: contacts.mykola,
    createdAt: '2026-03-26T10:00:00Z',
    updatedBy: contacts.mykola,
    updatedAt: '2026-03-28T15:00:00Z',
    publishedAt: null,
  },

  // ── Employo > Onboarding (archived) ──
  {
    id: 'a-13',
    folderId: 'cat-onboarding',
    unitId: 'employo',
    title: 'Old onboarding checklist (v1)',
    content: `<h2>Onboarding checklist — Version 1</h2><p><em>This document has been superseded by the updated onboarding guides. Kept for reference only.</em></p><ul><li>Sign employment contract</li><li>Set up email account</li><li>Request laptop from IT</li><li>Complete HR orientation</li><li>Meet your team</li></ul>`,
    status: 'archived',
    visibility: 'unit_and_subunits',
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-06-01T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-01-15T10:00:00Z',
    publishedAt: '2025-06-02T10:00:00Z',
  },

  // ── Develux root articles (shared with Employo) ──
  {
    id: 'a-14',
    folderId: 'cat-policies',
    unitId: 'develux',
    title: 'Code of conduct',
    content: `<h2>Our values</h2><p>At Develux, we are committed to creating a respectful, inclusive, and productive work environment. Every team member is expected to uphold these standards in all professional interactions.</p><h2>Expected behavior</h2><ul><li>Treat colleagues with respect and professionalism</li><li>Communicate openly and constructively</li><li>Support diversity and inclusion</li><li>Protect confidential information</li><li>Report concerns through proper channels</li></ul><h2>Reporting violations</h2><p>If you witness or experience behavior that violates this code, report it to your manager or HR. All reports are treated confidentially.</p>`,
    status: 'published',
    visibility: 'all_units',
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-06-01T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-01-20T10:00:00Z',
    publishedAt: '2025-06-02T10:00:00Z',
  },
  {
    id: 'a-15',
    folderId: 'cat-policies',
    unitId: 'develux',
    title: 'Data security policy',
    content: `<h2>Password requirements</h2><p>All accounts must use passwords of at least <strong>12 characters</strong> including uppercase, lowercase, numbers, and special characters. Enable two-factor authentication on all company accounts.</p><h2>Data classification</h2><ul><li><strong>Public:</strong> Marketing materials, public documentation</li><li><strong>Internal:</strong> Internal processes, team information</li><li><strong>Confidential:</strong> Employee data, financial records, client information</li><li><strong>Restricted:</strong> Authentication credentials, encryption keys</li></ul><h2>Handling PII</h2><p>Personal Identifiable Information must never be shared via Slack, email, or any unsecured channel. Use the company's secure file sharing system for all PII transfers.</p>`,
    status: 'published',
    visibility: 'all_units',
    owner: contacts.dmytro,
    createdBy: contacts.dmytro,
    createdAt: '2025-07-01T10:00:00Z',
    updatedBy: contacts.dmytro,
    updatedAt: '2026-02-10T10:00:00Z',
    publishedAt: '2025-07-02T10:00:00Z',
  },
  {
    id: 'a-16',
    folderId: 'cat-policies-leave',
    unitId: 'develux',
    title: 'Vacation policy',
    content: `<h2>Annual leave allowance</h2><p>All full-time employees receive <strong>24 working days</strong> of paid annual leave per calendar year. Part-time employees receive leave proportional to their working hours.</p><h2>Booking process</h2><p>Submit your leave request through the HRM platform at least 5 business days in advance. Extended leave (5+ consecutive days) should be discussed with your manager before submitting.</p><h2>Carry-over rules</h2><p>Up to <strong>5 unused days</strong> can be carried over to the following year. Carried-over days must be used by March 31st. Days exceeding the carry-over limit are forfeited.</p>`,
    status: 'published',
    visibility: 'all_units',
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-06-15T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-01-10T10:00:00Z',
    publishedAt: '2025-06-16T10:00:00Z',
  },
  {
    id: 'a-17',
    folderId: 'cat-policies-leave',
    unitId: 'develux',
    title: 'Sick leave policy',
    content: `<h2>Reporting procedure</h2><p>Notify your manager and HR by <strong>9:00 AM</strong> on the first day of absence. A Slack message or email is sufficient for the initial notification.</p><h2>Documentation</h2><p>For absences of <strong>3 or more consecutive days</strong>, a medical certificate is required. Submit the certificate to HR within 3 business days of returning to work.</p><h2>Return to work</h2><p>After extended illness (5+ days), a brief check-in with your manager is required on your first day back to discuss workload and any accommodations needed.</p>`,
    status: 'published',
    visibility: 'all_units',
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-06-15T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-01-10T10:00:00Z',
    publishedAt: '2025-06-16T10:00:00Z',
  },
  {
    id: 'a-18',
    folderId: 'cat-onboarding',
    unitId: 'develux',
    title: 'First day checklist',
    content: `<h2>Before you arrive</h2><p>HR will send you a pre-boarding email with all the details. Please complete the following before your first day:</p><ul><li>Sign and return your employment contract</li><li>Provide banking details for payroll</li><li>Send a photo for your company profile</li></ul><h2>Day 1 schedule</h2><ul><li><strong>9:00</strong> — Welcome meeting with HR</li><li><strong>9:30</strong> — Office tour and security badge</li><li><strong>10:00</strong> — IT setup: laptop, accounts, and access</li><li><strong>11:00</strong> — Meet your team and manager</li><li><strong>12:00</strong> — Team lunch</li><li><strong>14:00</strong> — Product overview presentation</li><li><strong>15:30</strong> — Free time to explore tools and documentation</li></ul>`,
    status: 'published',
    visibility: 'all_units',
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-06-01T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-03-10T10:00:00Z',
    publishedAt: '2025-06-02T10:00:00Z',
  },
  {
    id: 'a-19',
    folderId: 'cat-onboarding',
    unitId: 'develux',
    title: 'Company history & mission',
    content: `<h2>Our story</h2><p>Develux was founded in 2018 with a simple mission: to build HR software that actually helps people do their best work. Starting as a small team of five, we've grown into a multi-product company serving organizations across Europe.</p><h2>Mission statement</h2><p><strong>"Empower organizations to build thriving workplaces through intuitive, people-first technology."</strong></p><h2>Core values</h2><ul><li><strong>People first</strong> — Technology serves people, not the other way around</li><li><strong>Build with care</strong> — Quality over speed, always</li><li><strong>Stay curious</strong> — Learn, experiment, improve</li><li><strong>Win together</strong> — Collaboration over competition</li></ul>`,
    status: 'published',
    visibility: 'all_units',
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-06-01T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2025-12-15T10:00:00Z',
    publishedAt: '2025-06-02T10:00:00Z',
  },
  {
    id: 'a-20',
    folderId: 'cat-benefits',
    unitId: 'develux',
    title: 'Health insurance overview',
    content: `<h2>Plan options</h2><p>Develux offers two health insurance plans through our provider:</p><ul><li><strong>Standard Plan:</strong> Covers general medical, dental, and vision. Company pays 80% of the premium.</li><li><strong>Premium Plan:</strong> Includes everything in Standard plus mental health coverage, physiotherapy, and extended specialist network. Company pays 70% of the premium.</li></ul><h2>Enrollment</h2><p>New employees are enrolled automatically in the Standard Plan during onboarding. You can upgrade to Premium during the annual enrollment period (November 1-15) or within 30 days of a qualifying life event.</p><h2>Covered services</h2><p>Both plans cover preventive care, emergency services, hospitalization, prescription medications, and mental health support. Check the detailed benefits guide in HR for the full list of covered services and co-pay amounts.</p>`,
    status: 'published',
    visibility: 'all_units',
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-07-01T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-02-15T10:00:00Z',
    publishedAt: '2025-07-02T10:00:00Z',
  },
  {
    id: 'a-21',
    folderId: 'cat-benefits',
    unitId: 'develux',
    title: 'Learning & development budget',
    content: `<h2>Annual budget</h2><p>Every employee has an annual <strong>learning and development budget of €1,500</strong>. This resets on January 1st and does not carry over.</p><h2>Approved categories</h2><ul><li>Online courses and certifications (Udemy, Coursera, etc.)</li><li>Conference attendance (ticket + travel)</li><li>Books and educational materials</li><li>Professional coaching or mentoring</li><li>Language courses</li></ul><h2>Reimbursement process</h2><p>Submit your receipt and a brief description of the learning activity through the HRM platform's expense module. Reimbursements are processed within 10 business days and added to your next paycheck.</p><p>For expenses over <strong>€500</strong>, get pre-approval from your manager before purchasing.</p>`,
    status: 'published',
    visibility: 'all_units',
    owner: contacts.yuliana,
    createdBy: contacts.yuliana,
    createdAt: '2025-07-15T10:00:00Z',
    updatedBy: contacts.yuliana,
    updatedAt: '2026-02-15T10:00:00Z',
    publishedAt: '2025-07-16T10:00:00Z',
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Get all root-level categories (global) */
export function getRootCategories(): KBFolder[] {
  return allFolders
    .filter((f) => f.parentFolderId === null && f.status === 'active')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Get child categories of a given category */
export function getChildFolders(parentFolderId: string): KBFolder[] {
  return allFolders.filter(
    (f) => f.parentFolderId === parentFolderId && f.status === 'active'
  );
}

/** Get articles in a specific category */
export function getArticlesInFolder(folderId: string): KBArticle[] {
  return allArticles.filter((a) => a.folderId === folderId);
}

/** Get all articles in a category tree (including sub-categories) */
export function getAllArticlesInCategory(folderId: string): KBArticle[] {
  const direct = getArticlesInFolder(folderId);
  const children = getChildFolders(folderId);
  const nested = children.flatMap((c) => getAllArticlesInCategory(c.id));
  return [...direct, ...nested];
}

/** Get article count for a category (including sub-categories, excluding archived) */
export function getArticleCount(folderId: string): number {
  return getAllArticlesInCategory(folderId).filter(
    (a) => a.status !== 'archived'
  ).length;
}

/** Get a single article by ID */
export function getArticle(id: string): KBArticle | undefined {
  return allArticles.find((a) => a.id === id);
}

/** Get a single folder/category by ID */
export function getFolder(id: string): KBFolder | undefined {
  return allFolders.find((f) => f.id === id);
}

// ============================================================
// MUTATIONS (prototype only — module-local, no persistence)
// ============================================================

const initialArticlesSnapshot: KBArticle[] = allArticles.map((a) => ({ ...a }));

/** Insert or replace an article by id. Mutates allArticles in place. */
export function upsertArticle(article: KBArticle): void {
  const idx = allArticles.findIndex((a) => a.id === article.id);
  if (idx >= 0) allArticles[idx] = article;
  else allArticles.push(article);
}

/** Restore allArticles to the initial demo snapshot. */
export function resetMockData(): void {
  allArticles.length = 0;
  initialArticlesSnapshot.forEach((a) => allArticles.push({ ...a }));
}
