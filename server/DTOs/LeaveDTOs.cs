using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class LeaveDto
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; }
        public string LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; }
        public DateTime AppliedOn { get; set; }
        public string? ProcessedByName { get; set; }
        public DateTime? ProcessedOn { get; set; }
    }

}
