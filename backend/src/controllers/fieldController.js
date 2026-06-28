const Field = require("../models/Field");

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getFields = async (req, res, next) => {
  try {
    const { fieldType, search } = req.query;
    const filter = { isActive: true };

    if (fieldType) {
      filter.fieldType = fieldType;
    }

    if (search) {
      const safeSearch = escapeRegex(search);

      // Search by field name or location while keeping the query case-insensitive.
      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { location: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const fields = await Field.find(filter).sort({ createdAt: -1 });

    res.status(200).json(fields);
  } catch (error) {
    next(error);
  }
};

const getFieldById = async (req, res, next) => {
  try {
    const field = await Field.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!field) {
      res.status(404);
      throw new Error("Field not found");
    }

    res.status(200).json(field);
  } catch (error) {
    next(error);
  }
};

const createField = async (req, res, next) => {
  try {
    const field = await Field.create(req.body);

    res.status(201).json(field);
  } catch (error) {
    next(error);
  }
};

const updateField = async (req, res, next) => {
  try {
    const field = await Field.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!field) {
      res.status(404);
      throw new Error("Field not found");
    }

    res.status(200).json(field);
  } catch (error) {
    next(error);
  }
};

const deleteField = async (req, res, next) => {
  try {
    const field = await Field.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!field) {
      res.status(404);
      throw new Error("Field not found");
    }

    res.status(200).json({
      message: "Field deleted successfully",
      field,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createField,
  deleteField,
  getFieldById,
  getFields,
  updateField,
};
