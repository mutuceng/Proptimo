using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Dtos.CurrencyDtos
{
    public class CurrencyConversionRequestDto
    {
        public string From { get; set; } = "TRY"; 
        public string To { get; set; }    
        public decimal Amount { get; set; } 
    }
}
