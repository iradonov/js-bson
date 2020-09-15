import { Buffer } from 'buffer';

/**
 * Makes sure that, if a Uint8Array is passed in, it is wrapped in a Buffer.
 *
 * @param potentialBuffer - The potential buffer
 * @returns Buffer the input if potentialBuffer is a buffer, or a buffer that
 * wraps a passed in Uint8Array
 * @throws TypeError If anything other than a Buffer or Uint8Array is passed in
 */
export function ensureBuffer(potentialBuffer: Buffer | Uint8Array): Buffer {
  if (potentialBuffer instanceof Buffer) {
    return potentialBuffer;
  }

  if (potentialBuffer instanceof Uint8Array) {
    return Buffer.from(potentialBuffer.buffer);
  }

  throw new TypeError('Must use either Buffer or Uint8Array');
}
