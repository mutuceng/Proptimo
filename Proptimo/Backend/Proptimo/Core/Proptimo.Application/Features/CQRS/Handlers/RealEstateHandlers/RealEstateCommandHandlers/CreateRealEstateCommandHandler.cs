using AutoMapper;
using MediatR;
using Proptimo.Application.Abstractions;
using Proptimo.Application.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateHandlers.RealEstateCommandHandlers
{
    public class CreateRealEstateCommandHandler : IRequestHandler<CreateRealEstateCommand, GetAllRealEstatesPreviewQueryResult>
    {
        private readonly IWriteRepository<RealEstate> _estateRepository;
        private readonly IWriteRepository<RealEstateAddress> _addressRepository;
        private readonly IWriteRepository<RealEstateImage> _imageRepository;
        private readonly IWriteRepository<RealEstateTypeFeatureValue> _featureValueRepository;
        private readonly IReadRepository<RealEstateType> _realEstateTypeRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorageService _fileStorageService;

        private readonly IMapper _mapper;

        public CreateRealEstateCommandHandler(IWriteRepository<RealEstate> estateRepository, IWriteRepository<RealEstateAddress> addressRepository, IWriteRepository<RealEstateImage> imageRepository,
                        IWriteRepository<RealEstateTypeFeatureValue> featureValueRepository,
                        IUnitOfWork unitOfWork, IMapper mapper, IFileStorageService fileStorageService, IReadRepository<RealEstateType> realEstateTypeRepository)
        {
            _estateRepository = estateRepository;
            _addressRepository = addressRepository;
            _imageRepository = imageRepository;
            _featureValueRepository = featureValueRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _fileStorageService = fileStorageService;
            _realEstateTypeRepository = realEstateTypeRepository;
        }

        public async Task<GetAllRealEstatesPreviewQueryResult> Handle(CreateRealEstateCommand request, CancellationToken cancellationToken)
        {
            await _unitOfWork.BeginTransactionAsync();
            

            try
            {
                var estate = _mapper.Map<RealEstate>(request.CreateEstateCommand);
                await _estateRepository.AddAsync(estate);

                var returnValue = new GetAllRealEstatesPreviewQueryResult();
                returnValue.Price = estate.Price;
                returnValue.RealEstateId = estate.Id;
                returnValue.RealEstateTitle = estate.Title;
                returnValue.RealEstateStartDate = estate.StartDate;
                returnValue.RealEstateEndDate = estate.EndDate;
                returnValue.RealEstateListingType = estate.ListingType;
                returnValue.RealEstateState = estate.State;

                var realEstateType = await _realEstateTypeRepository.GetByIdAsync(estate.RealEstateTypeId);

                returnValue.RealEstateTypeName = realEstateType.Name;


                var address = _mapper.Map<RealEstateAddress>(request.CreateAddressCommand);
                address.RealEstateId = estate.Id;
                await _addressRepository.AddAsync(address);

                returnValue.CityName = address.CityName;
                returnValue.DistrictName = address.DistrictName;
                returnValue.Latitude = address.Latitude;
                returnValue.Longitude = address.Longitude;

                foreach (var featureValueCmd in request.CreateRealEstateTypeFeatureValueCommand)
                {
                    var featureValue = _mapper.Map<RealEstateTypeFeatureValue>(featureValueCmd);
                    featureValue.RealEstateId = estate.Id;
                    await _featureValueRepository.AddAsync(featureValue);
                }

                for (int i = 0; i < request.UploadRealEstatePhotosDto.Commands.Count; i++)
                {
                    var imageFile = request.UploadRealEstatePhotosDto.ImageFiles[i];
                    var imageCommand = request.UploadRealEstatePhotosDto.Commands[i];

                    var imageUrl = await _fileStorageService.SaveFileAsync(imageFile, estate.Id);

                    var image = _mapper.Map<RealEstateImage>(imageCommand);
                    image.ImageUrl = imageUrl;
                    image.RealEstateId = estate.Id;

                    await _imageRepository.AddAsync(image);

                    if (imageCommand.IsPrimary)
                        returnValue.PrimaryImageUrl = imageUrl;
                }

                await _unitOfWork.CommitTransactionAsync();

                return returnValue;
            }
            catch(Exception)
            {                 
                await _unitOfWork.RollbackTransactionAsync();
                throw; 
            }
        }
    }
}
