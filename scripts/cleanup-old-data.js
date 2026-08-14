/**
 * Cleanup script: Keep only the latest 10 CanvaLinks + clean up old data
 * 
 * Run AFTER migration:
 *   node scripts/cleanup-old-data.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
    console.log('🧹 Starting data cleanup...\n');

    try {
        // ── 1. Keep only latest 10 CanvaLinks ──────────────────────
        console.log('📦 Cleaning CanvaLinks (keeping latest 10)...');
        
        const allLinks = await prisma.canvaLink.findMany({
            orderBy: { createdAt: 'desc' },
        });

        console.log(`  Total CanvaLinks: ${allLinks.length}`);

        if (allLinks.length > 10) {
            const linksToKeep = allLinks.slice(0, 10);
            const keepIds = linksToKeep.map(l => l.id);
            const idsToDelete = allLinks.slice(10).map(l => l.id);

            // Delete votes associated with old links first
            const deletedVotes = await prisma.vote.deleteMany({
                where: { linkId: { in: idsToDelete } }
            });
            console.log(`  Deleted ${deletedVotes.count} votes from old links`);

            // Delete old links
            const deletedLinks = await prisma.canvaLink.deleteMany({
                where: { id: { notIn: keepIds } }
            });
            console.log(`  Deleted ${deletedLinks.count} old CanvaLinks`);
            console.log(`  ✅ Kept ${linksToKeep.length} latest links`);
        } else {
            console.log(`  ✅ Already ${allLinks.length} links (≤ 10), nothing to delete`);
        }

        // ── 2. Clean duplicate votes ────────────────────────────────
        console.log('\n📊 Cleaning duplicate votes...');
        
        const allVotes = await prisma.vote.findMany({
            orderBy: { createdAt: 'desc' },
        });

        // Find votes that were created by the old migration (duplicates)
        // Group by (linkId + userId + type) and keep only the newest
        const voteMap = new Map();
        const duplicateVoteIds = [];

        for (const vote of allVotes) {
            const key = `${vote.linkId || vote.tweetId}_${vote.userId}_${vote.type}`;
            if (voteMap.has(key)) {
                duplicateVoteIds.push(vote.id);
            } else {
                voteMap.set(key, vote);
            }
        }

        if (duplicateVoteIds.length > 0) {
            const deleted = await prisma.vote.deleteMany({
                where: { id: { in: duplicateVoteIds } }
            });
            console.log(`  Deleted ${deleted.count} duplicate votes`);
        } else {
            console.log(`  ✅ No duplicate votes found`);
        }

        // Clean votes with no linkId (orphaned from old migration)
        const orphanedVotes = await prisma.vote.deleteMany({
            where: { linkId: null }
        });
        if (orphanedVotes.count > 0) {
            console.log(`  Deleted ${orphanedVotes.count} orphaned votes (no linkId)`);
        }

        // ── 3. Delete ALL tweets ────────────────────────────────────
        console.log('\n🗑️  Deleting all legacy Tweet records...');
        const deletedTweets = await prisma.tweet.deleteMany({});
        console.log(`  Deleted ${deletedTweets.count} tweets`);

        // ── Summary ─────────────────────────────────────────────────
        const finalLinks = await prisma.canvaLink.count();
        const finalVotes = await prisma.vote.count();
        
        console.log('\n════════════════════════════════════════');
        console.log('✅ Cleanup complete!');
        console.log(`   CanvaLinks remaining: ${finalLinks}`);
        console.log(`   Votes remaining:      ${finalVotes}`);
        console.log('════════════════════════════════════════');
        console.log('\n💡 Next steps:');
        console.log('   1. Update schema.prisma to Phase 2');
        console.log('   2. Run: npx prisma db push');

    } catch (error) {
        console.error('\n❌ Cleanup failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();
