using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdvertisementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Advertisements
        [HttpGet]
        public async Task<IActionResult> GetActiveBanners()
        {
            var banners = await _context.Advertisements
                .Where(a => a.Status == 1)
                .OrderByDescending(a => a.CreatedDate)
                .ToListAsync();

            return Ok(banners);
        }
    }
}
