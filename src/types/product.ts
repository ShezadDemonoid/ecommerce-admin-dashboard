export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
}

export type NewProduct = Omit<Product, "_id"> &
  Partial<
    Pick<
      Product,
      | "discountPercentage"
      | "rating"
      | "stock"
      | "brand"
      | "category"
      | "thumbnail"
      | "images"
    >
  >;
