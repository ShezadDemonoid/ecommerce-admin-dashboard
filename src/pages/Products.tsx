import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import type { Product, NewProduct } from "../types/product";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  form: NewProduct;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [form, setForm] = useState<NewProduct>({
    title: "",
    description: "",
    price: 0,
    brand: "",
    category: "",
    thumbnail: "",
    images: [],
  });

  // Fetch products
  useEffect(() => {
    async function fetch() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    fetch();
  }, []);

  // Form change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add product
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProd = await addProduct(form);
    if (newProd) {
      setProducts([newProd, ...products]);
      setAddModalOpen(false);
      resetForm();
    }
  };

  // Edit product
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = await updateProduct(editingProduct._id, form);
    if (updated) {
      setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
      setEditModalOpen(false);
      setEditingProduct(null);
      resetForm();
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const success = await deleteProduct(id);
      if (success) setProducts(products.filter((p) => p._id !== id));
      else alert("Failed to delete product");
    }
  };

  // Open edit modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      brand: product.brand || "",
      category: product.category || "",
      thumbnail: product.thumbnail || "",
      images: product.images || [],
    });
    setEditModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: 0,
      brand: "",
      category: "",
      thumbnail: "",
      images: [],
    });
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Product
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
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
                  className="px-2 py-1 bg-green-600 text-white rounded"
                  onClick={() => openEditModal(p)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Product Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Product"
        form={form}
        onChange={handleChange}
        onSubmit={handleAdd}
      />

      {/* Edit Product Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Product"
        form={form}
        onChange={handleChange}
        onSubmit={handleEdit}
      />
    </div>
  );
}

// Reusable Modal component
function Modal({
  isOpen,
  onClose,
  title,
  form,
  onChange,
  onSubmit,
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white p-6 rounded shadow-md w-96">
              <Dialog.Title className="text-lg font-bold mb-4">
                {title}
              </Dialog.Title>
              <form onSubmit={onSubmit} className="flex flex-col gap-2">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={onChange}
                  required
                  className="border p-2 rounded"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={onChange}
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={onChange}
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="brand"
                  placeholder="Brand"
                  value={form.brand}
                  onChange={onChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={form.category}
                  onChange={onChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="thumbnail"
                  placeholder="Thumbnail URL"
                  value={form.thumbnail}
                  onChange={onChange}
                  className="border p-2 rounded"
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Submit
                </button>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
