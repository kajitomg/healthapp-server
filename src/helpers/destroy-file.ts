import fs from "fs"
import uploadPath from "./upload-path";

export default function (files: { path: string }[]) {
  const deleteDir = (filePath: string[]) => {
    const dir = JSON.parse(JSON.stringify(filePath))
    dir.pop()
    console.log(dir)
    if (dir.length === 0) return
    fs.readdir(uploadPath(dir), (err, files) => {
      if (files.length === 0) {
        fs.rmdir(uploadPath(dir), () => {
        });
        return deleteDir(dir)
      }
    });
  }
  files.map((file) => {
    const filePath = uploadPath([file.path])
    
    fs.unlinkSync(filePath);
  })
  files.map((file) => {
    const filePath = file.path.split('\\')
    
    deleteDir(filePath)
  })
}