using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartTechAngCore.Models;

namespace SmartTechAngCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDBContext db;
        public IHostingEnvironment env { get; private set; }

        public ProductController(ApplicationDBContext _db, IHostingEnvironment _env)
        {
            db = _db;
            env = _env;
        }
        // GET: api/Product
        [HttpGet("[action]/{txtSearch}")]
        public IActionResult GetProducts([FromRoute] string txtSearch)
        {
            if (txtSearch == "null")
            {
                return Ok(db.Products.ToList());
            }
            else
            {
                return Ok(db.Products.Where(x => x.Name.Contains(txtSearch) || x.Price.ToString().Contains(txtSearch)).ToList());
            }
        }

        [HttpPost("[action]"), DisableRequestSizeLimit]
        public IActionResult SaveImage()
        {
            string imageName = null;
            var postedFile = Request.Form.Files["file"];
            imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);
            string path = Path.Combine(env.WebRootPath, "Files");
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            using (var ms = new FileStream(Path.Combine(path, imageName), FileMode.Create))
            {
                postedFile.CopyTo(ms);
            }
            return Ok();
        }

        [HttpPost("[action]"),DisableRequestSizeLimit]
        public IActionResult AddProduct([FromForm] ProductViewModel formData)
        {
            var product = new Product
            {
                Name = formData.Name,
                Price = formData.Price,
                Photo = formData.Photo,
                LastUpdate = DateTime.UtcNow.ToString(),
            };
            var postedFile = Request.Form.Files["file"];
            if (postedFile != null)
            {
                var imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
                imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);
                string path = Path.Combine(env.WebRootPath, "Files");
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);
                using (var ms = new FileStream(Path.Combine(path, imageName), FileMode.Create))
                {
                    postedFile.CopyTo(ms);
                }
                product.Photo = $"Files/" + imageName;
                //
            }
            db.Products.Add(product);
            db.SaveChanges();
            return Ok();
        }

        [HttpPut("[action]/{id}")]
        public IActionResult UpdateProduct([FromRoute] int id, [FromForm] Product formData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            else
            {               
                var product = db.Products.FirstOrDefault(x => x.Id == id);
                if (product != null)
                {
                    product.Name = formData.Name;
                    product.Price = formData.Price;
                    product.Photo = formData.Photo;
                    product.LastUpdate = DateTime.UtcNow.ToString();
                  
                    //
                    var postedFile = Request.Form.Files["file"];
                    if (postedFile != null)
                    {
                        var imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
                        imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);
                        string path = Path.Combine(env.WebRootPath, "Files");
                        if (!Directory.Exists(path))
                            Directory.CreateDirectory(path);
                        // old image
                        var oldPlaceImg = product.Photo;
                        if (oldPlaceImg != null)
                        {
                            int indx = oldPlaceImg.LastIndexOf("/");
                            oldPlaceImg = oldPlaceImg.Substring(indx);
                            if (System.IO.File.Exists(path + oldPlaceImg))
                            {
                                System.IO.File.Delete(path + oldPlaceImg);
                            }
                            // new image
                            using (var ms = new FileStream(Path.Combine(path, imageName), FileMode.Create))
                            {
                                postedFile.CopyTo(ms);
                            }
                            product.Photo = $"Files/" + imageName;
                        }
                    }
                    db.Entry(product).State = EntityState.Modified;
                    db.SaveChanges();
                    return Ok(new JsonResult("Product With Id : " + id + " Is Updated"));
                }
                else
                {
                    return NotFound();
                }
            }
        }
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteProduct([FromRoute] int id)
        {
            var product = db.Products.FirstOrDefault(x => x.Id == id);
            if (product != null)
            {
                db.Products.Remove(product);
                await db.SaveChangesAsync();
                return Ok(new JsonResult("Product With Id : " + id + " Is Deleted"));
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetProduct([FromRoute] int id)
        {
            var product = db.Products.FirstOrDefault(x => x.Id == id);
            if (product != null)
            {
                return Ok(product);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
