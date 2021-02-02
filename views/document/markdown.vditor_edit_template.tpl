<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>编辑文库 - {{.Model.BookName}}</title>
    <script type="text/javascript">
        window.treeCatalog = null;
        window.baseUrl = "{{.BaseUrl}}";
        window.saveing = false;
        window.katex = { js: "{{cdnjs "/static/katex/katex"}}",css: "{{cdncss "/static/katex/katex"}}"};
        window.editormdLib = "{{cdnjs "/static/editor.md/lib/"}}";
        window.editor = null;
        window.imageUploadURL = "{{urlfor "DocumentController.Upload" "identify" .Model.Identify}}";
        window.fileUploadURL = "{{urlfor "DocumentController.Upload" "identify" .Model.Identify}}";
        window.documentCategory = {{.Result}};
        window.book = {{.ModelResult}};
        window.selectNode = null;
        window.deleteURL = "{{urlfor "DocumentController.Delete" ":key" .Model.Identify}}";
        window.editURL = "{{urlfor "DocumentController.Content" ":key" .Model.Identify ":id" ""}}";
        window.releaseURL = "{{urlfor "BookController.Release" ":key" .Model.Identify}}";
        window.sortURL = "{{urlfor "BookController.SaveSort" ":key" .Model.Identify}}";
        window.historyURL = "{{urlfor "DocumentController.History"}}";
        window.removeAttachURL = "{{urlfor "DocumentController.RemoveAttachment"}}";
        window.highlightStyle = "{{.HighlightStyle}}";
        window.template = { "getUrl":"{{urlfor "TemplateController.Get"}}", "listUrl" : "{{urlfor "TemplateController.List"}}", "deleteUrl" : "{{urlfor "TemplateController.Delete"}}", "saveUrl" :"{{urlfor "TemplateController.Add"}}"}

        window.data = {}
        window.data.book = {{.ModelResult}}
        window.data.uploadFileSize = {{.UploadFileSize}}
        window.data.uploadServer ={{urlfor "DocumentController.Upload" }}
        window.data.baseUrl = "{{.BaseUrl}}";
    </script>
    <!-- Bootstrap -->
    <link href="{{cdncss "/static/bootstrap/css/bootstrap.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/font-awesome/css/font-awesome.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/jstree/3.3.4/themes/default/style.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/editor.md/css/editormd.css" "version"}}" rel="stylesheet">

    <link href="{{cdncss "/static/css/jstree.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/webuploader/webuploader.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/css/markdown.css" "version"}}" rel="stylesheet">
    <link href="{{cdncss "/static/css/markdown.preview.css" "version"}}" rel="stylesheet">
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="/static/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="/static/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <style type="text/css">
        .text{
            font-size: 12px;
            color: #999999;
            font-weight: 200;
        }
    </style>
    <link href="{{cdncss "/static/css/header.book.css" "version"}}" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vditor@3.8.0/dist/index.css" />
{{/*    <script src="https://cdn.jsdelivr.net/npm/vditor@3.8.0/dist/index.min.js"></script>*/}}
    <script src="{{cdncss "/static/vditor/vditor.3.8.0.js" }}"></script>
</head>
<body id="vue">

