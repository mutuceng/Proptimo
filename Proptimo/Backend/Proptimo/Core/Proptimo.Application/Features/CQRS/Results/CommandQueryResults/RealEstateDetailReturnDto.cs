using Proptimo.Application.Features.CQRS.Commands.RealEstateAddressCommands;
using Proptimo.Application.Features.CQRS.Results.RealEstateAddressQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateImageQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeFeatureQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeFeatureValueQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Results.CommandQueryResults
{
    public class RealEstateDetailReturnDto
    {
        public GetEstateByIdQueryResult RealEstate { get; set; }
        public GetAddressByEstateIdQueryResult Address { get; set; }
        public List<GetRealEstateTypeFeaturesByTypeIdQueryResult> Features { get; set; }
        public List<GetRealEstateTypeFeatureValuesByEstateIdQueryResult> FeatureValues { get; set; }
        public List<GetAllRealEstateImagesByEstateIdQueryResult> Images { get; set; }
    }
}
