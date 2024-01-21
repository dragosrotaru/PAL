export const AES_256_GCM = "aes-256-gcm";

export const NO_ENCRYPTION = "no-encryption";

export type FileEncryption = typeof AES_256_GCM | typeof NO_ENCRYPTION;
