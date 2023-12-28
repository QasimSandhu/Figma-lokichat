const multer = require('multer');

export const upload = multer({
  storage: multer.memoryStorage(),
  limits:{
    fileSize: 10 * 1024 * 1024, // limit file size to 10MB
  }
});
