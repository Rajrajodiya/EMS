using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class Leave
    {
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public User User { get; set; }

        [Required]
        public string LeaveType { get; set; } // "Sick", "Vacation", etc.

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public string Reason { get; set; }

        [Required]
        public string Status { get; set; } = "Pending"; // "Pending", "Approved", "Rejected"

        public DateTime AppliedOn { get; set; } = DateTime.UtcNow;

        // For approval/rejection
        public int? ProcessedById { get; set; }
        public User? ProcessedBy { get; set; }
        public DateTime? ProcessedOn { get; set; }
        public string? Comments { get; set; }

        // Connection to Employee (optional)
        public int? EmployeeId { get; set; }
        public Employee? Employee { get; set; }
    }
}