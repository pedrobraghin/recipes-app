import { CategoryModel } from "../schemas/category.schema.js";

export class CategoriesRepository {
  async createCategory(dto) {
    const category = await CategoryModel.create(dto);
    return category;
  }

  async getByName(name) {
    const category = await CategoryModel.findOne({ name });
    return category;
  }

  async getById(id) {
    const category = await CategoryModel.findById(id);
    return category;
  }

  async deleteCategory(id) {
    const category = await CategoryModel.findByIdAndDelete(id);
    return category;
  }

  async updateCategory(id, dto) {
    const category = await CategoryModel.findByIdAndUpdate(id, dto);
    return category;
  }

  async list() {
    const categories = await CategoryModel.find();
    return categories;
  }
}
