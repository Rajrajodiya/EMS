import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { MoreVertical, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/services/api";
import { API_ENDPOINTS } from "@/config";
import toast from "react-hot-toast";
import EmployeeForm from "./EmployeeForm";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 2,
    totalCount: 0,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DEPARTMENTS);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Get department name by ID
  const getDepartmentName = (departmentId) => {
    const department = departments.find((d) => d.id === departmentId);
    return department ? department.name : "-";
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.EMPLOYEES, {
        params: {
          search: searchQuery,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      toast.error("Failed to fetch employees");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch full employee details
  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
      setEmployeeDetails(response.data);
      setIsViewDialogOpen(true);
    } catch (error) {
      toast.error("Failed to fetch employee details");
      console.error("Error fetching employee details:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, [searchQuery, pagination.pageIndex]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setIsFormOpen(true);
  };

  const handleViewEmployee = (employee) => {
    setCurrentEmployee(employee);
    fetchEmployeeDetails(employee.id);
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      const toastId = toast.loading("Deleting employee...");
      await api.delete(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
      toast.success("Employee deleted successfully", { id: toastId });
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error("Error deleting employee:", error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const toastId = toast.loading(
        currentEmployee ? "Updating employee..." : "Adding employee..."
      );

      if (currentEmployee) {
        await api.put(`${API_ENDPOINTS.EMPLOYEES}/${currentEmployee.id}`, formData);
        toast.success("Employee updated successfully", { id: toastId });
      } else {
        await api.post(API_ENDPOINTS.EMPLOYEES, formData);
        toast.success("Employee added successfully", { id: toastId });
      }

      setIsFormOpen(false);
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
      console.error("Error saving employee:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get gender text
  const getGenderText = (genderValue) => {
    return genderValue === 1 ? "Male" : genderValue === 2 ? "Female" : "Other";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-medium">Employees</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-9 w-[200px] sm:w-[300px]"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button size="sm" onClick={handleAddEmployee}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.jobTitle}</TableCell>
                    <TableCell>
                      {employee.departmentId
                        ? getDepartmentName(employee.departmentId)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewEmployee(employee)}
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditEmployee(employee)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleDeleteEmployee(employee.id)}
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

          {/* Pagination controls */}
          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(0, prev.pageIndex - 1),
                }))
              }
              disabled={pagination.pageIndex === 0}
            >
              Previous
            </Button>
            <span className="text-sm">Page {pagination.pageIndex + 1}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              disabled={employees.length < pagination.pageSize}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee Form Modal/Dialog */}
      {isFormOpen && (
        <EmployeeForm
          employee={currentEmployee}
          departments={departments}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Employee View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {employeeDetails && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Name
                  </h4>
                  <p>{employeeDetails.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h4>
                  <p>{employeeDetails.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Phone
                  </h4>
                  <p>{employeeDetails.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Job Title
                  </h4>
                  <p>{employeeDetails.jobTitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Department
                  </h4>
                  <p>{getDepartmentName(employeeDetails.departmentId)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Gender
                  </h4>
                  <p>{getGenderText(employeeDetails.gender)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </h4>
                  <p>{formatDate(employeeDetails.dateOfBirth)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Joining Date
                  </h4>
                  <p>{formatDate(employeeDetails.joiningDate)}</p>
                </div>
              </div>

              {employeeDetails.lastWorkingDate && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Last Working Date
                  </h4>
                  <p>{formatDate(employeeDetails.lastWorkingDate)}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeListPage;
