import { UploadApiErrorResponse } from "cloudinary";
import cloud from "../config/cloud";
import path from "path";
import { generate } from 'randomstring'

export const uploadFile = async (file: Express.Multer.File) => {
    return new Promise((resolve, reject) => {

        const uploadResult = cloud.uploader.upload_stream(
            {
                public_id: path.parse(generate(6) + file.originalname).name,
            },
            async (err: UploadApiErrorResponse | undefined, result: any) => {
                if (err) {
                    return 1;
                }

                const optimizedUrl = cloud.url(result.public_id, {
                    fetch_format: "auto",
                    quality: "auto",
                });

                if (optimizedUrl) {
                    resolve(optimizedUrl);
                }
            }
        );
        uploadResult.end(file.buffer);
    });
};

