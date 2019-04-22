const apiConfig = {
  hostName: '',
  version: '',
  fullUrl: '',
  setEnv: function (env) {
    if (env === "dev") {
      this.fullUrl = "http://192.168.1.125/v1";
    } else if (env === "test") {
      this.fullUrl = "https://testlite.pugongying.link/v1";
    } else if (env === "pro") {
      this.fullUrl = "https://testlite.pugongying.link/v1";
    }
  }
}

//开发环境
apiConfig.setEnv("dev");
//测式环境
//apiConfig.setEnv("test");
//正式环境
//apiConfig.setEnv("pro");

export default{
  
}