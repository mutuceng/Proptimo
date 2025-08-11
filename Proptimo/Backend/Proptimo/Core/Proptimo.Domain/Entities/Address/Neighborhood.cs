using Proptimo.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Domain.Entities.Address
{
    public class Neighborhood : BaseEntity
    {
        public string Name { get; set; }

        public string DistrictId { get; set; }
        public District District { get; set; }

    }
}
