using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.Helpers;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IRepository<Employee> employeeRepository;
        private readonly IRepository<User> userRepository;


        public EmployeeController(IRepository<Employee> employeeRepository , IRepository<User> userRepository)
        {
            this.employeeRepository = employeeRepository;
            this.userRepository = userRepository;
        }


        [HttpGet]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> GetEmployeeList([FromQuery] SearchQuery searchQuery)
        {
            List<Employee> filteredData;
            if (string.IsNullOrEmpty(searchQuery.Search))
            {
                filteredData = await employeeRepository.GetAll(); 
            }
            else
            {
            filteredData = await employeeRepository.GetAll(x =>
            x.Name.Contains(searchQuery.Search) ||
            x.Phone.Contains(searchQuery.Search) ||
            x.Email.Contains(searchQuery.Search)
            );
            }
            if (searchQuery.PageIndex.HasValue)
            {
                int x = (int)(searchQuery.PageIndex * searchQuery.PageSize.Value);
                int y = (int)(searchQuery.PageSize);
                filteredData = filteredData.Skip(x).Take(y).ToList();
            }
            return Ok(filteredData);
        }
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetEmployee([FromRoute] int id)
        {
            return Ok(await employeeRepository.FindByIdAsync(id));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddEmployee([FromBody] Employee model)
        {
            var user = new User()
            {
                Email = model.Email,
                Role = "Employee",
                Password = PasswordHelper.HashPassword("abc@123")
            };
            // Add user to the database
            await userRepository.AddAsync(user);
            await userRepository.SaveChangeAsync();
            model.UserId = user.Id;
            await employeeRepository.AddAsync(model);
            await employeeRepository.SaveChangeAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEmployee([FromRoute] int id, [FromBody] Employee model)
        {
            var employee = await employeeRepository.FindByIdAsync(id);
            if( employee is null)
            {
                return NotFound();
            }
            employee.Name = model.Name;
            employee.Email = model.Email;
            employee.Phone = model.Phone;
            employee.DepartmentId = model.DepartmentId;
            employee.LastWorkingDate = model.LastWorkingDate;
            employee.JobTitle = model.JobTitle;
            employeeRepository.Update(employee);
            await employeeRepository.SaveChangeAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmployee([FromRoute]int id)
        {
            await employeeRepository.DeleteAsync(id);
            await employeeRepository.SaveChangeAsync();
            return Ok();
        }
    }
}