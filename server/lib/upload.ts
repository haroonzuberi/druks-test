import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { HttpError } from "./http";

const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Validates and stores an uploaded image.
 * Returns the public path to save on the restaurant, e.g. "/uploads/<uuid>.jpg".
 */
export async function saveImage(file: File): Promise<string> {
    if (file.size === 0) {
        throw new HttpError(400, "The uploaded file is empty", {
            image: ["The uploaded file is empty"],
        });
    }

    if (file.size > MAX_BYTES) {
        throw new HttpError(400, "Image must be under 5 MB", {
            image: ["Image must be under 5 MB"],
        });
    }

    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
        throw new HttpError(400, "Only JPEG, PNG or WebP images are allowed", {
            image: ["Only JPEG, PNG or WebP images are allowed"],
        });
    }

    // Generate our own filename. The browser-supplied name is untrusted input:
    // something like "../../server/lib/db.ts" would otherwise escape this folder.
    const filename = `${randomUUID()}.${extension}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));

    return `/uploads/${filename}`;
}