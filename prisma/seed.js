const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log(`Start seeding ...`);

  const commonUserPassword = await hashPassword('password123');
  const adminUserPassword = await hashPassword('adminpass123');

  // Create a common user
  const user1 = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      password: commonUserPassword,
      role: 'USER',
    },
  });
  console.log(`Created/Verified user: ${user1.username} (Role: ${user1.role}) with ID: ${user1.id}`);
  console.log(`  Login with username: testuser, password: password123`);

  // Create an admin user
  const admin1 = await prisma.user.upsert({
    where: { username: 'adminuser' },
    update: {},
    create: {
      username: 'adminuser',
      password: adminUserPassword,
      role: 'ADMIN',
    },
  });
  console.log(`Created/Verified admin user: ${admin1.username} (Role: ${admin1.role}) with ID: ${admin1.id}`);
  console.log(`  Login with username: adminuser, password: adminpass123`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 