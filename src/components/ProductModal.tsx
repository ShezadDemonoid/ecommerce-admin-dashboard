import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { Product, NewProduct } from "../types/product";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: NewProduct) => void;
  product?: Product | null;
  submitText: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  submitText,
}: ProductModalProps) {
  const getInitialForm = (): NewProduct => ({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || 0,
    discountPercentage: product?.discountPercentage,
    rating: product?.rating,
    stock: product?.stock,
    brand: product?.brand || "",
    category: product?.category || "",
    thumbnail: product?.thumbnail || "",
    images: product?.images || [],
  });

  const [form, setForm] = useState<NewProduct>(getInitialForm);
  const [showError, setShowError] = useState(false);

  // Reset form when opening modal
  const handleOpen = () => {
    setForm(getInitialForm());
    setShowError(false);
  };

  const handleClose = () => {
    onClose();
    setShowError(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;

    setForm((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setShowError(true);
      return;
    }

    onSubmit(form);
    handleClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment} afterEnter={handleOpen}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Overlay */}
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

        {/* Modal */}
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
                {submitText}
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                {/* Title */}
                <input
                  type="text"
                  name="title"
                  placeholder="Title *"
                  value={form.title}
                  onChange={handleChange}
                  className={`border p-2 rounded ${
                    showError && !form.title.trim() ? "border-red-500" : ""
                  }`}
                />

                {/* Description */}
                <textarea
                  name="description"
                  placeholder="Description *"
                  value={form.description}
                  onChange={handleChange}
                  className={`border p-2 rounded ${
                    showError && !form.description.trim()
                      ? "border-red-500"
                      : ""
                  }`}
                />

                {/* Optional fields */}
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />

                <input
                  type="text"
                  name="brand"
                  placeholder="Brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />

                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={form.category}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />

                <input
                  type="text"
                  name="thumbnail"
                  placeholder="Thumbnail URL"
                  value={form.thumbnail}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    {submitText}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
