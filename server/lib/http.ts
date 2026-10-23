import { notFound, unstable_rethrow } from "next/navigation";
import { NextResponse } from "next/server";


export class HttpError extends Error {
    constructor (
        public status: number,
        message: string, 
        public fields?: Record<string, string[]>
    ) {
        super(message);
        this.name = "HttpError"
    }
}

/**
 * Pages should call this around lookups that throw HttpError(404).
 * API routes keep the JSON 404 from handleRoute; pages render not-found instead of crashing.
 */
export async function orNotFound<T>(work: () => Promise<T> | T): Promise<T> {
    try {
        return await work();
    } catch (err) {
        unstable_rethrow(err);
        if (err instanceof HttpError && err.status === 404) notFound();
        throw err;
    }
}

export type RouteResult = {
    status?: number,
    body: unknown
}
/**
 * Wraps a route handler so every error becomes a consistent JSON response.
 * Known errors (HttpError) keep their status and message.
 * Anything unexpected is logged server-side and returned as a generic 500,
 * so internal details never leak to the client.
 */

export function handleRoute<T extends unknown[]>(
    fn: (...args: T) => Promise <RouteResult>
) {
    return async (...args: T): Promise<NextResponse> => {
        try {
            const { status = 200, body} = await fn(...args);
            return NextResponse.json(body, {status});
        } catch (err) {
            unstable_rethrow(err);
            if(err instanceof HttpError) {
                return NextResponse.json(
                    {error: err.message, ...(err.fields && { fields: err.fields})},
                    {status: err.status}
                )
            }
            console.error("Unhandled error: ", err);
            return NextResponse.json(
                {error: "Internal server error"},
                {status: 500}
            )
        }
    }
}

