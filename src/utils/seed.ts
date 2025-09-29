import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create sample customers
  const customer1 = await prisma.customer.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      address: '123 Main St, New York, NY 10001',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1987654321',
      address: '456 Oak Ave, Los Angeles, CA 90210',
    },
  });

  console.log('✅ Sample customers created');

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      total: 99.99,
      status: 'PENDING',
      notes: 'First sample order',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      total: 149.50,
      status: 'PROCESSING',
      notes: 'Second order for John',
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      total: 75.25,
      status: 'SHIPPED',
      notes: 'Express delivery requested',
    },
  });

  console.log('✅ Sample orders created');
  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });