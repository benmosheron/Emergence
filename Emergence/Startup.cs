using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Emergence.Startup))]
namespace Emergence
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
