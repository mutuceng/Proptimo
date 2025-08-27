using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
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

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateHandlers.RealEstateCommandHandlers
{
    public class UpdateRealEstateCommandHandler : IRequestHandler<UpdateRealEstateCommand, GetAllRealEstatesPreviewQueryResult>
    {
        private readonly IWriteRepository<RealEstate> _estateWriteRepository;
        private readonly IReadRepository<RealEstate> _estateReadRepository;

        private readonly IWriteRepository<RealEstateAddress> _addressRepository;
        private readonly IReadRepository<RealEstateAddress> _addressReadRepository;
        private readonly IWriteRepository<RealEstateImage> _imageRepository;
        private readonly IReadRepository<RealEstateImage> _imageReadRepository;
        private readonly IWriteRepository<RealEstateTypeFeatureValue> _featureValueRepository;
        private readonly IReadRepository<RealEstateTypeFeatureValue> _featureValueReadRepository;
        private readonly IReadRepository<RealEstateType> _realEstateTypeRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorageService _fileStorageService;

        private readonly IMapper _mapper;

        public UpdateRealEstateCommandHandler(IWriteRepository<RealEstate> estateWriteRepository, IReadRepository<RealEstate> estateReadRepository,
                IWriteRepository<RealEstateAddress> addressRepository, IWriteRepository<RealEstateImage> imageRepository,
                IWriteRepository<RealEstateTypeFeatureValue> featureValueRepository, IReadRepository<RealEstateType> realEstateTypeRepository,
                IUnitOfWork unitOfWork, IFileStorageService fileStorageService, IMapper mapper, 
                IReadRepository<RealEstateAddress> addressReadRepository, IReadRepository<RealEstateTypeFeatureValue> featureValueReadRepository, IReadRepository<RealEstateImage> imageReadRepository)
        {
            _estateWriteRepository = estateWriteRepository;
            _estateReadRepository = estateReadRepository;
            _addressRepository = addressRepository;
            _imageRepository = imageRepository;
            _featureValueRepository = featureValueRepository;
            _realEstateTypeRepository = realEstateTypeRepository;
            _unitOfWork = unitOfWork;
            _fileStorageService = fileStorageService;
            _mapper = mapper;
            _addressReadRepository = addressReadRepository;
            _featureValueReadRepository = featureValueReadRepository;
            _imageReadRepository = imageReadRepository;
        }

        public async Task<GetAllRealEstatesPreviewQueryResult> Handle(UpdateRealEstateCommand request, CancellationToken cancellationToken)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                // Mevcut estate’i al ve tracking altında bırak
                var existingEstate = await _estateReadRepository.GetByIdAsync(request.RealEstateId);
                if (existingEstate == null)
                    throw new InvalidOperationException($"RealEstate with ID {request.RealEstateId} not found.");

                // Estate güncellemesi
                if (request.UpdateEstateCommand != null)
                {
                    _mapper.Map(request.UpdateEstateCommand, existingEstate);
                }


                var returnValue = new GetAllRealEstatesPreviewQueryResult
                {
                    RealEstateId = existingEstate.Id,
                    RealEstateTitle = existingEstate.Title,
                    Price = existingEstate.Price,
                    RealEstateStartDate = existingEstate.StartDate,
                    RealEstateEndDate = existingEstate.EndDate,
                    RealEstateListingType = existingEstate.ListingType,
                    RealEstateState = existingEstate.State,
                };

                // Address güncellemesi
                if (request.UpdateAddressCommand != null)
                {
                    var existingAddress = await _addressReadRepository.GetWhere(a => a.RealEstateId == request.RealEstateId).FirstOrDefaultAsync();
                    if (existingAddress != null)
                    {
                        _mapper.Map(request.UpdateAddressCommand, existingAddress);
                    }
                    else
                    {
                        var newAddress = _mapper.Map<RealEstateAddress>(request.UpdateAddressCommand);
                        newAddress.RealEstateId = request.RealEstateId;
                        await _addressRepository.AddAsync(newAddress);
                    }

                }

                // Feature values güncellemesi
                if (request.UpdateRealEstateTypeFeatureValueCommand != null && request.UpdateRealEstateTypeFeatureValueCommand.Any())
                {
                    var existingFeatureValues = await _featureValueReadRepository
                        .GetWhere(fv => fv.RealEstateId == request.RealEstateId)
                        .ToListAsync();
                    var existingDict = existingFeatureValues.ToDictionary(fv => fv.RealEstateTypeFeatureId);

                    foreach (var cmd in request.UpdateRealEstateTypeFeatureValueCommand)
                    {
                        if (existingDict.TryGetValue(cmd.RealEstateTypeFeatureId, out var feature))
                        {
                            _mapper.Map(cmd, feature);
                            await _featureValueRepository.Update(feature);

                            existingDict.Remove(cmd.RealEstateTypeFeatureId);
                        }
                        else
                        {
                            var newFeature = _mapper.Map<RealEstateTypeFeatureValue>(cmd);
                            newFeature.RealEstateId = request.RealEstateId;
                            await _featureValueRepository.AddAsync(newFeature);
                        }
                    }

                    // Kalanları sil
                    foreach (var remaining in existingDict.Values)
                    {
                        await _featureValueRepository.DeleteAsync(remaining.Id);
                    }
                }

                // Images güncellemesi
                if (request.UpdateRealEstatePhotosDto != null && request.UpdateRealEstatePhotosDto.Commands != null && request.UpdateRealEstatePhotosDto.Commands.Any())
                {
                    var existingImages = await _imageReadRepository.GetWhere(img => img.RealEstateId == request.RealEstateId).ToListAsync();
                    var processedIds = new List<string>();
                    int newFileIndex = 0;

                    foreach (var imgCmd in request.UpdateRealEstatePhotosDto.Commands)
                    {
                        if (!string.IsNullOrEmpty(imgCmd.Id))
                        {
                            var img = existingImages.FirstOrDefault(e => e.Id == imgCmd.Id);
                            if (img != null)
                            {
                                _mapper.Map(imgCmd, img);
                                processedIds.Add(img.Id);
                            }
                        }
                        else if (request.UpdateRealEstatePhotosDto.ImageFiles != null && newFileIndex < request.UpdateRealEstatePhotosDto.ImageFiles.Count)
                        {
                            var file = request.UpdateRealEstatePhotosDto.ImageFiles[newFileIndex];
                            var url = await _fileStorageService.SaveFileAsync(file, request.RealEstateId);
                            var newImg = _mapper.Map<RealEstateImage>(imgCmd);
                            newImg.ImageUrl = url;
                            newImg.RealEstateId = request.RealEstateId;
                            await _imageRepository.AddAsync(newImg);
                            newFileIndex++;
                        }
                    }

                    // Silinecekleri kaldır
                    foreach (var img in existingImages.Where(e => !processedIds.Contains(e.Id)))
                    {
                        await _fileStorageService.DeleteFileAsync(img.ImageUrl);
                        await _imageRepository.DeleteAsync(img.Id);
                    }
                }

                // Return value


                var realEstateType = await _realEstateTypeRepository.GetByIdAsync(existingEstate.RealEstateTypeId);
                returnValue.RealEstateTypeName = realEstateType?.Name;

                var primaryImage = await _imageReadRepository
                    .GetWhere(img => img.RealEstateId == request.RealEstateId && img.IsPrimary)
                    .FirstOrDefaultAsync();

                returnValue.PrimaryImageUrl = primaryImage?.ImageUrl;

                await _unitOfWork.CommitTransactionAsync();
                return returnValue;
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }
    }
}
