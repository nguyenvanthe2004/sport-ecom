const express = require("express");
const router = express.Router();
const upload = require("../config/middleware/multerConfig");
const uploadController = require("../app/controller/UploadController");

router.post("/single", upload.single("file"), uploadController.uploadImage);

router.post("/multiple", upload.array("files", 10), uploadController.uploadMultiple);

module.exports = router;