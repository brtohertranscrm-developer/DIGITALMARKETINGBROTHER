const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const db = new PrismaClient();

async function main() {
  const passwordHash = await hash("BrotherTrans123!", 12);

  await db.user.upsert({
    where: { email: "admin@brotherstrans.id" },
    update: {
      name: "Admin Brothers Trans",
      role: "OWNER",
      passwordHash,
    },
    create: {
      name: "Admin Brothers Trans",
      email: "admin@brotherstrans.id",
      role: "OWNER",
      passwordHash,
    },
  });

  const socialAccounts = [
    { platform: "INSTAGRAM", name: "Brothers Trans Instagram", handle: "@brotherstrans" },
    { platform: "FACEBOOK", name: "Brothers Trans Facebook", handle: "Brothers Trans" },
    { platform: "TIKTOK", name: "Brothers Trans TikTok", handle: "@brotherstrans" },
    { platform: "GOOGLE_BUSINESS", name: "Brothers Trans Google Business", handle: "Brothers Trans" },
  ];

  for (const account of socialAccounts) {
    const existingAccount = await db.socialAccount.findFirst({
      where: { platform: account.platform, handle: account.handle },
    });

    if (!existingAccount) {
      await db.socialAccount.create({ data: account });
    }
  }

  const campaign = await db.campaign.upsert({
    where: { id: "seed-campaign-liburan" },
    update: {},
    create: {
      id: "seed-campaign-liburan",
      name: "Promo Liburan Sekolah",
      objective: "Meningkatkan booking rombongan dan travel keluarga",
      startDate: new Date("2026-05-01T00:00:00.000Z"),
      endDate: new Date("2026-06-30T00:00:00.000Z"),
      budget: 8000000,
    },
  });

  const instagram = await db.socialAccount.findFirst({ where: { platform: "INSTAGRAM" } });
  const admin = await db.user.findUnique({ where: { email: "admin@brotherstrans.id" } });

  if (instagram && admin) {
    await db.contentItem.upsert({
      where: { id: "seed-content-hiace" },
      update: {},
      create: {
        id: "seed-content-hiace",
        title: "Reels: Sewa Hiace Jakarta Bandung",
        caption: "Solusi perjalanan nyaman untuk rombongan keluarga dan kantor.",
        status: "PUBLISHED",
        contentType: "Reels",
        publishedAt: new Date("2026-05-15T03:00:00.000Z"),
        socialAccountId: instagram.id,
        campaignId: campaign.id,
        creatorId: admin.id,
        assigneeId: admin.id,
        metrics: {
          create: {
            reach: 18400,
            impressions: 23100,
            views: 19600,
            likes: 824,
            comments: 64,
            shares: 118,
            saves: 91,
            clicks: 186,
          },
        },
      },
    });
  }

  console.log("Seed selesai. Login: admin@brotherstrans.id / BrotherTrans123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
