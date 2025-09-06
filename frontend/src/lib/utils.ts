/**
 * Utility function to concatenate class names conditionally.
 * Filters out falsy values and joins the rest with a space.
 *
 * @param inputs - List of class names or falsy values.
 * @returns A single string of class names.
 */
export function cn(...inputs: Array<string | false | null | undefined>): string {
    return inputs.filter(Boolean).join(" ");
}