<div class="m-manual manual-editor">
    <div class="manual-head" id="editormd-tools" style="min-width: 1200px; position:absolute;">

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

        <div class="editormd-group pull-right">
            <a href="{{urlfor "DocumentController.Index" ":key" .Model.Identify}}" data-toggle="tooltip" data-title="退出编辑模式"><i class="fa fa-sign-out" aria-hidden="true"></i></a>
        </div>


        <!--
        <div class="editormd-group">
            <a href="javascript:;" data-toggle="tooltip" data-title="撤销 (Ctrl-Z)"><i class="fa fa-undo first" name="undo" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="重做 (Ctrl-Y)"><i class="fa fa-repeat last" name="redo" unselectable="on"></i></a>
        </div>

        <div class="editormd-group">
            <a href="javascript:;" data-toggle="tooltip" data-title="粗体"><i class="fa fa-bold first" name="bold" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="斜体"><i class="fa fa-italic item" name="italic" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="删除线"><i class="fa fa-strikethrough last" name="del" unselectable="on"></i></a>
        </div>
        <div class="editormd-group">
            <a href="javascript:;" data-toggle="tooltip" data-title="标题一"><i class="fa editormd-bold first" name="h1" unselectable="on">H1</i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="标题二"><i class="fa editormd-bold item" name="h2" unselectable="on">H2</i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="标题三"><i class="fa editormd-bold item" name="h3" unselectable="on">H3</i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="标题四"><i class="fa editormd-bold item" name="h4" unselectable="on">H4</i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="标题五"><i class="fa editormd-bold item" name="h5" unselectable="on">H5</i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="标题六"><i class="fa editormd-bold last" name="h6" unselectable="on">H6</i></a>
        </div>
        <div class="editormd-group">
            <a href="javascript:;" data-toggle="tooltip" data-title="无序列表"><i class="fa fa-list-ul first" name="list-ul" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="有序列表"><i class="fa fa-list-ol item" name="list-ol" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="横线"><i class="fa fa-minus last" name="hr" unselectable="on"></i></a>
        </div>
        -->
        <div class="editormd-group pull-right">
            <!--
            <a href="javascript:;" data-toggle="tooltip" data-title="链接"><i class="fa fa-link first" name="link" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="引用链接"><i class="fa fa-anchor item" name="reference-link" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="添加图片"><i class="fa fa-picture-o item" name="image" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="行内代码"><i class="fa fa-code item" name="code" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="代码块" unselectable="on"><i class="fa fa-file-code-o item" name="code-block" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="添加表格"><i class="fa fa-table item" name="table" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="引用"><i class="fa fa-quote-right item" name="quote" unselectable="on"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="GFM 任务列表"><i class="fa fa-tasks item" name="tasks" aria-hidden="true"></i></a>
            -->
            <a href="javascript:;" data-toggle="tooltip" data-title="附件"><i class="fa fa-paperclip item" aria-hidden="true" name="attachment"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="Json转换为表格"><i class="fa fa-wrench item" aria-hidden="true" name="json"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="模板"><i class="fa fa-tachometer last" name="template"></i></a>
        </div>

        <div class="editormd-group pull-right">
            <!--
            <a href="javascript:;" data-toggle="tooltip" data-title="关闭实时预览"><i class="fa fa-eye-slash first" name="watch" unselectable="on"></i></a>
            -->
            <a href="javascript:;" data-toggle="tooltip" data-title="修改历史"><i class="fa fa-history item" name="history" aria-hidden="true"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="边栏"><i class="fa fa-columns item" aria-hidden="true" name="sidebar"></i></a>
            <a href="javascript:;" data-toggle="tooltip" data-title="使用帮助"><i class="fa fa-question-circle-o last" aria-hidden="true" name="help"></i></a>
        </div>

        <div class="editormd-group pull-right">
            <a href="javascript:;" data-toggle="tooltip" data-title="发布"><i class="fa fa-cloud-upload" name="release" aria-hidden="true"></i></a>
        </div>
        <div class="editormd-group pull-right">
            <a href="javascript:;" id="markdown-save" data-toggle="tooltip" data-title="保存" class="disabled save"><i class="fa fa-save first" aria-hidden="true" name="save"></i></a>
            <a href="javascript:;" id="markdown-template" data-toggle="tooltip" data-title="保存为模板" class="template"><i class="fa fa-briefcase last" aria-hidden="true" name="save-template"></i></a>
        </div>

        <div class="editormd-group pull-right">
            <a href="javascript:;" data-toggle="tooltip" data-title="切换编辑器"><i class="fa fa-exchange" name="changeEditor" aria-hidden="true"></i></a>
        </div>

        <div class="editormd-group">
            <a href="javascript:;" data-toggle="tooltip" data-title=""></a>
            <a href="javascript:;" data-toggle="tooltip" data-title=""></a>
        </div>

        <div class="clearfix"></div>
    </div>
    <div class="manual-body">
        <div class="manual-category" id="manualCategory" style="position:absolute;">
            <div class="manual-nav">
                <div class="nav-item active"><i class="fa fa-bars" aria-hidden="true"></i> 文档</div>
                <div class="nav-plus pull-right" id="btnAddDocument" data-toggle="tooltip" data-title="创建文档" data-direction="right"><i class="fa fa-plus" aria-hidden="true"></i></div>
                <div class="clearfix"></div>
            </div>
            <div class="manual-tree" id="sidebar"> </div>
        </div>
        <div class="manual-editor-container" id="manualEditorContainer" style="min-width: 920px;">
{{/*            <div class="manual-editormd">*/}}
{{/*                <div id="docEditor" class="manual-editormd-active"></div>*/}}
{{/*            </div>*/}}
            <div id="vditor" class="vditor" style="height: 100%;padding-bottom: 30px"></div>
            <div class="manual-editor-status">
                <div id="attachInfo" class="item">0 个附件</div>
            </div>
        </div>

    </div>
