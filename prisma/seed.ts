import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash the password
  const hashedPassword = await bcrypt.hash('Eric91941!', 10);

  // Create sample user
  const user = await prisma.user.upsert({
    where: { email: 'sample@gmail.com' },
    update: {},
    create: {
      email: 'sample@gmail.com',
      password: hashedPassword,
      name: 'Sample User',
      title: 'Software Engineer',
      bio: 'Experienced software engineer with a passion for building great products.',
      location: 'San Francisco, CA',
      skills: {
        create: [
          { name: 'JavaScript', type: 'hard' },
          { name: 'React', type: 'hard' },
          { name: 'Node.js', type: 'hard' },
          { name: 'Communication', type: 'soft' },
          { name: 'Leadership', type: 'soft' }
        ]
      }
    }
  });

  console.log('Sample user created:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });