using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Domain.Entities.Address
{
    public class Neighborhood
    {
        public int NeighborhoodId { get; set; }
        public string Name { get; set; }
        
        public int DistrictId { get; set; }
        public District District { get; set; }
        public ICollection<RealEstate> RealEstates { get; set; }
    }
}
