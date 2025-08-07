using AutoMapper;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateTypeCommands;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateAddressQueryResults;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateQueryResults;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateTypeQueryResults;
using Proptimo.Domain.Entities;
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
        }
    }
}
