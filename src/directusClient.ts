import { Directus } from "@tspvivek/refine-directus";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
// export const API_URL = "http://localhost:8055/";

export const directusClient = new Directus(API_URL, {auth:{autoRefresh:false}});