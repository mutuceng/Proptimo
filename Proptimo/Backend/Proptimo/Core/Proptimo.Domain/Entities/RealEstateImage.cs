using Proptimo.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Domain.Entities
{
    public class RealEstateImage: BaseEntity
    {
        public string ImageUrl { get; set; }
        public bool IsPrimary { get; set; }
        public int Order { get; set; }   

        public string RealEstateId { get; set; }
        public RealEstate RealEstate { get; set; }
    }
}
