using Proptimo.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Domain.Entities
{
    public class Currency: BaseEntity
    {
        public string Name { get; set; }
        public string Symbol { get; set; }

    }
}
