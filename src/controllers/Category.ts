import mongoose from "mongoose";
import { Request, Response, RequestHandler } from "express";
import Category from "../models/Category";

//ADD CATEGORY
export const createCategory: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name required." });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exist." });
    }

    const newCategory = await Category.create({
      name,
    });

    res.status(201).json({
      message: "Category created successfully.",
      category: newCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create category.", details: error });
  }
};

// GET ALL CATEGORIES
export const getCategory: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const categories = await Category.find();

    if (!categories || categories.length === 0) {
      return res.status(200).json({ categories: [] });
    }

    res.status(200).json({ categories });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch categories.", details: error });
  }
};

// UPDATE CATEOGRY
export const updateCategory: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Category ID" });
    }

    const updateCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updateCategory) {
      return res.status(404).json({ error: "Category not found." });
    }
    res.status(200).json({
      message: "Category updated successfully.",
      category: updateCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update category.", details: error });
  }
};

//DELETE CATEGORY

export const deleteCategory: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Category ID" });
    }

    const deleteCategory = await Category.findByIdAndDelete(id);

    if (!deleteCategory) {
      res.status(404).json({ error: "Category is not found." });
    }

    res.status(200).json({ message: "Category deleted is successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete category.", details: error });
  }
};
