const express = require("express");
const {
  createField,
  deleteField,
  getFieldById,
  getFields,
  updateField,
} = require("../controllers/fieldController");
const { admin } = require("../middlewares/adminMiddleware");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getFields);
router.get("/:id", getFieldById);

router.post("/", protect, admin, createField);
router.patch("/:id", protect, admin, updateField);
router.delete("/:id", protect, admin, deleteField);

module.exports = router;
