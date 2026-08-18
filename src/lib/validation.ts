export function isValidFullName(name: string): boolean {
    //letters, spaces, hyphens, apostrophes only - no digits or other symbols
    const nameRegex = /^[A-Za-z\s'-]+$/;
    return nameRegex.test(name.trim()) && name.trim().length > 0;
}