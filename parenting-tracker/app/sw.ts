import { defaultCache } from "@serwist/next/worker";
import { type PrecacheEntry, Serwist, type SerwistGlobalConfig, NetworkFirst } from "serwist";

declare global {
    interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        // Force fresh fetch for app icons and favicon on every load
        // This ensures installed app automatically updates when logo.png is changed
        {
            matcher: ({ url }) => 
                url.pathname.endsWith("/logo.png") || url.pathname.endsWith("/favicon.ico"),
            handler: new NetworkFirst({
                cacheName: "icons",
                plugins: [
                    {
                        maxAgeSeconds: 24 * 60 * 60,  // 1 day max (vs default 30 days)
                        maxEntries: 4,
                        maxAgeFrom: "last-used",
                    },
                ],
            }),
        },
        ...defaultCache,
    ],
    fallbacks: {
        entries: [
            {
                url: "/~offline",
                matcher({ request }) {
                    return request.destination === "document";
                },
            },
        ],
    },
});

serwist.addEventListeners();
