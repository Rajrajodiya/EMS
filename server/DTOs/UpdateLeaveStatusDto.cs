using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class UpdateLeaveStatusDto
    {
        [Required]
        public string Status { get; set; }

        public string? Comments { get; set; }
    }
}
