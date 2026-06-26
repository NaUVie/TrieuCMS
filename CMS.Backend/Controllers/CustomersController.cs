using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Data.Security;
using System.Threading.Tasks;
using System.Linq;
using CMS.Backend.Services;
using System;
using System.Net;
using System.Net.Mail;
using System.Collections.Concurrent;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private static readonly ConcurrentDictionary<string, (string Otp, DateTime Expiry)> _otpStore = 
            new ConcurrentDictionary<string, (string Otp, DateTime Expiry)>(StringComparer.OrdinalIgnoreCase);

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
                if (string.IsNullOrEmpty(input.OldPassword))
                {
                    return BadRequest(new { message = "Vui lòng nhập mật khẩu cũ để xác thực việc thay đổi mật khẩu." });
                }

                if (!PasswordHasher.VerifyPassword(input.OldPassword, customer.Password))
                {
                    return BadRequest(new { message = "Mật khẩu cũ không chính xác." });
                }

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

        // POST: api/Customers/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordInputDto input, [FromServices] IEmailService emailService)
        {
            if (input == null || string.IsNullOrEmpty(input.Email))
            {
                return BadRequest(new { message = "Vui lòng nhập địa chỉ Email." });
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email.ToLower() == input.Email.ToLower());
            if (customer == null)
            {
                return BadRequest(new { message = "Email này không tồn tại trong hệ thống." });
            }

            // Generate 6-digit numeric OTP
            var random = new Random();
            string otp = random.Next(100000, 999999).ToString();
            var expiry = DateTime.UtcNow.AddMinutes(5); // Expires in 5 minutes

            // Store OTP in-memory
            _otpStore[input.Email] = (otp, expiry);

            // Send Email
            string subject = "Mã OTP đặt lại mật khẩu - TrieuCMS Store";
            string body = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
                    <h2 style='color: #2563eb;'>Xác nhận yêu cầu đặt lại mật khẩu</h2>
                    <p>Xin chào <strong>{customer.FullName}</strong>,</p>
                    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình:</p>
                    <div style='background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;'>
                        <span style='font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1e3a8a;'>{otp}</span>
                    </div>
                    <p style='color: #6b7280; font-size: 14px;'>Mã OTP này có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                    <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                    <p style='font-size: 12px; color: #9ca3af;'>Nếu bạn không yêu cầu đặt lại mật khẩu, bạn có thể an tâm bỏ qua email này.</p>
                </div>
            ";

            try
            {
                await emailService.SendEmailAsync(customer.Email, subject, body);
            }
            catch (Exception)
            {
                // Fallback logged to console
            }

            return Ok(new { message = "Mã OTP đã được gửi tới Email của bạn. Vui lòng kiểm tra hộp thư." });
        }

        // POST: api/Customers/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordInputDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.Email) || string.IsNullOrEmpty(input.Otp) || string.IsNullOrEmpty(input.NewPassword))
            {
                return BadRequest(new { message = "Dữ liệu yêu cầu không hợp lệ. Vui lòng nhập đầy đủ thông tin." });
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email.ToLower() == input.Email.ToLower());
            if (customer == null)
            {
                return BadRequest(new { message = "Email này không tồn tại trong hệ thống." });
            }

            // Verify OTP
            if (!_otpStore.TryGetValue(input.Email, out var storedOtpData))
            {
                return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn." });
            }

            if (storedOtpData.Expiry < DateTime.UtcNow)
            {
                _otpStore.TryRemove(input.Email, out _);
                return BadRequest(new { message = "Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại mã mới." });
            }

            if (storedOtpData.Otp != input.Otp.Trim())
            {
                return BadRequest(new { message = "Mã OTP nhập vào không chính xác." });
            }

            // OTP is correct! Update Password
            customer.Password = PasswordHasher.HashPassword(input.NewPassword);
            await _context.SaveChangesAsync();

            // Clear OTP
            _otpStore.TryRemove(input.Email, out _);

            return Ok(new { message = "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới." });
        }
    }

    public class ForgotPasswordInputDto
    {
        public string Email { get; set; }
    }

    public class ResetPasswordInputDto
    {
        public string Email { get; set; }
        public string Otp { get; set; }
        public string NewPassword { get; set; }
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
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}
