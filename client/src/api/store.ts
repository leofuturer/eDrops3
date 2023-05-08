import request from "./lib/api";
import { returnAllItems } from "./lib/serverConfig";
import { Product } from "shopify-buy";

export async function getProducts(): Promise<Product[]> {
  const products = await request(returnAllItems, 'GET', {}, false).then((res) => res.data);
  return products as Product[];
}