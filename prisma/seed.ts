import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../server/generated/prisma/client";
import { getDatabasePoolConfig } from "../server/utils/database";

const demoTitles = [
  "Review project requirements",
  "Prepare client presentation",
  "Update landing page copy",
  "Fix pagination on todo table",
  "Write API integration tests",
  "Schedule team standup",
  "Refactor modal components",
  "Deploy staging build",
  "Document database schema",
  "Optimize image assets",
  "Create onboarding checklist",
  "Review pull request feedback",
  "Plan sprint backlog",
  "Sync with design team",
  "Validate form accessibility",
  "Set up error monitoring",
  "Clean up unused dependencies",
  "Draft release notes",
  "Configure CI pipeline",
  "Audit mobile responsiveness",
  "Prepare demo environment",
  "Update environment variables guide",
  "Review security headers",
  "Add loading states to pages",
  "Test delete confirmation flow",
  "Improve empty state messaging",
  "Map user journey for signup",
  "Verify SSR data fetching",
  "Check Lucide icon usage",
  "Polish table action buttons",
  "Confirm MySQL connection pooling",
  "Seed database with sample todos",
  "Validate todo detail page",
  "Test edit modal validation",
  "Review pagination edge cases",
  "Add sample completed tasks",
  "Organize component folder structure",
  "Update README instructions",
  "Confirm Prisma adapter setup",
  "Smoke test production build",
  "Review toast notification UX",
  "Align Nuxt and Next UI parity",
  "Check date formatting consistency",
  "Verify todo status badges",
  "Prepare interview walkthrough",
  "Collect performance metrics",
  "Review database indexes",
  "Finalize demo talking points",
  "Send progress update to client",
  "Celebrate milestone completion",
];

async function main() {
  const adapter = new PrismaMariaDb(getDatabasePoolConfig());
  const prisma = new PrismaClient({ adapter });

  const targetCount = 50;
  const existingCount = await prisma.todo.count();

  if (existingCount >= targetCount) {
    console.log(
      `Skipping seed: ${existingCount} todos already exist in nuxt_todos.`,
    );
    await prisma.$disconnect();
    return;
  }

  const todos = demoTitles
    .slice(0, targetCount - existingCount)
    .map((title, index) => ({
      title,
      completed: index % 3 === 0,
    }));

  await prisma.todo.createMany({
    data: todos,
  });

  console.log(`Seeded ${todos.length} demo todos into nuxt_todos.`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
