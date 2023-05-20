import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

dotenv.config({
    path: '../../deploy/dev/backend.env'
})
const BASE_URL = `https://${process.env.SHOPIFY_ADMIN_KEY}:${process.env.SHOPIFY_ADMIN_SECRET}@${process.env.SHOPIFY_DOMAIN}/admin/api/2022-10/`;

async function getNgrokUrl() {
    const res = await fetch('http://localhost:4040/api/tunnels')
    const data = await res.json()
    const httpsTunnel = data.tunnels.find((tunnel: any) => tunnel['proto'] === 'https')
    return httpsTunnel.public_url
}

async function createShopifyWebhook() {
    const ngrokUrl = await getNgrokUrl()
    const storeURL = `${BASE_URL}/webhooks.json`
    console.log(storeURL);
    const body = {
        "webhook": {
            "topic": "orders/create",
            "address": `${ngrokUrl}/orderInfos/newOrderCreated`,
            "format": "json"
        }
    }
    const res = await fetch(storeURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    const data = await res.json()
    console.log(data);
    return data;
}

async function getShopifyWebhooks() {
    const storeURL = `${BASE_URL}/webhooks.json`
    const res = await fetch(storeURL)
    const data = await res.json()
    console.log(data);
    return data
}

async function deleteShopifyWebhook(id: number) {
    const storeURL = `${BASE_URL}/webhooks/${id}.json`
    const res = await fetch(storeURL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await res.json()
    console.log(data);
    return data
}

async function deleteShopifyWebhooks() {
    const webhooks = await getShopifyWebhooks()
    const webhookIds = webhooks.webhooks.map((webhook: any) => webhook.id)
    for (const id of webhookIds) {
        deleteShopifyWebhook(id)
    }
}
