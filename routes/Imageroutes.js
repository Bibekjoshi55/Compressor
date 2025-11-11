const express = require("express");
const router = express.Router();
const ImageModel = require("../models/ImageModel");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");


router.get("/images", async (req, res) => {
  try {
    const images = await ImageModel.find({ user: req.user ? req.user._id : null }).sort({ uploadedAt: -1 });
    res.render("Images", { images });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load images");
  }
});

// POST recompress
router.post("/:id/compress", async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);
    if (!image) return res.status(404).send("Image not found");

    
    const originalFile = path.join(__dirname, "../uploads/original", image.originalName);
    const compressedFile = path.join(__dirname, "../uploads/compressed", image.originalName);

    if (!fs.existsSync(originalFile)) return res.status(404).send("Original file missing");

    const newCompressedBuffer = await sharp(originalFile).jpeg({ quality: 50 }).toBuffer();
    fs.writeFileSync(compressedFile, newCompressedBuffer);

    image.compressedSize = newCompressedBuffer.length;
    image.compressionRatio = image.originalSize / newCompressedBuffer.length;
    await image.save();

    res.redirect("/images/images");
  } catch (err) {
    console.error(err);
    res.status(500).send("Compression failed");
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);

    if (!image) return res.redirect("/images");

    // remove both original & compressed file from uploads
    const fs = require("fs");
    if (fs.existsSync(image.originalPath)) fs.unlinkSync(image.originalPath);
    if (fs.existsSync(image.compressedPath)) fs.unlinkSync(image.compressedPath);

    await ImageModel.findByIdAndDelete(req.params.id);

    res.redirect("/images/images");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting image");
  }
});


module.exports = router;
