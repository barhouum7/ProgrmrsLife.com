// Resetting the stuck 4-hour cooldown in the DB so the scraper can re-fire immediately


const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.apiCallLog.updateMany({
    data: {
        lastCallTime: new Date('2020-01-01'), lastCallSuccess:
            false
    }
}).then(r => {
    console.log('Reset', r.count, 'log row(s) - scraper cooldown cleared');
    return p.$disconnect();
}).catch(e => {
    console.error(e.message);
    process.exit(1);
});