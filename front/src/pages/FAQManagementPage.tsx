import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllFaqs,
  deleteFaq,
  updateFaq,
  updateFaqOrder,
  FAQ,
} from "@/api/faqService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Edit,
  MoreHorizontal,
  Plus,
  Trash,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define the drag item type
const ItemTypes = {
  FAQ: "faq",
};

// Define prop types for the draggable component
interface DraggableFaqRowProps {
  faq: FAQ;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  handleEdit: (faq: FAQ) => void;
  togglePublish: (faq: FAQ) => void;
  setDeleteConfirmId: (id: string) => void;
}

// Draggable FAQ row component
const DraggableFaqRow = ({
  faq,
  index,
  moveItem,
  handleEdit,
  togglePublish,
  setDeleteConfirmId,
}: DraggableFaqRowProps) => {
  const ref = useRef<HTMLTableRowElement>(null);

  // Set up drag source
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FAQ,
    item: { id: faq.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Set up drop target
  const [, drop] = useDrop({
    accept: ItemTypes.FAQ,
    hover(item: { id: string; index: number }) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Move the item
      moveItem(dragIndex, hoverIndex);

      // Update the item index for future interactions
      item.index = hoverIndex;
    },
  });

  // Apply the drag and drop refs
  drag(drop(ref));

  return (
    <TableRow
      ref={ref}
      key={faq.id}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <TableCell className="font-medium w-[80px]">
        <div className="flex items-center gap-2">
          <GripVertical className="text-muted-foreground h-5 w-5" />
          <span>{index + 1}</span>
        </div>
      </TableCell>
      <TableCell className="max-w-md">
        <div className="truncate font-medium">{faq.question}</div>
        <div className="truncate text-muted-foreground text-sm">
          {(faq.answer || "").replace(/<[^>]*>/g, "").substring(0, 60)}
          {(faq.answer || "").length > 60 ? "..." : ""}
        </div>
      </TableCell>
      <TableCell>
        {faq.category ? (
          <Badge variant="outline">{faq.category}</Badge>
        ) : (
          <span className="text-muted-foreground text-sm">No category</span>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={faq.isPublished ? "default" : "secondary"}>
          {faq.isPublished ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleEdit(faq)}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => togglePublish(faq)}>
              {faq.isPublished ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" /> Unpublish
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" /> Publish
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteConfirmId(faq.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    order: 0,
    isPublished: true,
  });

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const response = await getAllFaqs();

      // Handle various possible response formats
      if (response?.data?.faqs && Array.isArray(response.data.faqs)) {
        // Format: { data: { faqs: [...] } }
        setFaqs(response.data.faqs);
      } else if (Array.isArray(response?.data)) {
        // Format: { data: [...] }
        setFaqs(response.data);
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        // Format: { data: { data: [...] } } or { statusCode, data: [...], message, success }
        setFaqs(response.data.data);
      } else {
        // Unexpected format
        console.error("Unexpected API response structure:", response);
        setFaqs([]);
      }
    } catch (error) {
      toast.error("Failed to load FAQs");
      console.error(error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  const handleCreateNew = () => {
    setEditingFaq(null);
    setFormData({
      question: "",
      answer: "",
      category: "",
      order: faqs.length,
      isPublished: true,
    });
    setIsEditDialogOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
      order: faq.order,
      isPublished: faq.isPublished,
    });
    setIsEditDialogOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isPublished: checked,
    });
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.question || !formData.answer) {
        toast.error("Question and answer are required");
        return;
      }

      if (editingFaq) {
        // Update existing
        await updateFaq(editingFaq.id, formData);
        toast.success("FAQ updated successfully");
      } else {
        // Create new
        navigate("/faq-management/create", { state: { formData } });
        return;
      }
      setIsEditDialogOpen(false);
      loadFAQs();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to save FAQ";
      toast.error(errorMsg);
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFaq(id);
      toast.success("FAQ deleted successfully");
      loadFAQs();
      setDeleteConfirmId(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to delete FAQ";
      toast.error(errorMsg);
      console.error(error);
    }
  };

  const togglePublish = async (faq: FAQ) => {
    try {
      // Just update the isPublished field, don't worry about other fields
      // Our updated backend function will handle this properly
      await updateFaq(faq.id, {
        isPublished: !faq.isPublished,
      });

      toast.success(faq.isPublished ? "FAQ unpublished" : "FAQ published");
      loadFAQs();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to update FAQ";
      toast.error(errorMsg);
      console.error(error);
    }
  };

  // Move item in the list - used by the DnD functionality
  const moveFaqItem = (dragIndex: number, hoverIndex: number) => {
    console.log(`Moving FAQ from index ${dragIndex} to ${hoverIndex}`);
    setIsDragging(true);

    const draggedItem = faqs[dragIndex];
    if (!draggedItem) {
      console.error("Could not find dragged item at index", dragIndex);
      return;
    }

    console.log("Dragged item:", draggedItem);

    // Create a copy
    const newFaqs = [...faqs];
    // Remove draggedItem
    newFaqs.splice(dragIndex, 1);
    // Add at new position
    newFaqs.splice(hoverIndex, 0, draggedItem);

    console.log(
      "New FAQ order:",
      newFaqs.map((faq) => faq.id)
    );

    // Only update the state, don't save yet
    setFaqs(newFaqs);
  };

  // Save the new order to the backend
  const saveNewOrder = async () => {
    if (!isDragging) {
      console.log("Not dragging, nothing to save");
      return;
    }

    try {
      setIsSaving(true);
      console.log("Preparing to save new FAQ order...");

      // Prepare the data for API call
      const orderData = faqs.map((faq, index) => ({
        id: faq.id,
        order: index + 1, // Start from 1
      }));

      console.log("Sending order data:", orderData);

      // Call the API to update the order
      const result = await updateFaqOrder(orderData);
      console.log("Order update result:", result);

      toast.success("FAQ order updated successfully");

      // Reload FAQs to get updated order
      console.log("Reloading FAQs...");
      await loadFAQs();
    } catch (error: any) {
      console.error("Error saving FAQ order:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to update FAQ order";
      toast.error(errorMsg);
    } finally {
      setIsDragging(false);
      setIsSaving(false);
    }
  };

  // Filter and sort FAQs
  const filteredAndSortedFaqs = faqs
    .filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (faq.category &&
          faq.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.order - b.order); // Sort by order

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              FAQ Management
            </h1>
            <p className="text-muted-foreground">
              Manage frequently asked questions for your site
            </p>
          </div>
          <div className="flex gap-2">
            {isDragging && (
              <Button
                variant="outline"
                onClick={saveNewOrder}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save New Order"}
              </Button>
            )}
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" /> Add New FAQ
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
            <CardDescription>
              Drag and drop FAQs to reorder them. Click "Save New Order" when
              finished.
            </CardDescription>
            <div className="flex items-center">
              <Input
                placeholder="Search FAQs..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 border rounded"
                  >
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedFaqs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {faqs.length === 0
                            ? "No FAQs found. Create your first FAQ!"
                            : "No FAQs match your search."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedFaqs.map((faq, index) => (
                        <DraggableFaqRow
                          key={faq.id}
                          faq={faq}
                          index={index}
                          moveItem={moveFaqItem}
                          handleEdit={handleEdit}
                          togglePublish={togglePublish}
                          setDeleteConfirmId={setDeleteConfirmId}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                {editingFaq ? "Edit FAQ" : "Create New FAQ"}
              </DialogTitle>
              <DialogDescription>
                Make changes to the FAQ here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question" className="col-span-1">
                  Question
                </Label>
                <Input
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="answer" className="col-span-1 pt-2">
                  Answer
                </Label>
                <Textarea
                  id="answer"
                  name="answer"
                  value={formData.answer}
                  onChange={handleFormChange}
                  className="col-span-3 min-h-[100px]"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="col-span-1">
                  Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="col-span-3"
                  placeholder="Optional"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isPublished" className="col-span-1">
                  Published
                </Label>
                <div className="col-span-3 flex items-center">
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={handleSwitchChange}
                  />
                  <span className="ml-2">
                    {formData.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!deleteConfirmId}
          onOpenChange={() => setDeleteConfirmId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this FAQ? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
}
