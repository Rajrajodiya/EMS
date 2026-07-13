using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.DTOs;
using server.Models;
using System.Security.Claims;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LeaveController : ControllerBase
    {
        private readonly IRepository<Leave> _leaveRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Employee> _employeeRepository;

        public LeaveController(
            IRepository<Leave> leaveRepository,
            IRepository<User> userRepository,
            IRepository<Employee> employeeRepository)
        {
            _leaveRepository = leaveRepository;
            _userRepository = userRepository;
            _employeeRepository = employeeRepository;
        }

        private async Task<User> GetCurrentUser()
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(userEmail))
            {
                return null;
            }

            return (await _userRepository.GetAll(x => x.Email == userEmail)).FirstOrDefault();
        }

        // GET: api/leave (admin only)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<LeaveDto>>> GetAllLeaves()
        {
            var leaves = await _leaveRepository.GetAll();
            var leaveDtos = new List<LeaveDto>();

            foreach (var leave in leaves)
            {
                var user = await _userRepository.FindByIdAsync(leave.UserId);
                var employee = await _employeeRepository.FindByIdAsync(leave.EmployeeId ?? 0);
                var processedBy = leave.ProcessedById.HasValue ? 
                    await _userRepository.FindByIdAsync(leave.ProcessedById.Value) : null;

                leaveDtos.Add(new LeaveDto
                {
                    Id = leave.Id,
                    EmployeeName = employee?.Name ?? user?.Email ?? "Unknown",
                    LeaveType = leave.LeaveType,
                    StartDate = leave.StartDate,
                    EndDate = leave.EndDate,
                    Reason = leave.Reason,
                    Status = leave.Status,
                    AppliedOn = leave.AppliedOn,
                    ProcessedByName = processedBy?.Email,
                    ProcessedOn = leave.ProcessedOn
                });
            }

            return Ok(leaveDtos.OrderByDescending(l => l.AppliedOn));
        }

        // GET: api/leave/my (employee's own leaves)
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<LeaveDto>>> GetMyLeaves()
        {
            var user = await GetCurrentUser();
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            var leaves = await _leaveRepository.GetAll(l => l.UserId == user.Id);

            var leaveDtos = new List<LeaveDto>();
            foreach (var leave in leaves)
            {
                var employee = await _employeeRepository.FindByIdAsync(leave.EmployeeId ?? 0);
                var processedBy = leave.ProcessedById.HasValue ? 
                    await _userRepository.FindByIdAsync(leave.ProcessedById.Value) : null;

                leaveDtos.Add(new LeaveDto
                {
                    Id = leave.Id,
                    EmployeeName = employee?.Name ?? "Me",
                    LeaveType = leave.LeaveType,
                    StartDate = leave.StartDate,
                    EndDate = leave.EndDate,
                    Reason = leave.Reason,
                    Status = leave.Status,
                    AppliedOn = leave.AppliedOn,
                    ProcessedByName = processedBy?.Email,
                    ProcessedOn = leave.ProcessedOn
                });
            }

            return Ok(leaveDtos.OrderByDescending(l => l.AppliedOn));
        }

        // POST: api/leave
        [HttpPost]
        public async Task<ActionResult<LeaveDto>> CreateLeave([FromBody] CreateLeaveDto createLeaveDto)
        {
            var user = await GetCurrentUser();
            if (user == null)
            {
                return BadRequest("User not found.");
            }
            //Console.WriteLine("your leave is **********************\n");
            var leave = new Leave
            {
                UserId = user.Id,
                LeaveType = createLeaveDto.LeaveType,
                StartDate = createLeaveDto.StartDate,
                EndDate = createLeaveDto.EndDate,
                Reason = createLeaveDto.Reason,
                Status = "Pending",
                AppliedOn = DateTime.UtcNow,
                EmployeeId = createLeaveDto.EmployeeId
            };
            //Console.WriteLine("your leave is **********************\n"+leave);
            await _leaveRepository.AddAsync(leave);
            await _leaveRepository.SaveChangeAsync();

            // Return the created leave
            var employee = await _employeeRepository.FindByIdAsync(leave.EmployeeId ?? 0);
            return Ok(new LeaveDto
            {
                Id = leave.Id,
                EmployeeName = employee?.Name ?? user.Email,
                LeaveType = leave.LeaveType,
                StartDate = leave.StartDate,
                EndDate = leave.EndDate,
                Reason = leave.Reason,
                Status = leave.Status,
                AppliedOn = leave.AppliedOn
            });
        }

        // PUT: api/leave/5/status (admin only)
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateLeaveStatus(int id, [FromBody] UpdateLeaveStatusDto updateDto)
        {
            var leave = await _leaveRepository.FindByIdAsync(id);
            if (leave == null)
            {
                return NotFound("Leave request not found.");
            }

            var admin = await GetCurrentUser();
            if (admin == null)
            {
                return BadRequest("Admin user not found.");
            }

            leave.Status = updateDto.Status;
            leave.ProcessedById = admin.Id;
            leave.ProcessedOn = DateTime.UtcNow;
            leave.Comments = updateDto.Comments;

            _leaveRepository.Update(leave);
            await _leaveRepository.SaveChangeAsync();

            return NoContent();
        }

        // GET: api/leave/types
        [HttpGet("types")]
        public IActionResult GetLeaveTypes()
        {
            var types = new List<string>
            {
                "Sick Leave",
                "Vacation",
                "Personal Leave",
                "Maternity Leave",
                "Paternity Leave",
                "Bereavement Leave",
                "Other"
            };

            return Ok(types);
        }
    }
}