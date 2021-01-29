
<header class="navbar navbar-static-top manual-head" role="banner">
    <div class="container-fluid">
        <div class="navbar-header pull-left manual-title">

            <div class="logo-content">
                <a href="{{urlfor "HomeController.Index"}}">
                    <img src="/static/images/logo.jpg"  class="img-circle  logo-avatar" alt="">
                    <span></span>
                </a>
            </div>

            <span class="slidebar" id="slidebar"><i class="fa fa-align-justify"></i></span>
            <a href="{{urlfor "ItemsetsController.Index" }}" title="{{.Model.BookName}}" class="book-title">库空间/</a>
            <a href="{{urlfor "ItemsetsController.List" ":key" .Model.ItemKey}}" title="{{.Model.BookName}}" class="book-title">{{.Model.ItemName}}/</a>
            <a href="{{urlfor "DocumentController.Index" ":key" .Model.Identify}}" title="{{.Model.BookName}}" class="book-title">{{.Model.BookName}}</a>
            <span style="font-size: 12px;font-weight: 100;"></span>
        </div>
        <div class="navbar-header pull-right manual-menu">
            <a href="javascript:window.print();" id="printSinglePage" class="btn btn-default" style="margin-right: 10px;"><i class="fa fa-print"></i> 打印</a>
            {{if gt .Member.MemberId 0}}
                {{if eq .Model.RoleId 0 1 2}}
                    <div class="dropdown pull-right">
                        <a href="{{urlfor "DocumentController.Edit" ":key" .Model.Identify ":id" ""}}" class="btn btn-default"><i class="fa fa-edit" aria-hidden="true"></i> 编辑</a>
                        {{if eq .Model.RoleId 0 1}}
                            <a href="{{urlfor "BookController.Users" ":key" .Model.Identify}}" class="btn btn-success"><i class="fa fa-user" aria-hidden="true"></i> 成员</a>
                            <a href="{{urlfor "BookController.Setting" ":key" .Model.Identify}}" class="btn btn-primary"><i class="fa fa-gear" aria-hidden="true"></i> 设置</a>
                        {{end}}
                    </div>
                {{end}}
            {{end}}
            <div class="dropdown pull-right" style="margin-right: 10px;">
                <a href="{{urlfor "HomeController.Index"}}" class="btn btn-default"><i class="fa fa-home" aria-hidden="true"></i> 首页</a>
            </div>

            <div class="dropdown pull-right" style="margin-right: 10px;">
                {{if eq .Model.PrivatelyOwned 0}}
                    {{if .Model.IsEnableShare}}
                        <button type="button" class="btn btn-success" data-toggle="modal" data-target="#shareProject"><i class="fa fa-share-square" aria-hidden="true"></i> 分享</button>
                    {{end}}
                {{end}}
            </div>
            <!-- 下载按钮 -->
            {{if .Model.IsDownload}}
            <div class="dropdown pull-right" style="margin-right: 10px;">
                <button type="button" class="btn btn-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-cloud-download" aria-hidden="true"></i> 下载 <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel" style="margin-top: -5px;">
                    <li><a href="{{urlfor "DocumentController.Export" ":key" .Model.Identify "output" "pdf"}}" target="_blank">PDF</a> </li>
                    <li><a href="{{urlfor "DocumentController.Export" ":key" .Model.Identify "output" "epub"}}" target="_blank">EPUB</a> </li>
                    <li><a href="{{urlfor "DocumentController.Export" ":key" .Model.Identify "output" "mobi"}}" target="_blank">MOBI</a> </li>
                    <li><a href="{{urlfor "DocumentController.Export" ":key" .Model.Identify "output" "docx"}}" target="_blank">Word</a> </li>
                    {{if eq .Model.Editor "markdown"}}
                        <li><a href="{{urlfor "DocumentController.Export" ":key" .Model.Identify "output" "markdown"}}" target="_blank">Markdown</a> </li>
                    {{end}}
                </ul>
            </div>
            {{end}}


        </div>
    </div>
</header>