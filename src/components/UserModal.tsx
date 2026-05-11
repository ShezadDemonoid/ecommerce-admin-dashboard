import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { User } from "../types/user";

type UserForm = Omit<User, "_id" | "__v">;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: UserForm) => void;
  user?: User | null;
  submitText: string;
}

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  submitText,
}: UserModalProps) {
  // Initial Form
  const getInitialForm = (): UserForm => ({
    name: user?.name ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "",
    phone: user?.phone ?? "",
    website: user?.website ?? "",

    address: {
      city: user?.address?.city ?? "",
      street: user?.address?.street ?? "",
      suite: user?.address?.suite ?? "",
      zipcode: user?.address?.zipcode ?? "",
      geo: {
        lat: user?.address?.geo?.lat ?? 0,
        lng: user?.address?.geo?.lng ?? 0,
      },
    },

    company: {
      name: user?.company?.name ?? "",
      catchPhrase: user?.company?.catchPhrase ?? "",
      bs: user?.company?.bs ?? "",
    },
  });

  const [form, setForm] = useState<UserForm>(() => getInitialForm());
  const [showError, setShowError] = useState(false);

  const resetForm = () => {
    setForm(getInitialForm());
    setShowError(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const keys = name.split(".");

      // TOP LEVEL
      if (keys.length === 1) {
        return {
          ...prev,
          [keys[0]]: value,
        };
      }

      const [parent, child, grandchild] = keys;

      // ADDRESS
      if (parent === "address") {
        if (!child) return prev;

        if (child === "geo" && grandchild) {
          return {
            ...prev,
            address: {
              ...prev.address,
              geo: {
                ...prev.address.geo,
                [grandchild]: value,
              },
            },
          };
        }

        return {
          ...prev,
          address: {
            ...prev.address,
            [child]: value,
          },
        };
      }

      // COMPANY
      if (parent === "company") {
        if (!child) return prev;

        return {
          ...prev,
          company: {
            ...prev.company,
            [child]: value,
          },
        };
      }

      return prev;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setShowError(true);
      return;
    }

    onSubmit(form);
    resetForm();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* Wrapper */}
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
              <Dialog.Panel className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-lg font-semibold">
                    {submitText}
                  </Dialog.Title>

                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Basic fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Name *"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      error={showError && !form.name}
                    />

                    <Input
                      label="Username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                    />

                    <Input
                      label="Email *"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />

                    <Input
                      label="Role"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                    />

                    <Input
                      label="Phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />

                    <Input
                      label="Website"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Address */}
                  <h3 className="font-semibold">Address</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="address.city"
                      value={form.address.city}
                      onChange={handleChange}
                    />

                    <Input
                      label="Street"
                      name="address.street"
                      value={form.address.street}
                      onChange={handleChange}
                    />

                    <Input
                      label="Suite"
                      name="address.suite"
                      value={form.address.suite}
                      onChange={handleChange}
                    />

                    <Input
                      label="Zipcode"
                      name="address.zipcode"
                      value={form.address.zipcode}
                      onChange={handleChange}
                    />

                    <Input
                      label="Latitude"
                      name="address.geo.lat"
                      value={form.address.geo.lat}
                      onChange={handleChange}
                    />

                    <Input
                      label="Longitude"
                      name="address.geo.lng"
                      value={form.address.geo.lng}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Company */}
                  <h3 className="font-semibold">Company</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Company Name"
                      name="company.name"
                      value={form.company.name}
                      onChange={handleChange}
                    />

                    <Input
                      label="Catch Phrase"
                      name="company.catchPhrase"
                      value={form.company.catchPhrase}
                      onChange={handleChange}
                    />

                    <Input
                      label="Business"
                      name="company.bs"
                      value={form.company.bs}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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

/* Strict Input Component */
interface InputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: boolean;
}

function Input({ label, name, value, onChange, error }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded-lg p-3 text-sm outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
    </div>
  );
}
