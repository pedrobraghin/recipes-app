import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";

export class CategoriesController {
  constructor(categoriesService) {
    this.categoriesService = categoriesService;
  }

  async createCategory(req, res) {
    try {
      const categoryDto = req.body;
      const category = await this.categoriesService.createCategory(categoryDto);

      return res.status(StatusCodes.CREATED).json({
        status: "succces",
        data: category,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async listCategories(_req, res) {
    try {
      const categories = await this.categoriesService.listCategories();

      return res.status(StatusCodes.OK).json({
        status: "succces",
        results: categories.length,
        data: categories,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await this.categoriesService.deleteCategory(id);

      return res.status(StatusCodes.OK).json({
        status: "succces",
        data: category,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const categoryDto = req.body;
      const category = await this.categoriesService.updateCategory(
        id,
        categoryDto
      );

      return res.status(StatusCodes.OK).json({
        status: "succces",
        data: category,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }
}
