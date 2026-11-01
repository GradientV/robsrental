/** a steady tilt between -range and +range degrees for any string, so every tape
 *  label is a little crooked but never jumps around between renders */
export function tiltFor(seed: string, range = 3): number {
    let hash = 0;
    for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
    return ((((hash % 1000) + 1000) % 1000) / 1000) * range * 2 - range;
}
