package mail

import (
	"crypto/tls"
	"github.com/lifei6671/mindoc/conf"
	"gopkg.in/gomail.v2"
)

func SendUseGoMail(mailConf *conf.SmtpConf, toEmail string, subject string, body string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", mailConf.FormUserName)
	m.SetHeader("To", toEmail)
	//m.SetAddressHeader("Cc", ccEmail, ccEmail)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)
	//m.Attach("/home/Alex/lolcat.jpg")

	d := gomail.NewDialer(mailConf.SmtpHost, mailConf.SmtpPort, mailConf.SmtpUserName, mailConf.SmtpPassword)
	if mailConf.Secure == "SSL" {
		d.TLSConfig = &tls.Config{InsecureSkipVerify: true}
	}

	// Send the email to Bob, Cora and Dan.
	return d.DialAndSend(m)
}
