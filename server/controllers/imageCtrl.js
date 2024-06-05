const File = require("../model/File");
const fs = require("fs/promises");
const path = require("path");
const JSZip = require("jszip");

const imageCtrl = {
  uploadFile: async (req, res) => {
    try {
      for (const f of req.files) {
        await File.create({
          ip: req.ip,
          path: f.path,
          type: f.mimetype,
          name: f.filename,
          originalname: f.originalname,
        });
      }
      return res.status(200).json({ msg: "Uploaded successfully" });
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  },
  getFiles: async (req, res) => {
    try {
      const files = await File.find({ ip: req.ip });

      const filesToDelete = files.filter((file) => {
        return Math.floor((Date.now() - file.createAt) / (1000 * 60)) > 29;
      });

      for (const file of filesToDelete) {
        await File.findByIdAndDelete(file._id);
        await removeFile(
          path.join(__dirname, "..", "/uploads", `${file.name}`)
        );
      }

      const remainingFiles = files.filter(
        (file) => !filesToDelete.includes(file)
      );

      return res.status(200).json({ files: remainingFiles });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteAll: async (req, res) => {
    try {
      const files = await File.find({ ip: req.ip });
      console.log("Before", files);

      for (const file of files) {
        await File.findByIdAndDelete(file._id);
        await removeFile(
          path.join(__dirname, "..", "/uploads", `${file.name}`)
        );
      }

      return res.status(200).json({ msg: "Deleted All files" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteSingle: async (req, res) => {
    const { filenames } = req.body;
    try {
      console.log(filenames);
      for (const file of filenames) {
        await File.findByIdAndDelete(file._id);
        await removeFile(
          path.join(__dirname, "..", "/uploads", `${file.name}`)
        );
      }

      return res.status(200).json({ msg: "Deleted Files" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  downloadAll: async (req, res) => {
    const { filenames } = req.body;
    const zip = new JSZip();
    try {
      for (const f of filenames) {
        const file = await fs.readFile(
          path.join(__dirname, "..", "uploads", `${f.name}`)
        );
        zip.file(f.originalname, file);
      }
      const zipData = await zip.generateAsync({ type: "nodebuffer" });
      res.set("Content-Disposition", 'attachment; filename="files.zip"');
      res.set("Content-Type", "application/zip");
      res.status(200).send(zipData);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ msg: "Error" });
    }
  },
};

const removeFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log("File deleted successfully");
  } catch (err) {
    console.error("Error deleting file:", err);
  }
};

module.exports = imageCtrl;
