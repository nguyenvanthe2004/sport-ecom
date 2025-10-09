class UploadController {
  uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      res.status(200).json({
        message: "Upload successful",
        filename: req.file.filename,
        path: `/images/${req.file.filename}`,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  uploadMultiple(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const filesInfo = req.files.map((file) => ({
        filename: file.filename,
        path: `/images/${file.filename}`,
      }));

      res.status(200).json({
        message: "Upload multiple successful",
        files: filesInfo,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UploadController();
