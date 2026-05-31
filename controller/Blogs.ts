import { Request, Response } from "express";
import Blog from "../model/Blog";
import { deleteCloudinaryImage } from "../utils/cloudinarySignature";
import { articalSchema } from "../schema/schema";

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await articalSchema.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
};

export const addBlog = async (req: Request, res: Response) => {
  try {
    const {
      title,
      category,
      date,
      readTime,
      imgUrl,
      excerpt,
      aiSummary,
      topics,
      content,
    } = req.body;

    const newBlog = new Blog({
      title,
      category,
      date,
      readTime,
      imgUrl,
      excerpt,
      aiSummary,
      topics,
      content,
    });

    const savedBlog = await newBlog.save();

    res.status(201).json({ message: "Blog created successfully", blog: savedBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Failed to create blog" });
  }
};
export const editBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingBlog = await articalSchema.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (
      updateData.imgUrl &&
      updateData.imgUrl.public_id &&
      existingBlog.imgUrl &&
      existingBlog.imgUrl.public_id &&
      updateData.imgUrl.public_id !== existingBlog.imgUrl.public_id
    ) {
      await deleteCloudinaryImage(existingBlog.imgUrl.public_id);
    }

    const updatedBlog = await Blog.edit(id as string, updateData);

    res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Failed to update blog" });
  }
};
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await articalSchema.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.imgUrl && blog.imgUrl.public_id) {
      await deleteCloudinaryImage(blog.imgUrl.public_id);
    }

    const deletedBlog = await Blog.delete(id as string);

    res.status(200).json({ message: "Blog deleted successfully", blog: deletedBlog });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};
