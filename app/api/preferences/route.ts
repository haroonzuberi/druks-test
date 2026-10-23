import { handleRoute } from "@/server/lib/http";
import { getPreferences, savePreferences } from "@/server/services/preference.service";

export const PATCH = handleRoute(async (req: Request) => {
    const body = await req.json().catch(() => ({}));
    
    return { body: await savePreferences(body) };
});

export const GET = handleRoute(async (req: Request) => {
    return { body: await getPreferences() };
});
