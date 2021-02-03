<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>文章列表 </title>
    <meta name="keywords" content="MinDoc,文档在线管理系统,WIKI,wiki,wiki在线,文档在线管理,接口文档在线管理,接口文档管理">
    <meta name="description" content="MinDoc文档在线管理系统 {{.site_description}}">
    <!-- Bootstrap -->
    <link href="{{cdncss "/static/bootstrap/css/bootstrap.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/font-awesome/css/font-awesome.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/css/main.css" "version"}}" rel="stylesheet">

    <style type="text/css">
        .footer{margin-top: 0;}
        .label {
            background-color: #00b5ad!important;
            border-color: #00b5ad!important;
            color: #fff!important;
            font-weight: 400;
        }
    </style>
</head>
<body>
<div class="manual-reader manual-container manual-search-reader">
{{template "widgets/header.tpl" .}}
    <div class="container manual-body">
        <div class="row">
            <div class="manual-list">
            {{range $index,$item := .Lists}}
                <div class="search-item">
                    <div class="title">{{if eq $item.BlogStatus "password"}}<span class="label">密</span>{{end}} <a href="{{urlfor "BlogController.Index" ":id" $item.BlogId}}" title="{{$item.BlogTitle}}" >{{$item.BlogTitle}}</a> </div>
                    <div class="description">
                    {{$item.BlogExcerpt}}
                    </div>
                    {{/*<div class="site">{{urlfor "BlogController.Index" ":id" $item.BlogId}}</div>*/}}
                    <div class="source">
                        <span class="item">作者：{{$item.CreateName}}</span>
                        <span class="item">更新时间：{{date_format  $item.Modified "2006-01-02 15:04:05"}}</span>

                        {{if or (eq $item.MemberId $.Member.MemberId)  (eq $.Member.Role 0 1)}}
                            <div class="item"><a href='{{urlfor "BlogController.ManageEdit" ":id" $item.BlogId}}' title="文章编辑"><i class="fa fa-edit"></i> 编辑</a></div>
                        {{end}}
                    </div>
                </div>
            {{else}}
                <div class="search-empty">
                    <img src="{{cdnimg "/static/images/search_empty.png"}}" class="empty-image">
                    <span class="empty-text">暂无文章</span>
                </div>
            {{end}}
                <nav class="pagination-container">
                {{.PageHtml}}
                </nav>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
{{template "widgets/footer.tpl" .}}
</div>
<script src="{{cdnjs "/static/jquery/1.12.4/jquery.min.js"}}"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}"></script>
{{.Scripts}}
</body>
</html>