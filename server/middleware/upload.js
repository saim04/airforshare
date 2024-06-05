// const multer = require("multer");

// const upload = multer({ dest: "uploads" });

// module.exports = upload;

// const multer = require("multer");

// // Configure Multer to use memory storage
// const storage = multer.memoryStorage();

// const upload = multer({ storage: storage });

// module.exports = upload;

const multer = require("multer");
const path = require("path");

// Configure Multer to use the /tmp directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
