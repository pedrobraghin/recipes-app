import multer from "multer";

const localStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/imgs/recipes");
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
export const upload = multer({ storage: localStorage });
