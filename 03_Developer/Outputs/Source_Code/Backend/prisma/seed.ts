import 'dotenv/config';
import { prisma } from '../src/core/database/prisma.service';

async function main() {
  console.log('🌱 Seeding customer tiers...');

  const tiers = [
    { name: 'Member', slug: 'member', minSpent: BigInt(0), maintainSpent: BigInt(0), discountPercent: 0, sortOrder: 0 },
    { name: 'Silver', slug: 'silver', minSpent: BigInt(2_000_000), maintainSpent: BigInt(1_000_000), discountPercent: 3, sortOrder: 1 },
    { name: 'Gold', slug: 'gold', minSpent: BigInt(5_000_000), maintainSpent: BigInt(3_000_000), discountPercent: 5, sortOrder: 2 },
    { name: 'Platinum', slug: 'platinum', minSpent: BigInt(10_000_000), maintainSpent: BigInt(7_000_000), discountPercent: 10, sortOrder: 3 },
  ];

  for (const tier of tiers) {
    await prisma.customerTier.upsert({
      where: { slug: tier.slug },
      update: {
        name: tier.name,
        minSpent: tier.minSpent,
        maintainSpent: tier.maintainSpent,
        discountPercent: tier.discountPercent,
        sortOrder: tier.sortOrder,
      },
      create: tier,
    });
    console.log(`  ✅ ${tier.name} (min: ${tier.minSpent.toLocaleString()} VND)`);
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
