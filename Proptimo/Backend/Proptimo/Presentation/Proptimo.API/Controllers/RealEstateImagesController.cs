using Azure.Core;
using MediatR;
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
        public async Task<IActionResult> UploadPhotos([FromForm] UploadRealEstatePhotosDto photos)
        {
            if (photos.ImageFiles == null || photos.ImageFiles.Count == 0)
                return BadRequest("En az bir fotoğraf yüklenmeli.");

            var returnedList = new List<RealEstateImageReturnDto>();

            for (int i = 0; i < photos.ImageFiles.Count; i++)
            {
                var command = photos.Commands[i];
                var imageFile = photos.ImageFiles[i];


                var imageUrl = await _fileStorageService.SaveFileAsync(imageFile, $"/{command.RealEstateId}");
                command.ImageUrl = imageUrl;

                var result = await _mediator.Send(command);
                returnedList.Add(result);
            }

            return Ok(returnedList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetImagesByEstateId(GetAllRealEstateImagesByEstateIdQuery query)
        {
            var images = await _mediator.Send(new GetAllRealEstateImagesByEstateIdQuery(query.RealEstateId));

            return Ok(images);

        }
    }
}
