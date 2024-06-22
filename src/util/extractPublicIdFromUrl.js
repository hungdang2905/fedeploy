export default function extractPublicIdFromUrl(url) {
    const regex = /\/([^/]+)\.\w+$/;
    const match = url.match(regex);
    if (match) {
        return match[1];
    }
    return null;
}