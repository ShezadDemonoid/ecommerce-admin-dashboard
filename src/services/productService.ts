import API from "../api/axios";
import type { Product, NewProduct } from "../types/product";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await API.get<Product[]>("/products");
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error)
      console.error("Error fetching products:", err.message);
    else console.error("Unknown error fetching products:", err);
    return [];
  }
};

export const addProduct = async (
  product: NewProduct,
): Promise<Product | null> => {
  try {
    const res = await API.post<Product>("/products", product);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error)
      console.error("Error adding product:", err.message);
    else console.error("Unknown error adding product:", err);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await API.delete(`/products/${id}`);
    return true;
  } catch (err: unknown) {
    if (err instanceof Error)
      console.error("Error deleting product:", err.message);
    else console.error("Unknown error deleting product:", err);
    return false;
  }
};

export const updateProduct = async (
  id: string,
  product: NewProduct,
): Promise<Product | null> => {
  try {
    const { data } = await API.patch<Product>(`/products/${id}`, product);
    return data;
  } catch (error) {
    console.error("updateProduct error:", error);
    return null;
  }
};
