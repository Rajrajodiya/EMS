import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, MoreVertical, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "@/services/api";
import { API_ENDPOINTS } from "@/config";
import toast from "react-hot-toast";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.DEPARTMENTS);
      setDepartments(response.data);
    } catch (error) {
      toast.error("Failed to load departments");
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Filter departments based on search query
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDepartment = () => {
    setCurrentDepartment(null);
    setIsDialogOpen(true);
  };

  const handleEditDepartment = (department) => {
    setCurrentDepartment(department);
    setIsDialogOpen(true);
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    try {
      setDeleteLoading(true);
      const toastId = toast.loading("Deleting department...");
      await api.delete(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
      toast.success("Department deleted successfully", { id: toastId });
      fetchDepartments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete department"
      );
      console.error("Error deleting department:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-medium">Departments</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                className="pl-9 w-[200px] sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={handleAddDepartment}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Loading departments...
                  </TableCell>
                </TableRow>
              ) : filteredDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    {searchQuery
                      ? "No matching departments found"
                      : "No departments available"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>{department.name}</TableCell>
                    <TableCell className="w-[100px]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditDepartment(department)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() =>
                              handleDeleteDepartment(department.id)
                            }
                            disabled={deleteLoading}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Department Form Dialog */}
      <DepartmentFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        department={currentDepartment}
        onSuccess={() => {
          fetchDepartments();
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

// Department Form Component
const DepartmentFormDialog = ({ isOpen, onClose, department, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      reset({ name: department.name });
    } else {
      reset({ name: "" });
    }
  }, [department, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const toastId = toast.loading(
        department ? "Updating department..." : "Creating department..."
      );

      if (department) {
        await api.put(`${API_ENDPOINTS.DEPARTMENTS}/${department.id}`, data);
        toast.success("Department updated successfully", { id: toastId });
      } else {
        await api.post(API_ENDPOINTS.DEPARTMENTS, data);
        toast.success("Department created successfully", { id: toastId });
      }

      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
      console.error("Error saving department:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {department ? "Edit Department" : "Create New Department"}
          </DialogTitle>
          <DialogDescription>
            {department
              ? "Update the department details"
              : "Add a new department to your organization"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name*</Label>
            <Input
              id="name"
              {...register("name", { required: "Department name is required" })}
              placeholder="e.g. Engineering, Marketing"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentsPage;
