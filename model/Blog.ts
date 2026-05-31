import { articalSchema } from "../schema/schema";

type UploadedFile = {
  url: string;
  public_id: string;
};
class Blog {
  title: string;
  category: string;
  date: Date;
  readTime: string;
  imgUrl: UploadedFile;
  excerpt: string;
  aiSummary?: string;
  topics: string[];
  content: string;
  constructor(data: {
    title: string;
    category: string;
    date?: Date;
    readTime: string;
    imgUrl: UploadedFile;
    excerpt: string;
    aiSummary?: string;
    topics: string[];
    content: string;
  }) {
    this.title = data.title;
    this.category = data.category;
    this.date = data.date ?? new Date();
    this.readTime = data.readTime;
    this.imgUrl = data.imgUrl;
    this.excerpt = data.excerpt;
    this.aiSummary = data.aiSummary;
    this.topics = data.topics;
    this.content = data.content;
  }

  async save() {
    const saved = await articalSchema.create({
      category: this.category,
      content: this.content,
      date: this.date,
      excerpt: this.excerpt,
      imgUrl: this.imgUrl,
      readTime: this.readTime,
      title: this.title,
      topics: this.topics,
    });
    return saved;
  }
  static async edit(
    id: string,
    data: {
      title?: string;
      category?: string;
      date?: Date;
      readTime?: string;
      imgUrl?: UploadedFile;
      excerpt?: string;
      aiSummary?: string;
      topics?: string[];
      content?: string;
    }
  ) {
    const updatedBlog = await articalSchema.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedBlog;
  }
  static async delete(id: string) {
    const deletedBlog = await articalSchema.findByIdAndDelete(id);
    return deletedBlog;
  }
}
export default Blog;
