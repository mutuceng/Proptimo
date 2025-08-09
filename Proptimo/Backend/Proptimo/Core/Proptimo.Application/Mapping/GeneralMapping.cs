using AutoMapper;
using Proptimo.Application.Features.CQRS.Commands.AppUserCommands;
using Proptimo.Application.Features.CQRS.Commands.CurrencyCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateAddressCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureCommands;
using Proptimo.Application.Features.CQRS.Results.CurrencyQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateAddressQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeFeatureQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeQueryResults;
using Proptimo.Domain.Entities;
using Proptimo.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Mapping
{
    public class GeneralMapping : Profile
    {
        public GeneralMapping() 
        {
            CreateMap<RealEstate, CreateRealEstateCommand>().ReverseMap();
            CreateMap<RealEstate, UpdateRealEstateCommand>().ReverseMap();
            CreateMap<RealEstate, GetAllEstatesQueryResult>().ReverseMap();
            CreateMap<RealEstate, GetAllEstatesByConditionQueryResult>().ReverseMap();
            CreateMap<RealEstate, GetEstateByIdQueryResult>().ReverseMap();

            CreateMap<RealEstateAddress, CreateAddressCommand>().ReverseMap();
            CreateMap<RealEstateAddress, UpdateAddressCommand>().ReverseMap();
            CreateMap<RealEstateAddress, GetAllAdressQueryResult>().ReverseMap();
            CreateMap<RealEstateAddress, GetAddressByIdQueryResult>().ReverseMap();

            CreateMap<RealEstateType, CreateEstateTypeCommand>().ReverseMap();
            CreateMap<RealEstateType, UpdateEstateTypeCommand>().ReverseMap();
            CreateMap<RealEstateType, GetAllEstateTypesQueryResult>().ReverseMap();
            CreateMap<RealEstateType, GetEstateTypeByIdQueryResult>().ReverseMap();

            CreateMap<RealEstateTypeFeature,  GetRealEstateTypeFeaturesByTypeIdQueryResult>().ReverseMap();
            CreateMap<RealEstateTypeFeature, CreateRealEstateTypeFeatureCommand>().ReverseMap();
            CreateMap<RealEstateTypeFeature, UpdateRealEstateTypeFeatureCommand>().ReverseMap();

            CreateMap<Currency, CreateCurrencyCommand>().ReverseMap();
            CreateMap<Currency, UpdateCurrencyCommand>().ReverseMap();
            CreateMap<Currency, GetAllCurrenciesQueryResult>().ReverseMap();
            CreateMap<Currency, GetByIdCurrencyQueryResult>().ReverseMap();


            CreateMap<AppUser, UserRegisterCommand>().ReverseMap();
        }
    }
}
