import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check, X, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { API_ENDPOINTS } from "@/config";
import toast from "react-hot-toast";

const LeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    employeeId: null,
  });
  const [statusForm, setStatusForm] = useState({
    status: "Approved",
    comments: "",
  });

  const { user, isAdmin } = useAuth();

  // Fetch data on component mount
  useEffect(() => {
    fetchLeaves();
    fetchLeaveTypes();
    if (isAdmin) {
      fetchEmployees();
    }
  }, []);

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      const endpoint = isAdmin ? API_ENDPOINTS.LEAVES.ALL : API_ENDPOINTS.LEAVES.MY;
      const response = await api.get(endpoint);
      setLeaves(response.data);
    } catch (error) {
      toast.error("Failed to fetch leaves");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.LEAVES.TYPES);
      setLeaveTypes(response.data);
    } catch (error) {
      toast.error("Failed to fetch leave types");
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPLOYEES);
      setEmployees(response.data);
    } catch (error) {
      toast.error("Failed to fetch employees");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Submitting leave request...");
    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      if (!isAdmin) {
        delete payload.employeeId; // For regular employees, use their own ID
      }

      await api.post(API_ENDPOINTS.LEAVES.ALL, payload);
      toast.success("Leave application submitted successfully", { id: toastId });
      setIsDialogOpen(false);
      fetchLeaves();
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit leave",
        { id: toastId }
      );
    }
  };

  const handleStatusUpdate = async () => {
    const toastId = toast.loading("Updating leave status...");
    try {
      await api.put(API_ENDPOINTS.LEAVES.STATUS(selectedLeave.id), {
        status: statusForm.status,
        comments: statusForm.comments,
      });
      toast.success("Leave status updated successfully", { id: toastId });
      setIsStatusDialogOpen(false);
      fetchLeaves();
      resetStatusForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update leave status",
        { id: toastId }
      );
    }
  };

  const resetForm = () => {
    setFormData({
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
      employeeId: null,
    });
  };

  const resetStatusForm = () => {
    setStatusForm({
      status: "Approved",
      comments: "",
    });
    setSelectedLeave(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return format(parseISO(dateString), "MMM dd, yyyy");
  };

  const openStatusDialog = (leave, status) => {
    setSelectedLeave(leave);
    setStatusForm({
      status: status,
      comments: "",
    });
    setIsStatusDialogOpen(true);
  };

  const statusColors = {
    Approved: "bg-green-500 hover:bg-green-600",
    Rejected: "bg-red-500 hover:bg-red-600",
    Pending: "bg-yellow-500 hover:bg-yellow-600",
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-medium">
            {isAdmin ? "Leave Management" : "My Leaves"}
          </CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={fetchLeaves}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {!isAdmin && (
              <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Apply for Leave
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {isAdmin && <TableHead>Employee</TableHead>}
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 8 : 7} className="text-center">
                      No leaves found
                    </TableCell>
                  </TableRow>
                ) : (
                  leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      {isAdmin && <TableCell>{leave.employeeName}</TableCell>}
                      <TableCell>{leave.leaveType}</TableCell>
                      <TableCell>{formatDate(leave.startDate)}</TableCell>
                      <TableCell>{formatDate(leave.endDate)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {leave.reason}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[leave.status]}>
                          {leave.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(leave.appliedOn)}</TableCell>
                      {isAdmin && (
                        <TableCell>
                          {leave.status === "Pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openStatusDialog(leave, "Approved")}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openStatusDialog(leave, "Rejected")}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Leave Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>
              Fill out the form to submit a new leave request
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select
                  value={formData.employeeId || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, employeeId: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type *</Label>
              <Select
                value={formData.leaveType}
                onValueChange={(value) =>
                  setFormData({ ...formData, leaveType: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
                placeholder="Enter the reason for your leave"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Leave Status</DialogTitle>
            <DialogDescription>
              Updating status for {selectedLeave?.employeeName}'s leave request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusForm.status}
                onValueChange={(value) =>
                  setStatusForm({ ...statusForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={statusForm.comments}
                onChange={(e) =>
                  setStatusForm({ ...statusForm, comments: e.target.value })
                }
                placeholder="Optional comments for the employee"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsStatusDialogOpen(false);
                  resetStatusForm();
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleStatusUpdate}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeavesPage;
