import crypto from "crypto";
import fs from "fs";
import path from "path";

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || "local";
const STORAGE_LOCAL_DIR = process.env.STORAGE_LOCAL_DIR || "./.storage";
const APP_SECRET = process.env.APP_SECRET || "fernum_dev_secret_key_32_bytes_min!";

export interface UploadOptions {
  organizationId: string;
  workspaceId: string;
  filename: string;
  data: Buffer | string;
  contentType: string;
}

export interface StoredAsset {
  key: string;
  signedUrl: string;
  sizeBytes: number;
}

/**
 * Storage service supporting both local disk (zero keys) and S3/R2/MinIO
 */
export class StorageService {
  private localDir: string;

  constructor() {
    this.localDir = path.resolve(process.cwd(), STORAGE_LOCAL_DIR);
    if (!fs.existsSync(this.localDir)) {
      fs.mkdirSync(this.localDir, { recursive: true });
    }
  }

  /**
   * Generates a tamper-proof HMAC token for local signed URLs
   */
  private generateLocalSignature(key: string, expiresAt: number): string {
    const payload = `${key}:${expiresAt}`;
    return crypto.createHmac("sha256", APP_SECRET).update(payload).digest("hex");
  }

  /**
   * Verifies if a signed URL signature is valid and non-expired
   */
  public verifySignature(key: string, expiresAt: number, signature: string): boolean {
    if (Date.now() > expiresAt) return false;
    const expected = this.generateLocalSignature(key, expiresAt);
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  }

  /**
   * Upload an asset to storage (scoped to org/workspace)
   */
  public async uploadAsset(options: UploadOptions): Promise<StoredAsset> {
    const safeKey = `${options.organizationId}/${options.workspaceId}/${Date.now()}-${options.filename}`;

    if (STORAGE_PROVIDER === "s3" && process.env.S3_BUCKET) {
      // In production or when S3 is enabled
      const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
      const client = new S3Client({
        region: process.env.S3_REGION || "auto",
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || "",
          secretAccessKey: process.env.S3_SECRET_KEY || "",
        },
      });

      const buffer = Buffer.isBuffer(options.data) ? options.data : Buffer.from(options.data);
      await client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: safeKey,
          Body: buffer,
          ContentType: options.contentType,
        })
      );

      const signedUrl = await this.getSignedUrl(safeKey, 3600);
      return {
        key: safeKey,
        signedUrl,
        sizeBytes: buffer.length,
      };
    }

    // Default Local Mode: zero external dependencies
    const targetPath = path.join(this.localDir, safeKey);
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const buffer = Buffer.isBuffer(options.data) ? options.data : Buffer.from(options.data);
    fs.writeFileSync(targetPath, buffer);

    const signedUrl = await this.getSignedUrl(safeKey, 3600);
    return {
      key: safeKey,
      signedUrl,
      sizeBytes: buffer.length,
    };
  }

  /**
   * Returns a signed URL (S3 presigned URL or HMAC signed local URL)
   */
  public async getSignedUrl(key: string, expiresInSec: number = 3600): Promise<string> {
    if (STORAGE_PROVIDER === "s3" && process.env.S3_BUCKET) {
      const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
      const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
      const client = new S3Client({
        region: process.env.S3_REGION || "auto",
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || "",
          secretAccessKey: process.env.S3_SECRET_KEY || "",
        },
      });
      return getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
        }),
        { expiresIn: expiresInSec }
      );
    }

    // Local signed URL with expiration and HMAC
    const expiresAt = Date.now() + expiresInSec * 1000;
    const sig = this.generateLocalSignature(key, expiresAt);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return `${baseUrl}/api/storage/${key}?expires=${expiresAt}&sig=${sig}`;
  }

  /**
   * Read file buffer for local verification
   */
  public getLocalFile(key: string): { data: Buffer; contentType: string } | null {
    const fullPath = path.join(this.localDir, key);
    if (!fs.existsSync(fullPath)) return null;

    const data = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".webp": "image/webp",
      ".mp4": "video/mp4",
      ".mp3": "audio/mpeg",
      ".json": "application/json",
    };
    return { data, contentType: mimeMap[ext] || "application/octet-stream" };
  }
}

export const storage = new StorageService();
