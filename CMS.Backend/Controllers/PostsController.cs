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
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context; 
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try 
            {
                var posts = await _context.Posts
                    .Include(p => p.Category)
                    .OrderByDescending(p => p.Id) 
                    .Select(p => new {            
                        p.Id, 
                        p.Title, 
                        p.Content,
                        p.ImageUrl, 
                        p.CreatedDate,
                        CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại"
                    })
                    .ToListAsync();

                return Ok(posts);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tải bài viết", detail = ex.Message });
            }
        }

        [HttpGet("category/{categoryId}")] 
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var posts = await _context.Posts
                .Where(p => p.CategoryId == categoryId) 
                .Select(p => new { 
                    p.Id, 
                    p.Title, 
                    p.ImageUrl, 
                    p.CreatedDate
                })
                .ToListAsync();

            return Ok(posts); 
        }

        [HttpGet("{id}")] 
        public async Task<IActionResult> GetDetail(int id)
        {
            var post = await _context.Posts
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) 
            {
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            return Ok(post); 
        }
    }
}
