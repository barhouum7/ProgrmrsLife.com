/**
 * Migration script: Copy existing Tweet data → CanvaLink
 * 
 * Run this ONCE after applying the new schema with `npx prisma db push`:
 *   node scripts/migrate-tweets-to-links.js
 * 
 * After successful migration, the Tweet model can be removed from schema.prisma.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
    console.log('🚀 Starting Tweet → CanvaLink migration...\n');

    try {
        // 1. Fetch all existing tweets
        const tweets = await prisma.tweet.findMany({
            orderBy: { createdAt: 'desc' }
        });

        console.log(`Found ${tweets.length} tweets to migrate.\n`);

        if (tweets.length === 0) {
            console.log('No tweets to migrate. Done!');
            return;
        }

        let migrated = 0;
        let skipped = 0;

        for (const tweet of tweets) {
            try {
                // Check if this link already exists in CanvaLink
                const existing = await prisma.canvaLink.findUnique({
                    where: { url: tweet.canvaLink }
                });

                if (existing) {
                    console.log(`  ⏭️  Skipping (already exists): ${tweet.canvaLink.substring(0, 60)}...`);
                    skipped++;
                    continue;
                }

                // Create CanvaLink entry from Tweet data
                await prisma.canvaLink.create({
                    data: {
                        url: tweet.canvaLink,
                        source: 'x_api',
                        sourceRef: tweet.tweetUrl,
                        authorName: tweet.displayName || tweet.username,
                        status: 'unverified',
                        createdAt: tweet.createdAt,
                        fetchedAt: tweet.fetchedAt,
                    }
                });

                console.log(`  ✅ Migrated: ${tweet.canvaLink.substring(0, 60)}...`);
                migrated++;
            } catch (err) {
                console.error(`  ❌ Failed to migrate tweet ${tweet.id}:`, err.message);
            }
        }

        // 2. Migrate votes (update tweetId references to linkId)
        console.log('\n📊 Migrating votes...');

        const votes = await prisma.$queryRaw`
            SELECT v.id, v."tweetId", v.type, v.active, v."createdAt", v."updatedAt", v."userId"
            FROM "Vote" v
            WHERE v.active = true
        `.catch(() => []);

        let votesMigrated = 0;

        for (const vote of votes) {
            try {
                // Find the corresponding tweet to get the canva link URL
                const tweet = await prisma.tweet.findUnique({
                    where: { id: vote.tweetId }
                });

                if (!tweet) continue;

                // Find the new CanvaLink by URL
                const canvaLink = await prisma.canvaLink.findUnique({
                    where: { url: tweet.canvaLink }
                });

                if (!canvaLink) continue;

                // Create the vote in the new schema (linked to CanvaLink)
                await prisma.vote.create({
                    data: {
                        linkId: canvaLink.id,
                        type: vote.type,
                        active: vote.active,
                        userId: vote.userId || '',
                        createdAt: vote.createdAt,
                    }
                }).catch(() => null); // Skip if already exists

                votesMigrated++;
            } catch (err) {
                // Continue on individual vote errors
            }
        }

        console.log(`  ✅ Migrated ${votesMigrated} votes.\n`);

        // 3. Seed default SourceConfig entries
        console.log('⚙️  Seeding source configurations...');

        const sources = [
            { sourceType: 'scraper_apify', enabled: true, priority: 1 },
            { sourceType: 'scraper_sorsa', enabled: true, priority: 2 },
            { sourceType: 'x_api', enabled: false, priority: 99 },
        ];

        for (const src of sources) {
            await prisma.sourceConfig.upsert({
                where: { sourceType: src.sourceType },
                create: src,
                update: { enabled: src.enabled, priority: src.priority },
            });
            console.log(`  ✅ ${src.sourceType}: enabled=${src.enabled}, priority=${src.priority}`);
        }

        console.log('\n────────────────────────────────────────');
        console.log(`✅ Migration complete!`);
        console.log(`   Links migrated: ${migrated}`);
        console.log(`   Links skipped:  ${skipped}`);
        console.log(`   Votes migrated: ${votesMigrated}`);
        console.log('────────────────────────────────────────');
        console.log('\n💡 Next steps:');
        console.log('   1. Verify data in your database');
        console.log('   2. Remove the Tweet model from schema.prisma');
        console.log('   3. Run `npx prisma db push` again');
        console.log('   4. Delete this migration script');

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
