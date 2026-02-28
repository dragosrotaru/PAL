---
date: 2024-01-21
tags: [cryptography, hyper-ts, security, encryption]
---

# Layered key derivation scheme

Three-layer key chain used in HyperFS:

1. User **password** → derives a symmetric key
2. Symmetric key → decrypts an **RSA private key** (stored on disk)
3. RSA private key → decrypts a **config file**
4. Config file → contains the symmetric key used to **decrypt data**

Environment variables: `PASSWORD`, `PRIVATE_KEY_FILE_PATH`, `CONFIG_FILE_PATH`
Config file: `hyperconfig.json`

The indirection through RSA allows the config (and data key) to be re-encrypted
under a new password without re-encrypting all data — only the private key wrapper changes.
