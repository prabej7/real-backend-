import cloudinary from "../config/cloud";

const extractPublicId = (url: string): string => {
    const parts = url.split("/");
    const lastPart = parts.pop();
    if (!lastPart) {
        throw new Error("Invalid URL format");
    }
    const publicIdWithVersion = lastPart.split(".")[0].split("?")[0];
    return publicIdWithVersion;
};

const deleteFile = async (url: string | string[]): Promise<number> => {
    if (Array.isArray(url)) {
        const publicIds = url.map(extractPublicId);
        try {
            await new Promise((resolve, reject) => {
                cloudinary.api.delete_resources(publicIds, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(true);
                    }
                });
            });
        } catch (error) {
            console.error("Error deleting files:", error);
            throw error;
        }
    } else {
        const publicId = extractPublicId(url);
        try {
            await new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(publicId, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }
    return 1;
};

export default deleteFile;