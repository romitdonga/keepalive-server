const axios = require('axios');

async function pingKeepAlive(urls, dryRun = false) {
    if (!Array.isArray(urls) || urls.length === 0) {
        console.error('No URLs provided!');
        return;
    }

    const results = [];
    for (const url of urls) {
        try {
            if (dryRun) {
                console.log(`DRY RUN: Would ping ${url}`);
                results.push({ url, status: 'skipped', data: 'dry run' });
                continue;
            }
            const res = await axios.get(url, { timeout: 10000 }); // 10s timeout per ping
            console.log(`Keep alive ping for ${url}: Status ${res.status}, Data:`, res.data);
            results.push({ url, status: res.status, data: res.data });
        } catch (err) {
            console.error(`Error pinging ${url}:`, err.message);
            results.push({ url, status: 'error', data: err.message });
        }
    }
    console.log('All ping results:', JSON.stringify(results, null, 2));
    return results;
}

module.exports = { pingKeepAlive };