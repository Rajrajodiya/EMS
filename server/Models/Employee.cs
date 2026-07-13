using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Email { get; set; }
        public string Phone { get; set; }
        public string JobTitle { get; set; }

        [ForeignKey(nameof(Department))]
        public int? DepartmentId { get; set; }
        public Department? Department { get; set; }
        public int Gender { get; set; }
        public DateOnly JoiningDate { get; set; }
        public DateOnly LastWorkingDate { get; set; }
        public DateOnly DateOfBirth { get; set; }
        [ForeignKey(nameof(User))]
        public int? UserId { get; set; }
        public User? User { get; set; }
    }
}
