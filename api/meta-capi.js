const https = require('https');
const crypto = require('crypto');

const PIXEL_ID = '890295370288342';
const API_VERSION = 'v21.0';

module.exports = async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ACCESS_TOKEN = process.env.META_CAPI_TOKEN;
    if (!ACCESS_TOKEN) {
        console.error('META_CAPI_TOKEN environment variable is not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const { event_name, event_time, event_source_url, event_id, user_data, custom_data, action_source } = req.body;

        // Hash user data for privacy (Meta requires SHA-256 hashing)
        const hashedUserData = {};
        if (user_data) {
            if (user_data.client_ip_address) hashedUserData.client_ip_address = user_data.client_ip_address;
            if (user_data.client_user_agent) hashedUserData.client_user_agent = user_data.client_user_agent;
            if (user_data.fbp) hashedUserData.fbp = user_data.fbp;
            if (user_data.fbc) hashedUserData.fbc = user_data.fbc;
            // Hash PII fields if provided
            if (user_data.em) hashedUserData.em = hashSHA256(user_data.em);
            if (user_data.ph) hashedUserData.ph = hashSHA256(user_data.ph);
            if (user_data.fn) hashedUserData.fn = hashSHA256(user_data.fn);
            if (user_data.ln) hashedUserData.ln = hashSHA256(user_data.ln);
        }

        // Get real IP from Vercel headers
        const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
            || req.headers['x-real-ip']
            || req.socket?.remoteAddress
            || '';

        // Build the event payload
        const eventData = {
            event_name: event_name || 'PageView',
            event_time: event_time || Math.floor(Date.now() / 1000),
            event_source_url: event_source_url || '',
            event_id: event_id,
            action_source: action_source || 'website',
            user_data: {
                ...hashedUserData,
                client_ip_address: clientIP,
                client_user_agent: req.headers['user-agent'] || '',
            },
        };

        if (custom_data) {
            eventData.custom_data = custom_data;
        }

        const payload = JSON.stringify({
            data: [eventData],
            access_token: ACCESS_TOKEN,
        });

        // Send to Meta Conversions API
        const response = await sendToMeta(payload);

        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json({
            success: true,
            events_received: response.events_received,
            fbtrace_id: response.fbtrace_id
        });

    } catch (error) {
        console.error('CAPI Error:', error.message);
        return res.status(500).json({ error: 'Failed to send event', details: error.message });
    }
};

function hashSHA256(value) {
    if (!value) return undefined;
    return crypto.createHash('sha256').update(value.toString().trim().toLowerCase()).digest('hex');
}

function sendToMeta(payload) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'graph.facebook.com',
            port: 443,
            path: `/${API_VERSION}/${PIXEL_ID}/events`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
            },
        };

        const req = https.request(options, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.error) {
                        reject(new Error(parsed.error.message));
                    } else {
                        resolve(parsed);
                    }
                } catch (e) {
                    reject(new Error(`Invalid response: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}
