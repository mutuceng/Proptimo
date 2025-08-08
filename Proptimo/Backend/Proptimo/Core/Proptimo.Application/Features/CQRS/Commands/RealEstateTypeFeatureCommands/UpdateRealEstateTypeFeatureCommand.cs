using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureCommands
{
    public class UpdateRealEstateTypeFeatureCommand : IRequest
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string DataType { get; set; }
        public bool IsUnit { get; set; }
        public bool IsRequired { get; set; }
        public List<string>? Options { get; set; }

        public string RealEstateTypeId { get; set; }
    }
}
