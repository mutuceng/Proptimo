using Microsoft.EntityFrameworkCore;
using Proptimo.Domain.Entities.Common;
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
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }

        public string CityId { get; set; }
        public City City { get; set; }

        public ICollection<Neighborhood> Neighborhoods { get; set; }
    }
}
