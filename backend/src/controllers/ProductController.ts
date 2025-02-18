import { Request, Response } from "express";
import Product from "../models/Product";

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll();
  res.json(products);
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, description } = req.body;
  const newProduct = await Product.create({ name, price, description });
  res.json(newProduct);
};
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    await product.update({ name, price, description });
    res.json({ message: "Producto actualizado con éxito", product });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto", error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    await product.destroy();
    res.json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto", error });
  }
};
