using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Dtos
{
    public class UpdateEstateRequest
    {
        [FromForm] public string JsonData { get; set; }
        [FromForm] public IFormFileCollection? Images { get; set; }
    }
}
