const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const ImageModel = require("../models/ImageModel");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");


const originalDir = path.join(__dirname, "../uploads/original");
const compressedDir = path.join(__dirname, "../uploads/compressed");
if (!fs.existsSync(originalDir)) fs.mkdirSync(originalDir, { recursive: true });
if (!fs.existsSync(compressedDir)) fs.mkdirSync(compressedDir, { recursive: true });


router.get("/register", (req, res) => {
  let success = req.flash("success");
  let error = req.flash("error");
  res.render("Register", { success, error });
});


router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded");


    const compressedBuffer = await sharp(file.buffer).jpeg({ quality: 100 }).toBuffer();

    // Save files to disk
    fs.writeFileSync(path.join(originalDir, file.originalname), file.buffer);
    fs.writeFileSync(path.join(compressedDir, file.originalname), compressedBuffer);

    // Save in DB
    await ImageModel.create({
      user: req.user ? req.user._id : null,
      originalName: file.originalname,
      originalSize: file.size,
      compressedSize: compressedBuffer.length,
      mimeType: file.mimetype,
      originalPath: `/uploads/original/${file.originalname}`,
      compressedPath: `/uploads/compressed/${file.originalname}`,
      compressionRatio: file.size / compressedBuffer.length,
      uploadedAt: Date.now()
    });

    req.flash("success", "Image uploaded and compressed successfully!");
    res.redirect("/images/images");
  } catch (err) {
    console.error(err);
    req.flash("error", "Upload failed");
    res.redirect("/");
  }
});

router.get("/convert",(req,res)=>{
  res.render("convert")
})

router.post("/convert", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const toFormat = req.body.toFormat.toLowerCase();

    if (!file) return res.status(400).send("No file uploaded");

    const originalName = path.parse(file.originalname).name;

    const outputDir = path.join(__dirname, "../uploads/converted");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${originalName}.${toFormat}`);

    // IMPORTANT FIX
    const resultBuffer = await sharp(file.buffer) // <---- buffer not path
      .toFormat(toFormat)
      .toBuffer();

    fs.writeFileSync(outputPath, resultBuffer);

    res.download(outputPath, `${originalName}.${toFormat}`);

  } catch (err) {
    console.log("❌ Conversion failed:", err);
    res.status(500).send("Image conversion failed");
  }
});



// GET home page
router.get("/", async (req, res) => {
  const success = req.flash("success");
  const error = req.flash("error");
  res.render("index", { success, error });
});

module.exports = router;
