using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Dtos.AuthDtos
{
    public class RefreshAccessTokenRequest
    {
        public string RefreshToken { get; set; }
    }
}
