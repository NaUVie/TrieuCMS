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
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CategoriesProducts
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.CategoriesProducts
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .ToListAsync(); 

                return Ok(categories);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Lỗi kết nối cơ sở dữ liệu hệ thống", 
                    detail = ex.Message 
                });
            }
        }

        // GET: api/CategoriesProducts/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.CategoriesProducts
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục sản phẩm này." });
            }

            return Ok(category);
        }

        // POST: api/CategoriesProducts
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryProductInputDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.Name))
            {
                return BadRequest(new { message = "Tên danh mục không được để trống." });
            }

            var category = new CategoryProduct
            {
                Name = input.Name,
                Description = input.Description
            };

            _context.CategoriesProducts.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = category.Id }, new {
                message = "Tạo danh mục sản phẩm thành công!",
                category
            });
        }

        // PUT: api/CategoriesProducts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryProductInputDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.Name))
            {
                return BadRequest(new { message = "Tên danh mục không được để trống." });
            }

            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục sản phẩm này." });
            }

            category.Name = input.Name;
            category.Description = input.Description;

            await _context.SaveChangesAsync();

            return Ok(new {
                message = "Cập nhật danh mục sản phẩm thành công!",
                category
            });
        }

        // DELETE: api/CategoriesProducts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục sản phẩm này." });
            }

            // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
            var hasProducts = await _context.Products.AnyAsync(p => p.CategoryProductId == id);
            if (hasProducts)
            {
                return BadRequest(new { message = "Không thể xóa danh mục này vì đã có sản phẩm thuộc danh mục." });
            }

            _context.CategoriesProducts.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa danh mục sản phẩm thành công." });
        }
    }

    public class CategoryProductInputDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
    }
}