</div>
<!-- 创建文档 -->
<div class="modal fade" id="addDocumentModal" tabindex="-1" role="dialog" aria-labelledby="addDocumentModalLabel">
    <div class="modal-dialog" role="document">
        <form method="post" action="{{urlfor "DocumentController.Create" ":key" .Model.Identify}}" id="addDocumentForm" class="form-horizontal">
            <input type="hidden" name="identify" value="{{.Model.Identify}}">
            <input type="hidden" name="doc_id" value="0">
            <input type="hidden" name="parent_id" value="0">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">添加文档</h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="col-sm-2 control-label">文档名称 <span class="error-message">*</span></label>
                    <div class="col-sm-10">
                        <input type="text" name="doc_name" id="documentName" placeholder="文档名称" class="form-control"  maxlength="50">
                        <p style="color: #999;font-size: 12px;">在目录的文档名上右键可以删除和修改文档名称以及添加下级文档</p>

                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">文档标识 <span class="error-message">&nbsp;</span></label>
                    <div class="col-sm-10">
                        <input type="text" name="doc_identify" id="documentIdentify" placeholder="文档唯一标识" class="form-control" maxlength="50">
                        <p style="color: #999;font-size: 12px;">文档标识只能包含小写字母、数字，以及“-”和“_”符号,并且只能小写字母开头</p>
                    </div>

                </div>
                <div class="form-group">
                        <div class="col-lg-4">
                            <label>
                                <input type="radio" name="is_open" value="1"> 展开<span class="text">(在阅读时会自动展开节点)</span>
                            </label>
                        </div>
                        <div class="col-lg-4">
                            <label>
                                <input type="radio" name="is_open" value="0" checked> 关闭<span class="text">(在阅读时会关闭节点)</span>
                            </label>
                        </div>
                    <div class="col-lg-4">
                        <label>
                            <input type="radio" name="is_open" value="2"> 空目录<span class="text">(单击时会展开下级节点)</span>
                        </label>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="modal-footer">
                <span id="add-error-message" class="error-message"></span>
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="submit" class="btn btn-primary" id="btnSaveDocument" data-loading-text="保存中...">立即保存</button>
            </div>
        </div>
        </form>
    </div>
</div>


<script src="{{cdnjs "/static/js/array.js" "version"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/jquery/1.12.4/jquery.min.js"}}"></script>
<script src="{{cdnjs "/static/vuejs/vue.min.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}"></script>
<script src="{{cdnjs "/static/webuploader/webuploader.min.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/jstree/3.3.4/jstree.min.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript" ></script>
<script src="{{cdnjs "/static/js/jquery.form.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/js/array.js" "version"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/js/editor.doctree.js" "version"}}" type="text/javascript"></script>
{{ template "document/editor-toolbar.tpl" . }}
<script src="{{cdnjs "/static/js/markdown.vditor.js" "version"}}" type="text/javascript"></script>
<script type="text/javascript">

    $(function (){
        $("#attachInfo").on("click",function () {
            $("#uploadAttachModal").modal("show");
        });

    })

</script>


</body>
</html>