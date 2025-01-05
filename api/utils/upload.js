import multer from "multer";

export const upload = (mimeList = []) =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = "./api/uploads";
        // console.log("Destination:", uploadDir);
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        cb(null, `file${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (mimeList.length > 0) {
        if (mimeList.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("File type not supported"));
        }
      } else cb(null, true);
    },
  });
