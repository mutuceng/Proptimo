using AutoMapper;
using Proptimo.Application.Features.CQRS.Commands.AppUserCommands;
using Proptimo.Application.Features.CQRS.Commands.CsvLocationCommands;
using Proptimo.Application.Features.CQRS.Commands.CurrencyCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateAddressCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateImageCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureValueCommands;
using Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureValueQueries;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using Proptimo.Application.Features.CQRS.Results.CsvLocationQueryResults;
using Proptimo.Application.Features.CQRS.Results.CurrencyQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateAddressQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateImageQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeFeatureQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeFeatureValueQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeQueryResults;
using Proptimo.Domain.Entities;
using Proptimo.Domain.Entities.Address;
using Proptimo.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Proptimo.Application.Features.CQRS.Commands.CsvLocationCommands.CreateDistrictCommand;
using static Proptimo.Application.Features.CQRS.Commands.CsvLocationCommands.CreateNeighborhoodCommand;

namespace Proptimo.Application.Mapping
{
    public class GeneralMapping : Profile
    {
        public GeneralMapping() 
        {
            CreateMap<RealEstate, CreateRealEstateCommand>().ReverseMap();
            CreateMap<RealEstate, UpdateRealEstateCommand>().ReverseMap();
            CreateMap<RealEstate, GetAllEstatesQueryResult>().ReverseMap();
            CreateMap<RealEstate, GetEstateByIdQueryResult>().ReverseMap();

            CreateMap<RealEstateAddress, CreateAddressCommand>().ReverseMap();
            CreateMap<RealEstateAddress, UpdateAddressCommand>().ReverseMap();
            CreateMap<RealEstateAddress, GetAllAdressQueryResult>().ReverseMap();
            CreateMap<RealEstateAddress, GetAddressByIdQueryResult>().ReverseMap();
            CreateMap<RealEstateAddress, GetAddressByEstateIdQueryResult>().ReverseMap();

            CreateMap<RealEstateType, CreateEstateTypeCommand>().ReverseMap();
            CreateMap<RealEstateType, UpdateEstateTypeCommand>().ReverseMap();
            CreateMap<RealEstateType, GetAllEstateTypesQueryResult>().ReverseMap();
            CreateMap<RealEstateType, GetEstateTypeByIdQueryResult>().ReverseMap();

            CreateMap<RealEstateTypeFeature,  GetRealEstateTypeFeaturesByTypeIdQueryResult>().ReverseMap();
            CreateMap<RealEstateTypeFeature, CreateRealEstateTypeFeatureCommand>().ReverseMap();
            CreateMap<RealEstateTypeFeature, UpdateRealEstateTypeFeatureCommand>().ReverseMap();
            CreateMap<RealEstateTypeFeature, GetRealEstateTypeFeatureValuesByEstateIdQueryResult>().ReverseMap();

            CreateMap<RealEstateTypeFeatureValue, CreateRealEstateTypeFeatureValueCommand>().ReverseMap();
            CreateMap<RealEstateTypeFeatureValue, GetRealEstateTypeFeatureValuesByEstateIdQueryResult>().ReverseMap();


            CreateMap<RealEstateImage, CreateRealEstateImageCommand>().ReverseMap();
            CreateMap<RealEstateImage, GetAllRealEstateImagesByEstateIdQueryResult>().ReverseMap();

            CreateMap<Currency, CreateCurrencyCommand>().ReverseMap();
            CreateMap<Currency, UpdateCurrencyCommand>().ReverseMap();
            CreateMap<Currency, GetAllCurrenciesQueryResult>().ReverseMap();
            CreateMap<Currency, GetByIdCurrencyQueryResult>().ReverseMap();

            CreateMap<Currency, CurrencyReturnDto>().ReverseMap();
            CreateMap<RealEstateType, RealEstateTypeReturnDto>().ReverseMap();
            CreateMap<RealEstateTypeFeature, RealEstateTypeFeatureReturnDto>().ReverseMap();
            CreateMap<RealEstateTypeFeatureValue, RealEstateTypeFeatureValueReturnDto>().ReverseMap();
            CreateMap<RealEstateAddress, RealEstateAddressReturnDto>().ReverseMap();
            CreateMap<RealEstateImage, RealEstateImageReturnDto>().ReverseMap();
            CreateMap<RealEstate, RealEstateReturnDto>().ReverseMap();

            CreateMap<City, CityDto>().ReverseMap();
            CreateMap<District, DistrictDto>().ReverseMap();
            CreateMap<Neighborhood, NeighborhoodDto>().ReverseMap();

            CreateMap<District, CreateDistricDto>().ReverseMap();
            CreateMap<Neighborhood, CreateNeighborhoodDto>().ReverseMap();


            CreateMap<AppUser, UserRegisterCommand>().ReverseMap();
        }
    }
}
