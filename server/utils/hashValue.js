import crypto from "crypto"

export function hashWithAlgorithm(algorithm, data) {
    const hash = crypto.createHash(algorithm);
    hash.update(data);
    return hash.digest('hex');
}