import api from "./api";

// Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get all FAQs (admin)
export const getAllFaqs = async () => {
  try {
    const response = await api.get("/api/admin/faqs");

    // Handle different response structures
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      // If the response is { statusCode, data: [...], message, success }
      return {
        ...response,
        data: {
          faqs: response.data.data,
        },
      };
    }

    // Return original response for other formats
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all published FAQs (public)
export const getPublishedFaqs = async () => {
  const response = await api.get("/faqs");
  return response.data;
};

// Get FAQ by ID
export const getFaqById = async (id: string) => {
  const response = await api.get(`/api/admin/faqs/${id}`);
  return response.data;
};

// Create a new FAQ
export const createFaq = async (
  faqData: Omit<FAQ, "id" | "createdAt" | "updatedAt">
) => {
  const response = await api.post("/api/admin/faqs", faqData);
  return response.data;
};

// Update an existing FAQ
export const updateFaq = async (
  id: string,
  faqData: Partial<Omit<FAQ, "id" | "createdAt" | "updatedAt">>
) => {
  try {
    // If we're only updating isPublished or other fields but not question/answer,
    // we need to get the full FAQ first to include required fields
    if (!faqData.question || !faqData.answer) {
      const existingFaq = await getFaqById(id);
      const fullData = {
        ...existingFaq.data.faq,
        ...faqData,
      };

      // Ensure question and answer are included
      const updatePayload = {
        ...faqData,
        question: fullData.question,
        answer: fullData.answer,
      };

      const response = await api.put(`/api/admin/faqs/${id}`, updatePayload);
      return response.data;
    } else {
      // If question and answer are already included in the update, proceed normally
      const response = await api.put(`/api/admin/faqs/${id}`, faqData);
      return response.data;
    }
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw error;
  }
};

// Delete an FAQ
export const deleteFaq = async (id: string) => {
  const response = await api.delete(`/api/admin/faqs/${id}`);
  return response.data;
};

// Bulk update FAQ order
export const updateFaqOrder = async (faqs: { id: string; order: number }[]) => {
  try {
    console.log("Sending update order request with data:", { faqs });

    const response = await api.put("/api/admin/faqs/bulk-update-order", {
      faqs,
    });

    console.log("Update order response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating FAQ order:", error);

    // Log more details about the error
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }

    throw error;
  }
};

// Get all FAQ categories
export const getFaqCategories = async () => {
  const response = await api.get("/api/admin/faqs/categories");
  return response.data;
};
