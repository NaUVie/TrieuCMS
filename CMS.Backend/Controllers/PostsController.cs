using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; 
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;
using System;

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

        // GET: api/Posts
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
                        p.CategoryId,
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

        // GET: api/Posts/category/5
        [HttpGet("category/{categoryId}")] 
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var posts = await _context.Posts
                .Where(p => p.CategoryId == categoryId) 
                .Select(p => new { 
                    p.Id, 
                    p.Title, 
                    p.ImageUrl, 
                    p.CreatedDate,
                    p.CategoryId
                })
                .ToListAsync();

            return Ok(posts); 
        }

        // GET: api/Posts/5
        [HttpGet("{id}")] 
        public async Task<IActionResult> GetDetail(int id)
        {
            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) 
            {
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            return Ok(post); 
        }

        // POST: api/Posts
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PostInputDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.Title) || string.IsNullOrEmpty(input.Content))
            {
                return BadRequest(new { message = "Tiêu đề và nội dung bài viết không được để trống." });
            }

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == input.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Danh mục bài viết không tồn tại." });
            }

            var post = new Post
            {
                Title = input.Title,
                Content = input.Content,
                ImageUrl = input.ImageUrl,
                CategoryId = input.CategoryId,
                CreatedDate = DateTime.Now
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDetail), new { id = post.Id }, new {
                message = "Đăng bài viết thành công!",
                post
            });
        }

        // PUT: api/Posts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PostInputDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.Title) || string.IsNullOrEmpty(input.Content))
            {
                return BadRequest(new { message = "Tiêu đề và nội dung bài viết không được để trống." });
            }

            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này." });
            }

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == input.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Danh mục bài viết không tồn tại." });
            }

            post.Title = input.Title;
            post.Content = input.Content;
            post.ImageUrl = input.ImageUrl;
            post.CategoryId = input.CategoryId;

            await _context.SaveChangesAsync();

            return Ok(new {
                message = "Cập nhật bài viết thành công!",
                post
            });
        }

        // DELETE: api/Posts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này." });
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa bài viết thành công." });
        }
    }

    public class PostInputDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string? ImageUrl { get; set; }
        public int CategoryId { get; set; }
    }
}
