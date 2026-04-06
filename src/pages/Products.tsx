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

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // ADD / EDIT handler (single source of truth)
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    const success = await deleteProduct(id);
    if (success) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const openAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Product
        </button>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Thumbnail</th>
            <th className="border p-2 text-left">Title</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="border p-2">
                {p.thumbnail ? (
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  "-"
                )}
              </td>

              <td className="border p-2">{p.title}</td>
              <td className="border p-2">${p.price}</td>
              <td className="border p-2">{p.stock ?? "-"}</td>
              <td className="border p-2">{p.rating ?? "-"}</td>

              <td className="border p-2 flex gap-2 justify-center">
                <button
                  onClick={() => openEdit(p)}
                  className="px-2 py-1 bg-green-600 text-white rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        product={editingProduct}
        submitText={editingProduct ? "Update Product" : "Add Product"}
      />
    </div>
  );
}
