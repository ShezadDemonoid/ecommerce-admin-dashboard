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
  // Initial Form
  const getInitialForm = (): NewProduct => ({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price ?? 0,
    discountPercentage: product?.discountPercentage ?? undefined,
    rating: product?.rating ?? undefined,
    stock: product?.stock ?? undefined,
    brand: product?.brand || "",
    category: product?.category || "",
    thumbnail: product?.thumbnail || "",
    images: product?.images || [],
  });

  // State
  const [form, setForm] = useState<NewProduct>(() => getInitialForm());
  const [showError, setShowError] = useState(false);

  // Reset Form
  const resetForm = () => {
    setForm(getInitialForm());
    setShowError(false);
  };

  // Close Modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number | undefined = value;

    if (type === "number") {
      parsedValue = value === "" ? undefined : Number(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setShowError(true);
      return;
    }

    onSubmit(form);

    resetForm();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        open={isOpen}
        onClose={handleClose}
      >
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
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* Modal Wrapper */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="
                  w-full
                  max-w-2xl
                  max-h-[90vh]
                  overflow-y-auto
                  rounded-2xl
                  bg-white
                  p-4
                  shadow-xl
                  sm:p-6
                "
              >
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold sm:text-xl">
                    {submitText}
                  </Dialog.Title>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="
                      rounded-lg
                      p-2
                      text-gray-500
                      hover:bg-gray-100
                    "
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Title */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Title *</label>

                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className={`
                        rounded-lg
                        border
                        p-3
                        text-sm
                        outline-none
                        transition
                        focus:border-blue-500
                        ${
                          showError && !form.title.trim()
                            ? "border-red-500"
                            : "border-gray-300"
                        }
                      `}
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Description *</label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      className={`
                        rounded-lg
                        border
                        p-3
                        text-sm
                        outline-none
                        transition
                        focus:border-blue-500
                        ${
                          showError && !form.description.trim()
                            ? "border-red-500"
                            : "border-gray-300"
                        }
                      `}
                    />
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Price */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Price</label>

                      <input
                        type="number"
                        name="price"
                        value={form.price ?? ""}
                        onChange={handleChange}
                        className="
                          rounded-lg
                          border
                          border-gray-300
                          p-3
                          text-sm
                          outline-none
                          focus:border-blue-500
                        "
                      />
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Rating</label>

                      <input
                        type="number"
                        name="rating"
                        value={form.rating ?? ""}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        max="5"
                        className="
                          rounded-lg
                          border
                          border-gray-300
                          p-3
                          text-sm
                          outline-none
                          focus:border-blue-500
                        "
                      />
                    </div>

                    {/* Stock */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Stock</label>

                      <input
                        type="number"
                        name="stock"
                        value={form.stock ?? ""}
                        onChange={handleChange}
                        min="0"
                        className="
                          rounded-lg
                          border
                          border-gray-300
                          p-3
                          text-sm
                          outline-none
                          focus:border-blue-500
                        "
                      />
                    </div>

                    {/* Brand */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Brand</label>

                      <input
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        className="
                          rounded-lg
                          border
                          border-gray-300
                          p-3
                          text-sm
                          outline-none
                          focus:border-blue-500
                        "
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Category</label>

                    <input
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="
                        rounded-lg
                        border
                        border-gray-300
                        p-3
                        text-sm
                        outline-none
                        focus:border-blue-500
                      "
                    />
                  </div>

                  {/* Thumbnail */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Thumbnail URL</label>

                    <input
                      type="text"
                      name="thumbnail"
                      value={form.thumbnail}
                      onChange={handleChange}
                      className="
                        rounded-lg
                        border
                        border-gray-300
                        p-3
                        text-sm
                        outline-none
                        focus:border-blue-500
                      "
                    />
                  </div>

                  {/* Actions */}
                  <div
                    className="
                      mt-4
                      flex
                      flex-col-reverse
                      gap-3
                      sm:flex-row
                      sm:justify-end
                    "
                  >
                    <button
                      type="button"
                      onClick={handleClose}
                      className="
                        w-full
                        rounded-lg
                        border
                        px-4
                        py-3
                        text-sm
                        font-medium
                        sm:w-auto
                      "
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="
                        w-full
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-white
                        hover:bg-blue-700
                        sm:w-auto
                      "
                    >
                      {submitText}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
