#  Multi Keep-Alive Pinger


A lightweight, free GitHub Actions-based solution to keep your  free-tier web services alive **only during active hours** (9:00 AM - 10:00 PM IST). This prevents spin-down delays while saving instance hours (~330 hours/month) by letting services idle at night.

## Why This?
- ** Free Tier Limits**: 750 hours/month. Services spin down after 15 min idle, causing ~1 min wake-up delays.
- **Your Goal**: Run pings every 10 min during IST daytime (13 hours/day) to keep services responsive. Sleep from 10 PM - 9 AM to conserve hours.
- **Benefits**:
  - No load on : Just quick HTTP GET pings.
  - Handles 1+ services from one workflow.
  - Free: Uses GitHub Actions (unlimited for public repos; ~10 min/month usage).
  - Timezone-aware: IST (UTC+5:30) scheduling.

## Features
- **Scheduled Pings**: Every 10 min, but only if 9:00 AM - 10:00 PM IST.
- **Multi-Service Support**: Ping multiple  endpoints via a single secret (comma-separated URLs).
- **Dry Run Mode**: Test without actual pings.
- **Error Handling**: One failed ping doesn't stop others.
- **Logs**: Full visibility in GitHub Actions tab.

## Prerequisites
- A GitHub account (free).
-  web services with health/keep-alive endpoints (e.g., `/keep-alive/`).
- Node.js knowledge optional (setup is mostly copy-paste).

## Quick Setup
1. **Fork or Create Repo**:
   - Create a new public repo (e.g., `keepalive-server`) on GitHub.
   - Clone it: `git clone https://github.com/romitdonga/keepalive-server.git && cd keepalive-server`.

2. **Add Files** (copy from this repo or create):
   - `keepAlive.js`: The Node pinger script.
   - `package.json`: Dependencies (axios).
   - `.github/workflows/keepalive.yml`: The GitHub Actions workflow.

3. **Configure Secrets**:
   - Repo > Settings > Secrets and variables > Actions.
   - Add `SERVICES` secret: Comma-separated URLs, e.g.,  
     `https://db.on.com/keep-alive/,https://myservice2.on.com/ping/`

      // RDX ** MAIN THING **  ---------------------------------------------------------------------------

      New repository secret:
            Name: SERVICES
            Value: e.g., https://db.onrender.com/keep-alive/,https://myservice2.onrender.com/ping/
            
            For one: Just the single URL.
------------------------------------------------------------------------------------------------------------------------------------------------------
4. **Commit & Push**:
   ```
   git add .
   git commit -m "Initial keep-alive setup"
   git push origin main
   ```

5. **Test**:
   - Actions tab > " Multi Keep-Alive Ping" > Run workflow.
   - Enable "dry_run" for safe testing.
   - Check logs for IST time check and ping results.

Scheduled runs start immediately!

## File Details

### keepAlive.js
```javascript
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
            const res = await axios.get(url, { timeout: 10000 });
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
```

### package.json
```json
{
  "name": "-keepalive-multi",
  "version": "1.0.0",
  "description": "Multi-service keep-alive pinger for ",
  "main": "keepAlive.js",
  "scripts": {
    "start": "node keepAlive.js"
  },
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

### .github/workflows/keepalive-multi.yml
(See the YAML in the repo—handles cron, IST check, secret parsing, and Node execution.)

## Configuration
- **Ping Interval**: Edit cron in YAML (e.g., `*/12 * * * *` for every 12 min).
- **Active Hours**: Hardcoded to 9 AM - 10 PM IST. Edit `START_MINUTES`/`END_MINUTES` in YAML.
- **Add Services**: Update `SERVICES` secret (no redeploy needed).
- **Timeouts**: 10s per ping—adjust in `keepAlive.js` if needed.

## Monitoring
- **GitHub Actions**: View run history/logs in the Actions tab. Search for "Within active hours" or "Skipping pings".
- ** Dashboard**: Track instance hours—expect ~390 hours/month max (13h/day × 30).
- **Alerts**: GitHub emails on failures; add Slack/email via Actions if needed.

## Usage Estimate
| Metric | Value |
|--------|-------|
| Daily Pings | ~78 (13h × 6/hour) |
| Monthly Runs | ~2,340 |
| GitHub Minutes/Month | ~10 (5-10s/run) |
|  Hours Saved | ~330/month |
| Free Tier Fit | Yes (GitHub unlimited public;  under 750h) |

## Troubleshooting
- **No Pings?** Check secret format (no spaces after commas). Verify IST time in logs.
- **Workflow Fails?** Logs show errors (e.g., missing axios). Rerun manually.
- **Private Repo Limits?** Switch to public for unlimited minutes.
- **Spin-Down Delay?** First morning ping takes ~1 min—normal.

## Alternatives
- **Replit**: Free cron for scripts, but less reliable.
- **UptimeRobot**: Free monitoring (up to 50 monitors), but no custom IST scheduling.

## License
MIT License—use freely, fork away!

Questions? Open an issue or ping the workflow creator. Built with ❤️ for  devs in India! ��