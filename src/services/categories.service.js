import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
export class CategoriesService {
  constructor(categoriesRepository) {
    this.categoriesRepository = categoriesRepository;
  }

  async createCategory(dto) {
    const isCategoryAlreadyExistent = await this.categoriesRepository.getByName(
      dto.name
    );
    if (isCategoryAlreadyExistent) {
      throw new BadRequestError("Category name already exist");
    }

    const category = await this.categoriesRepository.createCategory(dto);
    return category;
  }

  async listCategories() {
    const categories = await this.categoriesRepository.list();
    return categories;
  }

  async getCategoryByName(name) {
    const category = await this.categoriesRepository.getByName(name);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }

  async deleteCategory(id) {
    const category = await this.categoriesRepository.deleteCategory(id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }

  async updateCategory(id, dto) {
    const category = await this.categoriesRepository.updateCategory(id, dto);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }

  async getCategoryById(id) {
    const category = await this.categoriesRepository.getById(id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }
}
