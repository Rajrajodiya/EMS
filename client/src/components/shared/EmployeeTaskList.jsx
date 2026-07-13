import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function EmployeeTaskList() {
  const { user, isAdmin } = useAuth();

  // Sample task data
  const data = [
    {
      id: 1,
      title: "Profile Verification",
      section: "HR",
      status: "In Process",
      target: 12,
      limit: 10,
      reviewer: "Aman Singh",
      assignedTo: "John Doe",
      createdBy: "Admin User",
    },
    {
      id: 2,
      title: "Payroll Setup",
      section: "Finance",
      status: "Done",
      target: 22,
      limit: 15,
      reviewer: "Priya Sharma",
      assignedTo: "Jane Smith",
      createdBy: "Admin User",
    },
    {
      id: 3,
      title: "Workstation Allocation",
      section: "IT",
      status: "In Process",
      target: 5,
      limit: 10,
      reviewer: "N/A",
      assignedTo: user?.name || "You",
      createdBy: "Admin User",
    },
    {
      id: 4,
      title: "Leave Policy Update",
      section: "HR",
      status: "Done",
      target: 14,
      limit: 20,
      reviewer: "Esha Roy",
      assignedTo: "Mike Johnson",
      createdBy: "Admin User",
    },
    {
      id: 5,
      title: "Exit Interview Planning",
      section: "Admin",
      status: "Pending",
      target: 10,
      limit: 8,
      reviewer: "",
      assignedTo: user?.name || "You",
      createdBy: "Admin User",
    },
  ];

  // Filter tasks based on role
  const filteredData = isAdmin
    ? data
    : data.filter(
        (task) =>
          task.assignedTo === (user?.name || "You") ||
          task.createdBy === user?.name
      );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Done":
        return <Badge className="bg-green-500 hover:bg-green-600">Done</Badge>;
      case "In Process":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">In Process</Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    console.log(`Task ${taskId} status changed to ${newStatus}`);
    // TODO: Add API call here to update status
  };

  const handleAssignReviewer = (taskId, reviewer) => {
    console.log(`Reviewer ${reviewer} assigned to task ${taskId}`);
    // TODO: Add API call here to assign reviewer
  };

  return (
    <div className="mt-6 border rounded-md overflow-hidden bg-muted">
      <Table>
        <TableHeader className="bg-muted-foreground/10">
          <TableRow>
            <TableHead>Task</TableHead>
            {isAdmin && <TableHead>Assigned To</TableHead>}
            <TableHead>Section</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Reviewer</TableHead>
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>

              {isAdmin && <TableCell>{item.assignedTo}</TableCell>}

              <TableCell>{item.section}</TableCell>

              <TableCell>
                {isAdmin ? (
                  <Select
                    defaultValue={item.status}
                    onValueChange={(value) =>
                      handleStatusChange(item.id, value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Process">In Process</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  getStatusBadge(item.status)
                )}
              </TableCell>

              <TableCell>{item.target}</TableCell>
              <TableCell>{item.limit}</TableCell>

              <TableCell>
                {item.reviewer ? (
                  item.reviewer
                ) : isAdmin ? (
                  <Select
                    onValueChange={(value) =>
                      handleAssignReviewer(item.id, value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Assign reviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Esha">Esha Roy</SelectItem>
                      <SelectItem value="Aman">Aman Singh</SelectItem>
                      <SelectItem value="Priya">Priya Sharma</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  "Not assigned"
                )}
              </TableCell>

              {isAdmin && (
                <TableCell>
                  <Button variant="ghost" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    Delete
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center p-4 text-muted-foreground text-xs">
        <span>
          Showing {filteredData.length} of {data.length} tasks
        </span>
        <div className="space-x-2">
          <Button size="sm" variant="ghost">
            «
          </Button>
          <Button size="sm" variant="ghost">
            1
          </Button>
          <Button size="sm" variant="ghost">
            »
          </Button>
        </div>
      </div>
    </div>
  );
}
