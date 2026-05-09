import { useEffect, useState } from "react";
import ProductModal from "../components/ProductModal";
import type { Product, NewProduct } from "../types/product";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  // Submit Handler
  const handleSubmit = async (form: NewProduct) => {
    if (editingProduct) {
      const updated = await updateProduct(editingProduct._id, form);

      if (updated) {
        setProducts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p)),
        );
      }
    } else {
      const created = await addProduct(form);

      if (created) {
        setProducts((prev) => [created, ...prev]);
      }
    }

    setModalOpen(false);
    setEditingProduct(null);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    const success = await deleteProduct(id);

    if (success) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  // Open Add
  const openAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  // Open Edit
  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>

          <p className="text-sm text-gray-500">Manage your product inventory</p>
        </div>

        <button
          onClick={openAdd}
          className="
            rounded-xl
            bg-blue-600
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          Add Product
        </button>
      </div>

      {/* Table Card */}
      <div
        className="
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-sm
          ring-1
          ring-gray-200
        "
      >
        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* Head */}
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Product
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Price
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Stock
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Rating
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-right
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100 bg-white">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition">
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {/* Image */}
                      <div
                        className="
                          h-16
                          w-16
                          overflow-hidden
                          rounded-xl
                          bg-gray-100
                          shrink-0
                        "
                      >
                        {p.thumbnail ? (
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              items-center
                              justify-center
                              text-xs
                              text-gray-400
                            "
                          >
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-sm
                            font-semibold
                            text-gray-900
                          "
                        >
                          {p.title}
                        </p>

                        <p
                          className="
                            mt-1
                            line-clamp-1
                            text-sm
                            text-gray-500
                          "
                        >
                          {p.category || "No category"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">${p.price}</span>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    <span
                      className="
                        inline-flex
                        rounded-full
                        bg-gray-100
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-gray-700
                      "
                    >
                      {p.stock ?? 0}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4">
                    <span className="text-sm">⭐ {p.rating ?? "-"}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div
                      className="
                        flex
                        justify-end
                        gap-2
                      "
                    >
                      <button
                        onClick={() => openEdit(p)}
                        className="
                          rounded-lg
                          bg-green-600
                          px-3
                          py-2
                          text-xs
                          font-medium
                          text-white
                          transition
                          hover:bg-green-700
                        "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p._id)}
                        className="
                          rounded-lg
                          bg-red-600
                          px-3
                          py-2
                          text-xs
                          font-medium
                          text-white
                          transition
                          hover:bg-red-700
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
        product={editingProduct}
        submitText={editingProduct ? "Update Product" : "Add Product"}
      />
    </div>
  );
}
