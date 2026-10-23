import { ApiRouteKey, getApiUrl } from "../lib/constants";

export async function postRequest(
    urlKey: ApiRouteKey,
    body: unknown = {},
    requestType: string = "post",
    urlParams: Record<string, string | number> = {}
): Promise<Response> {

    let url = getApiUrl(urlKey);
    for (const key of Object.keys(urlParams)) {
        url = url.replaceAll(`{${key}}`, encodeURIComponent(String(urlParams[key])));
    }
    const isFormData = body instanceof FormData;
    const response = await fetch(url, {
        method: requestType,
        headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
        body: isFormData ? body : JSON.stringify(body),
    });
    return response;
}

export async function getRequest(urlKey: ApiRouteKey): Promise<Response> {
    const url = getApiUrl(urlKey);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
}

export async function deleteRequest(url: string): Promise<Response> {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
}