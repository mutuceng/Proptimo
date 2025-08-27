using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Dtos
{
    public class UpdateEstateCommand
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int ListingType { get; set; }
        public int State { get; set; }
        public Guid RealEstateTypeId { get; set; }
    }
}
