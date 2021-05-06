package services

import (
	"fmt"
	"github.com/lifei6671/mindoc/conf"
	"net/url"
)

// AuthLoginResponse auth login response result
type AuthLoginResponse struct {
	GivenName  string `json:"given_name"`
	Email      string `json:"email"`
	Mobile     string `json:"mobile"`
	Phone      string `json:"phone"`
	Department string `json:"department"`
	Position   string `json:"position"`
	Location   string `json:"location"`
	Im         string `json:"im"`
}

const (
	AuthLoginProtocolHttp  = "http"
	AuthLoginProtocolHttps = "https"
	AuthLoginProtocolLdap  = "ldap"
	AuthLoginProtocolLdaps = "ldaps"
)

// AuthLoginService auth login service
type AuthLoginService interface {

	// Init init login config
	InitConf(url string, conf string) error

	// GetServiceName get auth login service name
	GetServiceName() string

	// AuthLogin auth login request
	AuthLogin(username string, password string) (*AuthLoginResponse, error)
}

var AuthLogin = NewAuthLoginManager()

// AuthLoginManager auth login manager
type AuthLoginManager struct {
	AuthLoginServices map[string]AuthLoginService
}

// NewAuthLoginManager new a auth login manager
func NewAuthLoginManager() *AuthLoginManager {
	authLoginManager := &AuthLoginManager{
		AuthLoginServices: make(map[string]AuthLoginService),
	}
	return authLoginManager
}

// RegisterService register a auth login service
func (am *AuthLoginManager) RegisterService(serviceName string, authLoginService AuthLoginService) {
	if authLoginService == nil {
		return
	}
	if _, ok := am.AuthLoginServices[serviceName]; ok {
		panic(fmt.Sprintf("[AuthLoginManager] RegisterService '%s' already exists", serviceName))
	}
	am.AuthLoginServices[serviceName] = authLoginService
}

func (am *AuthLoginManager) UrlIsSupport(serviceName string) bool {
	if _, ok := am.AuthLoginServices[serviceName]; ok {
		return true
	}
	return false
}

// AuthLogin start auth login
func (am *AuthLoginManager) AuthLogin(username, password string) (*AuthLoginResponse, error) {

	// is open auth login
	thirdLoginConfig := conf.GetThirdLoginConfig()
	if !thirdLoginConfig.Open {
		return nil, fmt.Errorf("系统未开启第三方登录功能！")
	}

	// parse url protocol
	if thirdLoginConfig.AuthUrl == "" {
		return nil, fmt.Errorf("登录配置 url 无效")
	}
	u, err := url.Parse(thirdLoginConfig.AuthUrl)
	if err != nil {
		return nil, fmt.Errorf("登录配置 url 不合法：%s", err.Error())
	}
	// 协议
	serviceName := u.Scheme
	authLoginService, ok := am.AuthLoginServices[serviceName]
	if !ok {
		return nil, fmt.Errorf("登录配置 url 协议不支持")
	}
	serviceConf := thirdLoginConfig.ExtData
	// init auth login service config
	err = authLoginService.InitConf(thirdLoginConfig.AuthUrl, serviceConf)
	if err != nil {
		return nil, fmt.Errorf("登录配置初始化失败：%s", err.Error())
	}
	// start auth login
	return authLoginService.AuthLogin(username, password)
}
