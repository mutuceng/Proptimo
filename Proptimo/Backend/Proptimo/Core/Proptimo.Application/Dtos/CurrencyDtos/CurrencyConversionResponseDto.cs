using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Dtos.CurrencyDtos
{
    public class CurrencyConversionResponseDto
    {
        public bool Success { get; set; }
        public string Date { get; set; }
        public decimal Result { get; set; }
    }
}
