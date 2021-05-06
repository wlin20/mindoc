package conf

import "github.com/astaxie/beego"

type ThirdLoginConfig struct {
	Open    bool
	AuthUrl string
	ExtData string
	Prefix  string
	Name    string
}

func GetThirdLoginConfig() *ThirdLoginConfig {
	config := NewThirdLoginConfig()
	config.Open = beego.AppConfig.DefaultBool("third_login_open", false)
	config.Name = beego.AppConfig.DefaultString("third_login_name", "")
	config.AuthUrl = beego.AppConfig.DefaultString("third_login_url", "")
	config.ExtData = beego.AppConfig.DefaultString("third_login_ext_data", "")
	config.Prefix = beego.AppConfig.DefaultString("third_login_prefix", "")
	return config
}

// NewAuthLoginHttpService
func NewThirdLoginConfig() *ThirdLoginConfig {
	return &ThirdLoginConfig{}
}
