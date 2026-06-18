using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; 
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.Categories
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục bài viết này." });
            }

            return Ok(category);
        }

        // POST: api/Categories
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryInputDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.Name))
            {
                return BadRequest(new { message = "Tên danh mục bài viết không được để trống." });
            }

            var category = new Category
            {
                Name = input.Name,
                Description = input.Description
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = category.Id }, new {
                message = "Tạo danh mục bài viết thành công!",
                category
            });
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryInputDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.Name))
            {
                return BadRequest(new { message = "Tên danh mục bài viết không được để trống." });
            }

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục bài viết này." });
            }

            category.Name = input.Name;
            category.Description = input.Description;

            await _context.SaveChangesAsync();

            return Ok(new {
                message = "Cập nhật danh mục bài viết thành công!",
                category
            });
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục bài viết này." });
            }

            // Kiểm tra xem có bài viết nào thuộc danh mục này không
            var hasPosts = await _context.Posts.AnyAsync(p => p.CategoryId == id);
            if (hasPosts)
            {
                return BadRequest(new { message = "Không thể xóa danh mục này vì đã có bài viết thuộc danh mục." });
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa danh mục bài viết thành công." });
        }
    }

    public class CategoryInputDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
    }
}
