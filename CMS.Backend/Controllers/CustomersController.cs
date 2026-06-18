using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Data.Security;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _context.Customers
                .Select(c => new {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .ToListAsync();

            return Ok(customers);
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _context.Customers
                .Select(c => new {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin khách hàng này." });
            }

            return Ok(customer);
        }

        // POST: api/Customers
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CustomerCreateInputDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.Email) || string.IsNullOrEmpty(input.Password) || string.IsNullOrEmpty(input.FullName))
            {
                return BadRequest(new { message = "Họ tên, Email và Mật khẩu không được để trống." });
            }

            var exists = await _context.Customers.AnyAsync(c => c.Email.ToLower() == input.Email.ToLower());
            if (exists)
            {
                return BadRequest(new { message = "Email này đã được đăng ký trong hệ thống." });
            }

            var customer = new Customer
            {
                FullName = input.FullName,
                Email = input.Email,
                Phone = input.Phone,
                Address = input.Address,
                Password = PasswordHasher.HashPassword(input.Password)
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = customer.Id }, new {
                message = "Tạo tài khoản khách hàng thành công!",
                customer = new { customer.Id, customer.FullName, customer.Email, customer.Phone, customer.Address }
            });
        }

        // PUT: api/Customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CustomerUpdateInputDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.FullName))
            {
                return BadRequest(new { message = "Họ và tên không được để trống." });
            }

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng." });
            }

            customer.FullName = input.FullName;
            customer.Phone = input.Phone;
            customer.Address = input.Address;

            if (!string.IsNullOrEmpty(input.NewPassword))
            {
                customer.Password = PasswordHasher.HashPassword(input.NewPassword);
            }

            await _context.SaveChangesAsync();

            return Ok(new {
                message = "Cập nhật thông tin khách hàng thành công!",
                customer = new { customer.Id, customer.FullName, customer.Email, customer.Phone, customer.Address }
            });
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng." });
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa khách hàng thành công." });
        }
    }

    public class CustomerCreateInputDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class CustomerUpdateInputDto
    {
        public string FullName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? NewPassword { get; set; }
    }
}
