using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;
using CMS.Data.Security;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Auth/CustomerRegister
        [HttpPost("CustomerRegister")]
        public async Task<IActionResult> CustomerRegister([FromBody] RegisterInputDTO input)
        {
            if (input == null || string.IsNullOrEmpty(input.Email) || string.IsNullOrEmpty(input.Password) || string.IsNullOrEmpty(input.FullName))
            {
                return BadRequest(new { message = "Thông tin đăng ký không hợp lệ. Các trường Họ tên, Email, Mật khẩu không được để trống." });
            }

            // Kiểm tra email trùng lặp
            var existingCustomer = await _context.Customers.AnyAsync(c => c.Email.ToLower() == input.Email.ToLower());
            if (existingCustomer)
            {
                return BadRequest(new { message = "Email này đã được đăng ký trong hệ thống." });
            }

            try
            {
                var newCustomer = new Customer
                {
                    FullName = input.FullName,
                    Email = input.Email,
                    Password = PasswordHasher.HashPassword(input.Password), // Hashed secure password
                    Phone = input.Phone,
                    Address = input.Address
                };

                _context.Customers.Add(newCustomer);
                await _context.SaveChangesAsync();

                return StatusCode(201, new {
                    message = "Đăng ký tài khoản khách hàng thành công!",
                    customerId = newCustomer.Id
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi đăng ký", detail = ex.Message });
            }
        }

        // POST: api/Auth/CustomerLogin
        [HttpPost("CustomerLogin")]
        public async Task<IActionResult> CustomerLogin([FromBody] LoginInputDTO input)
        {
            if (input == null || string.IsNullOrEmpty(input.Email) || string.IsNullOrEmpty(input.Password))
            {
                return BadRequest(new { message = "Email và Mật khẩu không được để trống." });
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == input.Email.ToLower());

            if (customer == null || !PasswordHasher.VerifyPassword(input.Password, customer.Password))
            {
                return Unauthorized(new { message = "Email hoặc Mật khẩu không chính xác!" });
            }

            // Trả về thông tin khách hàng và mã Token thô giả lập
            return Ok(new {
                message = "Đăng nhập thành công!",
                customerId = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address,
                token = $"dummy-jwt-token-customer-{customer.Id}"
            });
        }
    }

    public class RegisterInputDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class LoginInputDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
