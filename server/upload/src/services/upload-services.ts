import { Request, Response } from "express";
import { upload } from "../config";

class UploadService {
    async uploadAndPublish(req: Request, res: Response) {
        try {
            const uploadFile = upload.array('spray[]')
            uploadFile(req, res, function(err) {
                if (err) return 500
            })
        } catch (e) {
            throw e
        }
    }
}