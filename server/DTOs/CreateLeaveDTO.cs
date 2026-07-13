using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class CreateLeaveDto
    {
        [Required]
        public string LeaveType { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public string Reason { get; set; }

        public int ? EmployeeId { get; set; } // Optional if you want to link to employee
    }
}
