<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <title>找回密码 - Powered by MinDoc</title>
    <style type="text/css">
        .ua-macos::-webkit-scrollbar{ display: none; }
        html,body{background-color: transparent;margin:0;padding: 0;}
        body{font: 16px/1.5 "Microsoft Yahei", "微软雅黑", verdana;word-wrap:break-word;}
        .js-dialog{font-size: 14px;}
        pre, .js-pre {
            white-space: pre-wrap;
            white-space: -moz-pre-wrap;
            white-space: -pre-wrap;
            white-space: -o-pre-wrap;
            word-wrap: break-word;
            font: 16px/1.5 "Microsoft Yahei", "微软雅黑", verdana;
            padding:8px 10px;margin:0;
        }
        .rm_line{border-top:2px solid #F1F1F1; font-size:0; margin:15px 0}
        .atchImg img{border:2px solid #c3d9ff;}
        .lnkTxt{ color:#0066CC}
        .rm_PicArea *{ font-family: "Microsoft Yahei", "微软雅黑", verdana;font-size:16px;font-weight:700;}
        .fbk3{ color:#333; line-height:160%}
        .fTip{ font-size:11px; font-weight:normal}

        img{border:none;vertical-align: middle;}
        iframe{display:none;}
        *{word-break:break-word;}
        #neteaseEncryptedMail{display:none;}
        #jy-translate{
            position: absolute;
            max-width: 500px;
            min-width: 100px;
            _width:300px;
            border: 1px solid rgb(204, 204, 204);
            padding: 4px 18px 4px 10px;
            background-color: #f9f9f9;
            -webkit-border-radius:3px;
            -moz-border-radius:3px;
            border-radius:3px;
            -webkit-box-shadow:#dddddd 0px 0px 10px;
            -moz-box-shadow:#dddddd 0px 0px 10px;
            box-shadow:#dddddd 0px 0px 10px;
        }
        #jy-translate h2,
        #jy-translate p{color:#555;margin:0;padding:0;}
        #jy-translate h2{line-height: 28px;font-size: 14px;}
        #jy-translate p{line-height: 24px;font-size: 12px;}
        #jy-translate h2 span{font-weight:normal;}
        .ua-noyahei,
        .ua-noyahei .pre,
        .ua-noyahei .js-pre,
        .ua-noyahei .rm_PicArea *{font-family: \5b8b\4f53, sans-serif;}
        .ua-macos,
        .ua-macos .pre,
        .ua-macos .js-pre,
        .ua-macos .rm_PicArea *{font-family: "Lucida Grande","Hiragino Sans GB","Hiragino Sans GB W3", verdana;}

        .jy-contact{float: left;}
        .jy-contact-hover{background: #eee;}
        .jy-contact img.oprt{width: 23px;height: 23px;border: 0;vertical-align: middle;cursor: pointer;}
    </style>
</head>
<body onunload="" class="js-body">
<div>
    <div class="wrapper" style="margin: 20px auto 0; width: 500px; padding-top:16px; padding-bottom:10px;">
        <div class="header clearfix">
            <a class="logo" href="{{.BaseUrl}}" target="_blank"><b>{{.SITE_NAME}}</b></a>
        </div>
        <br style="clear:both; height:0">
        <div class="content" style="background: none repeat scroll 0 0 #FFFFFF; border: 1px solid #E9E9E9; margin: 2px 0 0; padding: 30px;">

            <p>您好: </p>

            <p>您在 {{.SITE_NAME}} 申请注册账号。<br>如果您没有申请, 请忽略本邮件</p>

            <p style="border-top: 1px solid #DDDDDD;margin: 15px 0 25px;padding: 15px;">
                请点击链接继续操作，已完成注册: <a href="{{.url}}" target="_blank">{{.url}}</a>
            </p>
            <p class="footer" style="border-top: 1px solid #DDDDDD; padding-top:6px; margin-top:25px; color:#838383;">
                (请勿回复本邮件) <br><br>
                <a href="{{.BaseUrl}}" target="_blank">{{.SITE_NAME}}</a>
            </p>
        </div>
    </div>
</div>
</body>
</html>