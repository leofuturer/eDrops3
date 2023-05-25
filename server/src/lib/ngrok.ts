import fetch, { FetchError } from 'node-fetch'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path: path.resolve(__dirname, '../../../deploy/dev/backend.env')
})

const BASE_URL = `https://${process.env.SHOPIFY_ADMIN_KEY}:${process.env.SHOPIFY_ADMIN_SECRET}@${process.env.SHOPIFY_DOMAIN}/admin/api/2022-10`;

export interface Tunnel {
    name: string,
    uri: string,
    public_url: string,
    proto: 'http' | 'https',
    config: object,
    metrics: object,
}

export interface Webhook {
    id: number,
    address: string,
    topic: string,
    created_at: string,
    updated_at: string,
    format: string,
    fields: string[],
    metafield_namespaces: string[],
    api_version: string,
    private_metafield_namespaces: string[],
}

// Fetch tunnel URL from ngrok
export async function getNgrokUrl(): Promise<string | undefined> {
    // const res = await fetch('http://localhost:4040/api/tunnels')
    const res = await fetch('http://edrop_ngrok:4040/api/tunnels')

    const data = await res.json() as { tunnels: Tunnel[] }
    // console.log(data);
    const httpsTunnel = data.tunnels.find((tunnel: any) => tunnel.proto === 'https')
    return httpsTunnel?.public_url
}

// Create webhook and return webhook object
export async function createShopifyWebhook(): Promise<Webhook> {
    const ngrokUrl = await getNgrokUrl() as string
    const storeURL = `${BASE_URL}/webhooks.json`
    // console.log(storeURL);
    const body = {
        "webhook": {
            "topic": "orders/create",
            "address": `${ngrokUrl}/orders/order-completed`,
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
    const data = await res.json() as { webhook: Webhook }
    // console.log(data);
    const webhook = data.webhook;
    return webhook;
}

// Get all webhooks
export async function getShopifyWebhooks(): Promise<Webhook[]> {
    const storeURL = `${BASE_URL}/webhooks.json`
    const res = await fetch(storeURL)
    const data = await res.json() as { webhooks: Webhook[] }
    // console.log(data);
    const webhooks = data.webhooks;
    return webhooks;
}

// Delete webhook by ID
export async function deleteShopifyWebhook(id: number): Promise<void> {
    const storeURL = `${BASE_URL}/webhooks/${id}.json`
    const res = await fetch(storeURL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    // const data = await res.json()
    // console.log(data);
    // return data
}

// Delete all webhooks
export async function deleteShopifyWebhooks(): Promise<void> {
    const webhooks = await getShopifyWebhooks()
    const webhookIds = webhooks.map((webhook: any) => webhook.id)
    for (const id of webhookIds) {
        deleteShopifyWebhook(id)
    }
}