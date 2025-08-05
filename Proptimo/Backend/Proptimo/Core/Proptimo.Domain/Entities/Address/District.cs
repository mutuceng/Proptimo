using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Domain.Entities.Address
{
    public class District
    {
        public int DistrictId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        public int CityId { get; set; }
        public City City { get; set; }

        public ICollection<Neighborhood> Neighborhoods { get; set; }
    }
}
