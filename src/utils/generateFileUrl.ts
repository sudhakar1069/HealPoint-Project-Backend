export const generateFileUrl = (req: any, filename?: string | null) => {
    if (!filename) return null;
    return `https://${req.get("host")}/uploads/${filename}`;
};