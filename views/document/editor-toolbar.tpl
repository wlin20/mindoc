<!-- 显示附件 --->
<div class="modal fade" id="uploadAttachModal" tabindex="-1" role="dialog" aria-labelledby="uploadAttachModalLabel">
    <div class="modal-dialog" role="document">
        <form method="post" id="uploadAttachModalForm" class="form-horizontal">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">上传附件</h4>
                </div>
                <div class="modal-body">
                    <div class="attach-drop-panel">
                        <div class="upload-container" id="filePicker"><i class="fa fa-upload" aria-hidden="true"></i></div>
                    </div>
                    <div class="attach-list" id="attachList">
                        <template v-for="item in lists">
                            <div class="attach-item" :id="item.attachment_id">
                                <template v-if="item.state == 'wait'">
                                    <div class="progress">
                                        <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
                                            <span class="sr-only">0% Complete (success)</span>
                                        </div>
                                    </div>
                                </template>
                                <template v-else-if="item.state == 'error'">
                                    <span class="error-message">${item.message}</span>
                                    <button type="button" class="btn btn-sm close" @click="removeAttach(item.attachment_id)">
                                        <i class="fa fa-remove" aria-hidden="true"></i>
                                    </button>
                                </template>
                                <template v-else>
                                    <a :href="item.http_path" target="_blank" :title="item.file_name">${item.file_name}</a>
                                    <span class="text">(${ formatBytes(item.file_size) })</span>
                                    <span class="error-message">${item.message}</span>
                                    <button type="button" class="btn btn-sm close" @click="removeAttach(item.attachment_id)">
                                        <i class="fa fa-remove" aria-hidden="true"></i>
                                    </button>
                                    <div class="clearfix"></div>
                                </template>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="modal-footer">
                    <span id="add-error-message" class="error-message"></span>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" id="btnUploadAttachFile" data-dismiss="modal">确定</button>
                </div>
            </div>
        </form>
    </div>
</div>
<!-- 显示文档历史 -->
<div class="modal fade" id="documentHistoryModal" tabindex="-1" role="dialog" aria-labelledby="documentHistoryModalModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">文档历史记录</h4>
            </div>
            <div class="modal-body text-center" id="historyList">

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            </div>
        </div>
    </div>
</div>
<!--- 选择模板--->
<div class="modal fade" id="documentTemplateModal" tabindex="-1" role="dialog" aria-labelledby="请选择模板类型" aria-hidden="true">
    <div class="modal-dialog" style="width: 780px;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="modal-title">请选择模板类型</h4>
            </div>
            <div class="modal-body template-list">
                <div class="container">
                    <div class="section">
                        <a data-type="normal" href="javascript:;"><i class="fa fa-file-o"></i></a>
                        <h3><a data-type="normal" href="javascript:;">普通文档</a></h3>
                        <ul>
                            <li>默认类型</li>
                            <li>简单的文本文档</li>
                        </ul>
                    </div>
                    <div class="section">
                        <a data-type="api" href="javascript:;"><i class="fa fa-file-code-o"></i></a>
                        <h3><a data-type="api" href="javascript:;">API文档</a></h3>
                        <ul>
                            <li>用于API文档速写</li>
                            <li>支持代码高亮</li>
                        </ul>
                    </div>
                    <div class="section">
                        <a data-type="code" href="javascript:;"><i class="fa fa-book"></i></a>

                        <h3><a data-type="code" href="javascript:;">数据字典</a></h3>
                        <ul>
                            <li>用于数据字典显示</li>
                            <li>表格支持</li>
                        </ul>
                    </div>
                    <div class="section">
                        <a data-type="customs" href="javascript:;"><i class="fa fa-briefcase"></i></a>

                        <h3><a data-type="customs" href="javascript:;">自定义模板</a></h3>
                        <ul>
                            <li>自定义模板</li>
                            <li>支持任意类型文档</li>
                            <li>可以设置为全局模板</li>
                        </ul>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            </div>
        </div>
    </div>
</div>
<!--- 显示自定义模板--->
<div class="modal fade" id="displayCustomsTemplateModal" tabindex="-1" role="dialog" aria-labelledby="displayCustomsTemplateModalLabel">
    <div class="modal-dialog" role="document" style="width: 750px;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">自定义模板</h4>
            </div>
            <div class="modal-body text-center" id="displayCustomsTemplateList">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <td>#</td>
                            <td class="col-sm-3">模板名称</td>
                            <td class="col-sm-2">模板类型</td>
                            <td class="col-sm-2">创建人</td>
                            <td class="col-sm-3">创建时间</td>
                            <td class="col-sm-2">操作</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td colspan="7" class="text-center">暂无数据</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            </div>
        </div>
    </div>
</div>
<!--- 创建模板--->
<div class="modal fade" id="saveTemplateModal" tabindex="-1" role="dialog" aria-labelledby="saveTemplateModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form method="post" action="{{urlfor "TemplateController.Add"}}" id="saveTemplateForm" class="form-horizontal">
                <input type="hidden" name="identify" value="{{.Model.Identify}}">
                <input type="hidden" name="content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">保存为模板</h4>
                </div>
                <div class="modal-body text-center">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">模板名称 <span class="error-message">*</span></label>
                        <div class="col-sm-10">
                            <input type="text" name="template_name" id="templateName" placeholder="模板名称" class="form-control"  maxlength="50">
                        </div>
                    </div>
                    {{if eq .Member.Role 0 1}}
                        <div class="form-group">
                            <div class="col-lg-6">
                                <label>
                                    <input type="radio" name="is_global" value="1"> 全局<span class="text">(任何项目都可用)</span>
                                </label>
                            </div>
                            <div class="col-lg-6">
                                <label>
                                    <input type="radio" name="is_global" value="0" checked> 项目<span class="text">(只有当前项目可用)</span>
                                </label>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    {{end}}
                </div>
                <div class="modal-footer">
                    <span class="error-message show-error-message"></span>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="submit" class="btn btn-primary" id="btnSaveTemplate" data-loading-text="保存中...">立即保存</button>
                </div>
            </form>
        </div>
    </div>
</div>
<!--- json转换为表格 -->
<div class="modal fade" id="convertJsonToTableModal" tabindex="-1" role="dialog" aria-labelledby="convertJsonToTableModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form method="post" id="convertJsonToTableForm" class="form-horizontal">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Json转换为表格</h4>
                </div>
                <div class="modal-body text-center">
                    <textarea type="text" name="jsonContent" id="jsonContent" placeholder="Json" class="form-control" style="height: 300px;resize: none"></textarea>

                </div>
                <div class="modal-footer">
                    <span id="json-error-message"></span>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" id="btnInsertTable" data-loading-text="保存中...">插入</button>
                </div>
            </form>
        </div>
    </div>
</div>

<template id="template-normal">
    {{template "document/template_normal.tpl"}}
</template>
<template id="template-api">
    {{template "document/template_api.tpl"}}
</template>
<template id="template-code">
    {{template "document/template_code.tpl"}}
</template>

<script src="{{cdnjs "/static/js/editor.toolbar.js" "version"}}" type="text/javascript"></script>