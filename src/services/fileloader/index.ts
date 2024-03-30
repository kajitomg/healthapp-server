require('dotenv').config()
import multer, {FileFilterCallback} from "multer"
import fs from "fs"
import uploadPath from "../../helpers/upload-path";
import {Request} from "express";
import {ApiError} from "../../exceptions/api-error";

import uuid from 'uuid'


class FileloadService {
  static fileName: string
  
  static storage(dir: string) {
    return multer.diskStorage({
      destination: (req: Request, file, cb: Function) => {
        this.fileName = uuid.v4()
        const uploadsPath = this.generatePath(dir);
        const expansion = file.originalname.split('.')[file.originalname.split('.').length - 1]
        if (!fs.existsSync(uploadsPath)) {
          fs.mkdirSync(uploadsPath, {recursive: true});
        }
        req.body.path = uploadPath([this.generatePath(dir, false), `${this.fileName}.${expansion}`], 'filepath')
        cb(null, uploadsPath);
      },
      filename: (req: Request, file, cb: Function) => {
        const expansion = file.originalname.split('.')[file.originalname.split('.').length - 1]
        
        cb(null, `${this.fileName}.${expansion}`);
      },
    })
  };
  
  static upload(dir: string, filetypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']) {
    return multer({
      storage: this.storage(dir),
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB
      },
      fileFilter: (req: Request, file, cb: FileFilterCallback) => {
        if (!filetypes.includes(file.mimetype)) {
          const error = ApiError.BadRequest('Неверный тип файла')
          return cb(error, false);
        }
        cb(null, true);
      },
      
    });
  }
  
  static generatePath(dir: string, full: boolean = true) {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    if (full)
      return uploadPath([dir, year, month, day]);
    return uploadPath([dir, year, month, day], 'filepath');
  };
}

export {FileloadService}