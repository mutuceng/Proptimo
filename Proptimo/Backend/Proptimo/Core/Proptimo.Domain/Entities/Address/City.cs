using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Domain.Entities.Address
{
    public class City
    {
        public int CityId { get; set; }
        public string Name { get; set; }

        public ICollection<District> Districts { get; set; }
    }
}
