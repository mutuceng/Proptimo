using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Exceptions
{
    public class RegisterFailedExceptions : Exception
    {
        public RegisterFailedExceptions() : base("Kullanıcı kaydı sırasında hata meydana geldi. ") 
        {
        }

        public RegisterFailedExceptions(string? message) : base(message)
        {
        }

        public RegisterFailedExceptions(string? message, Exception? innerException) : base(message, innerException)
        {
        }

        protected RegisterFailedExceptions(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
