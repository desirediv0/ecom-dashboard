"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, XCircle } from "lucide-react";

export default function AddressForm({
  onSuccess,
  onCancel,
  existingAddress = null,
  isInline = false,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: existingAddress?.name || "",
    street: existingAddress?.street || "",
    city: existingAddress?.city || "",
    state: existingAddress?.state || "",
    postalCode: existingAddress?.postalCode || "",
    country: existingAddress?.country || "India", // Default to India
    phone: existingAddress?.phone || "",
    isDefault: existingAddress?.isDefault || false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.street.trim()) newErrors.street = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Sending address data:", formData);

      if (existingAddress) {
        // Update existing address
        const response = await fetchApi(
          `/users/addresses/${existingAddress.id}`,
          {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify(formData),
          }
        );

        if (!response.success) {
          throw new Error(response.message || "Failed to update address");
        }

        toast.success("Address updated successfully");
      } else {
        // Create new address
        const response = await fetchApi("/users/addresses", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to add address");
        }

        toast.success("Address added successfully");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.message || "Failed to save address");
      setErrors((prev) => ({ ...prev, general: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isInline ? "p-4 border rounded-lg mb-4" : ""}>
      {isInline && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Add New Address</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close form"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      )}

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="name">Full Name*</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="col-span-2">
            <Label htmlFor="street">Street Address*</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className={errors.street ? "border-red-500" : ""}
              placeholder="House number, Street, Apartment, etc."
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city">City*</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state">State*</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? "border-red-500" : ""}
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <Label htmlFor="postalCode">Postal Code*</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={errors.postalCode ? "border-red-500" : ""}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
            )}
          </div>

          <div>
            <Label htmlFor="country">Country*</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={errors.country ? "border-red-500" : ""}
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number*</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="col-span-2 flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isDefault" className="font-normal cursor-pointer">
              Set as default address
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {existingAddress ? "Update Address" : "Save Address"}
          </Button>
        </div>
      </form>
    </div>
  );
}
