using Azure.Core;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Abstractions;
using Proptimo.Application.Dtos.ImageDtos;
using Proptimo.Application.Features.CQRS.Commands.RealEstateImageCommands;
using Proptimo.Application.Features.CQRS.Queries.RealEstateImageQueries;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstateImagesController : ControllerBase
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly IMediator _mediator;

        public RealEstateImagesController(IFileStorageService fileStorageService, IMediator mediator)
        {
            _fileStorageService = fileStorageService;
            _mediator = mediator;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadPhotos([FromForm] UploadRealEstatePhotosDto photos)
        {
            if (photos.ImageFiles == null || photos.ImageFiles.Count == 0)
                return BadRequest("En az bir fotoğraf yüklenmeli.");

            if (photos.Commands == null || photos.Commands.Count != photos.ImageFiles.Count)
                return BadRequest("Komutlar ve resim dosyaları eşleşmiyor.");

            var returnedList = new List<RealEstateImageReturnDto>();

            for (int i = 0; i < photos.ImageFiles.Count; i++)
            {
                var command = photos.Commands[i];
                var imageFile = photos.ImageFiles[i];

                var imageUrl = await _fileStorageService.SaveFileAsync(imageFile, command.RealEstateId.ToString());

                command.ImageUrl = imageUrl;

                var result = await _mediator.Send(command);
                returnedList.Add(result);
            }

            return Ok(returnedList);
        }


        [HttpGet("{estateId}")]
        public async Task<IActionResult> GetImagesByEstateId(string estateId)
        {
            var images = await _mediator.Send(new GetAllRealEstateImagesByEstateIdQuery(estateId));

            return Ok(images);

        }
    }
}
