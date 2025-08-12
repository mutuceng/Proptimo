using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Proptimo.Application.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;

        public FileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string estateId)
        {
            // Dosya adı (benzersiz)
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            // Klasör yolu (wwwroot/uploads/{estateId})
            var folderPath = Path.Combine(_env.WebRootPath, "uploads", estateId);

            // Klasör yoksa oluştur
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            // Dosyanın tam yolu
            var filePath = Path.Combine(folderPath, fileName);

            // Dosyayı kaydet
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Geriye tarayıcıdan erişilebilecek bir path döndür
            return $"/uploads/{estateId}/{fileName}";
        }

    }
}
