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
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản quản trị viên này." });
            }

            return Ok(user);
        }

        // POST: api/Users
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserCreateDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.Username) || string.IsNullOrEmpty(input.Password) || string.IsNullOrEmpty(input.FullName))
            {
                return BadRequest(new { message = "Tên đăng nhập, mật khẩu và họ tên không được để trống." });
            }

            var exists = await _context.Users.AnyAsync(u => u.Username.ToLower() == input.Username.ToLower());
            if (exists)
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại trong hệ thống." });
            }

            var user = new User
            {
                Username = input.Username,
                FullName = input.FullName,
                Role = input.Role ?? "User",
                PasswordHash = PasswordHasher.HashPassword(input.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, new {
                message = "Tạo tài khoản quản trị thành công!",
                user = new { user.Id, user.Username, user.FullName, user.Role }
            });
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.FullName))
            {
                return BadRequest(new { message = "Họ tên không được để trống." });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản quản trị viên này." });
            }

            user.FullName = input.FullName;
            user.Role = input.Role ?? user.Role;

            if (!string.IsNullOrEmpty(input.NewPassword))
            {
                user.PasswordHash = PasswordHasher.HashPassword(input.NewPassword);
            }

            await _context.SaveChangesAsync();

            return Ok(new {
                message = "Cập nhật tài khoản quản trị thành công!",
                user = new { user.Id, user.Username, user.FullName, user.Role }
            });
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản quản trị viên này." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa tài khoản quản trị viên thành công." });
        }
    }

    public class UserCreateDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string? Role { get; set; }
    }

    public class UserUpdateDto
    {
        public string FullName { get; set; }
        public string? Role { get; set; }
        public string? NewPassword { get; set; }
    }
}
