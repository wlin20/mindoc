$(function () {

    window.editorTool = {
        editorTypes : {
            markdown_vditor:"markdown.vditor",
            markdown_default: "markdown",
            html_default:"html"
        },
        wrapEditor: function (editor,initConfig,editorType,setValue,getMarkdown,getHTML){
            editor.type = editorType
            editor.initConig = initConfig
            editor.setValue = setValue
            editor.getMarkdown = getMarkdown             
            editor.getHTML = getHTML
            window.editor = editor
        },
        documentHistory: function () {
            layer.open({
                type: 2,
                title: '历史版本',
                shadeClose: true,
                shade: 0.8,
                area: ['700px', '80%'],
                content: window.historyURL + "?identify=" + window.book.identify + "&doc_id=" + window.selectNode.id,
                end: function () {
                    // if (window.SelectedId) {
                    //     var selected = {
                    //         node: {
                    //             id: window.SelectedId
                    //         }
                    //     };
                    //     window.loadDocument(selected);
                    //     window.SelectedId = null;
                    // }
                }
            });
        },
        /**
         * 保存文档到服务器
         * @param $is_cover 是否强制覆盖
         */
        saveDocument: function ($is_cover, callback) {
            var index = null;
            var node = window.selectNode;
            var content = window.editor.getMarkdown();
            var html = window.editor.getHTML();
            var version = "";

            if (!node) {
                layer.msg("获取当前文档信息失败");
                return;
            }
            if (node.a_attr && node.a_attr.disabled) {
                layer.msg("空节点不能添加内容");
                return;
            }

            var doc_id = parseInt(node.id);

            for (var i in window.documentCategory) {
                var item = window.documentCategory[i];

                if (item.id === doc_id) {
                    version = item.version;
                    break;
                }
            }
            $.ajax({
                beforeSend: function () {
                    index = layer.load(1, { shade: [0.1, '#fff'] });
                    window.saveing = true;
                },
                url: window.editURL,
                data: { "identify": window.book.identify, "doc_id": doc_id, "markdown": content, "html": html, "cover": $is_cover ? "yes" : "no", "version": version },
                type: "post",
                timeout : 30000,
                dataType: "json",
                success: function (res) {
                    if (res.errcode === 0 || res.errcode === 1) {
                        window.editorTool.resetEditorChanged(false);
                        for (var i in window.documentCategory) {
                            var item = window.documentCategory[i];

                            if (item.id === doc_id) {
                                window.documentCategory[i].version = res.data.version;
                                break;
                            }
                        }
                        $.each(window.documentCategory,function (i, item) {
                            var $item = window.documentCategory[i];

                            if (item.id === doc_id) {
                                window.documentCategory[i].version = res.data.version;
                            }
                        });

                        if(res.errcode === 1){
                            layer.msg(res.message);
                        }

                        if (typeof callback === "function") {
                            callback();
                        }

                    } else if(res.errcode === 6005) {
                        var confirmIndex = layer.confirm('文档已被其他人修改确定覆盖已存在的文档吗？', {
                            btn: ['确定', '取消'] // 按钮
                        }, function() {
                            layer.close(confirmIndex);
                            saveDocument(true, callback);
                        });
                    } else {
                        layer.msg(res.message);
                    }
                },
                error : function (XMLHttpRequest, textStatus, errorThrown) {
                    layer.msg("服务器错误：" +  errorThrown);
                },
                complete :function () {
                    layer.close(index);
                    window.saveing = false;
                }
            });
        },
        /** 发布项目
         * 会一次性发布项目内所有文件
         * */
        releaseBook : function(){
            if (Object.prototype.toString.call(window.documentCategory) === '[object Array]' && window.documentCategory.length > 0) {
                if ($("#markdown-save").hasClass('change')) {
                    var confirm_result = confirm("编辑内容未保存，需要保存吗？");
                    if (confirm_result) {
                        this.saveDocument(false, this.releaseBook);
                        return;
                    }
                }
                $.ajax({
                    url: window.releaseURL,
                    data: {"identify": window.book.identify},
                    type: "post",
                    dataType: "json",
                    success: function (res) {
                        if (res.errcode === 0) {
                            layer.msg("发布任务已推送到任务队列，稍后将在后台执行。");
                        } else {
                            layer.msg(res.message);
                        }
                    }
                });
            } else {
                layer.msg("没有需要发布的文档")
            }
        },
        changeEditor : function(){
            if ($("#markdown-save").hasClass('change')) {
                var confirm_result = confirm("编辑内容未保存，需要保存吗？");
                if (confirm_result) {
                    this.saveDocument(false,this.changeEditor);
                }
                return
            }

            let types = Object.values(window.editorTool.editorTypes)
            let next = (types.indexOf(window.editor.type)+1) % types.length;
            console.info("next:"+next)
            window.location.href = replaceParamVal(window,"editor",types[next],true);
        },
        /**
         * 设置编辑器变更状态
         * @param $is_change
         */
        resetEditorChanged :function ($is_change) {
            if ($is_change && !window.isLoad) {
                $("#markdown-save").removeClass('disabled').addClass('change');
            } else {
                $("#markdown-save").removeClass('change').addClass('disabled');
            }
            window.isLoad = false;
        },
    }

    //替换指定传入参数的值
    //win为某窗体,paramName为参数,paramValue为新值,forceAdding为不存在该参数时是否也指定
    function replaceParamVal(win,paramName,paramValue,forceAdding){
        let search = win.location.search+'';
        if(!search) {//没有任何查询参数,则直接附加
            return ( forceAdding ? (win.location+'?'+paramName+'='+paramValue) : (win.location+'') );
        }else{
            let url = (win.location+'').split('?')[0];
            let paramStrs = search.replace('?','').split('&');
            let hasIn = false;
            for(let i=0; i<paramStrs.length; i++) {
                let paramStr = paramStrs[i];
                if(paramStr.split('=')[0].toLowerCase() == paramName.toLowerCase()) {//指定参数
                    url = url + (i==0 ? '?' : '&');
                    hasIn = true;

                    if(paramStr.indexOf('=') == -1) {//形式:"参数"
                        url = url + paramStr + '=' + paramValue;
                    }
                    else if (! paramStr.split('=')[1].length) {    //形式："参数="
                        url = url + paramStr + paramValue;
                    }
                    else {//形式:"参数=值"
                        url = url + paramName + '=' + paramValue;
                    }
                }else {//其它参数
                    url = url + (i==0 ? '?' : '&');
                    url = url + paramStr;
                }
            }

            if (!hasIn && forceAdding) {//不存在,但必须要添加时
                url = url + '&' + paramName + '=' + paramValue;
            }

            return url;
        }

    }

    /**
     * 实现工具栏操作
     */
    $("#editormd-tools").on("click", "a[class!='disabled']", function () {
       var name = $(this).find("i").attr("name");
       if (name === "attachment") {
           $("#uploadAttachModal").modal("show");
       } else if (name === "history") {
           window.editorTool.documentHistory()
       } else if (name === "save") {
           window.editorTool.saveDocument(false)
       } else if (name === "template") {
           $("#documentTemplateModal").modal("show");
       } else if(name === "save-template"){
           $("#saveTemplateModal").modal("show");
       } else if(name === 'json'){
           $("#convertJsonToTableModal").modal("show");
       }  else if (name === "release") {
           window.editorTool.releaseBook()
       }  else if (name === "changeEditor") {
           window.editorTool.changeEditor()
       } else if (name === "sidebar") {
           $("#manualCategory").toggle(0, "swing", function () {
               let $then = $("#manualEditorContainer");
               let left = parseInt($then.css("left"));
               if (left > 0) {
                   window.editorContainerLeft = left;
                   $then.css("left", "0");
               } else {
                   $then.css("left", window.editorContainerLeft + "px");
               }
               if(window.editor.type != window.editorTool.editorTypes.markdown_vditor) {
                   window.editor.resize();
               }
           });
       } else if (name === "tasks") {
           if(window.editor.type == window.editor.types.markdown_default) {
               // 插入 GFM 任务列表
               var cm = window.editor.cm;
               var selection = cm.getSelection();
               var cursor = cm.getCursor();
               if (selection === "") {
                   cm.setCursor(cursor.line, 0);
                   cm.replaceSelection("- [x] " + selection);
                   cm.setCursor(cursor.line, cursor.ch + 6);
               } else {
                   var selectionText = selection.split("\n");

                   for (var i = 0, len = selectionText.length; i < len; i++) {
                       selectionText[i] = (selectionText[i] === "") ? "" : "- [x] " + selectionText[i];
                   }
                   cm.replaceSelection(selectionText.join("\n"));
               }
           }
       } else {
           if(window.editor.type == window.editorTool.editorTypes.markdown_default) {
               let action = window.editor.toolbarHandlers[name];

               if (action !== "undefined") {
                   $.proxy(action, window.editor)();
                   window.editor.focus();
               }
           }
       }
   }) ;





    /**
     * 当离开窗口时存在未保存的文档会提示保存
     */
    $(window).on("beforeunload", function () {
        if ($("#markdown-save").hasClass("change")) {
            return '您输入的内容尚未保存，确定离开此页面吗？';
        }
    });

    // ############################ 文档模板功能 ######################//
    /**
     * 打开文档模板
     */
    $("#documentTemplateModal").on("click", ".section>a[data-type]", function () {
        var $this = $(this).attr("data-type");
        if($this === "customs"){
            $("#displayCustomsTemplateModal").modal("show");
            return;
        }
        var body = $("#template-" + $this).html();
        if (body) {
            window.isLoad = true;
            window.editor.insertValue(body,true);
            window.editorTool.resetEditorChanged(true);
        }
        $("#documentTemplateModal").modal('hide');
    });
    /**
     * 展示自定义模板列表
     */
    $("#displayCustomsTemplateModal").on("show.bs.modal",function () {
        window.sessionStorage.setItem("displayCustomsTemplateList",$("#displayCustomsTemplateList").html());

        var index ;
        $.ajax({
            beforeSend: function () {
                index = layer.load(1, { shade: [0.1, '#fff'] });
            },
           url : window.template.listUrl,
           data: {"identify":window.book.identify},
           type: "POST",
           dataType: "html",
            success: function ($res) {
                $("#displayCustomsTemplateList").html($res);
            },
            error : function () {
                layer.msg("加载失败请重试");
            },
            complete : function () {
                layer.close(index);
            }
        });
        $("#documentTemplateModal").modal("hide");
    }).on("hidden.bs.modal",function () {
        var cache = window.sessionStorage.getItem("displayCustomsTemplateList");
        $("#displayCustomsTemplateList").html(cache);
    });
    /**
     * 添加模板
     */
    $("#saveTemplateForm").ajaxForm({
        beforeSubmit: function () {
            var doc_name = $.trim($("#templateName").val());
            if (doc_name === "") {
                return showError("模板名称不能为空", "#saveTemplateForm .show-error-message");
            }
            var content = $("#saveTemplateForm").find("input[name='content']").val();
            if (content === ""){
                return showError("模板内容不能为空", "#saveTemplateForm .show-error-message");
            }

            $("#btnSaveTemplate").button("loading");

            return true;
        },
        success: function ($res) {
            if($res.errcode === 0){
                $("#saveTemplateModal").modal("hide");
                layer.msg("保存成功");
            }else{
                return showError($res.message, "#saveTemplateForm .show-error-message");
            }
        },
        complete : function () {
            $("#btnSaveTemplate").button("reset");
        }
    });
    /**
     * 当添加模板弹窗事件发生
     */
    $("#saveTemplateModal").on("show.bs.modal",function () {
        window.sessionStorage.setItem("saveTemplateModal",$(this).find(".modal-body").html());
        var content = window.editor.getValue();
        $("#saveTemplateForm").find("input[name='content']").val(content);
        $("#saveTemplateForm .show-error-message").html("");
    }).on("hidden.bs.modal",function () {
        $(this).find(".modal-body").html(window.sessionStorage.getItem("saveTemplateModal"));
    });


    /**
     * 插入自定义模板内容
     */
    $("#displayCustomsTemplateList").on("click",".btn-insert",function () {
        var templateId = $(this).attr("data-id");

        $.ajax({
            url: window.template.getUrl,
            data :{"identify": window.book.identify, "template_id": templateId},
            dataType: "json",
            type: "get",
            success : function ($res) {
               if ($res.errcode !== 0){
                   layer.msg($res.message);
                   return;
               }
                window.isLoad = true;
                window.editor.insertValue($res.data.template_content,true);
                window.editorTool.resetEditorChanged(true);
                $("#displayCustomsTemplateModal").modal("hide");
            },error : function () {
                layer.msg("服务器异常");
            }
        });
    }).on("click",".btn-delete",function () {
        var $then = $(this);
        var templateId = $then.attr("data-id");
        $then.button("loading");

        $.ajax({
            url : window.template.deleteUrl,
            data: {"identify": window.book.identify, "template_id": templateId},
            dataType: "json",
            type: "post",
            success: function ($res) {
                if($res.errcode !== 0){
                    layer.msg($res.message);
                }else{
                    $then.parents("tr").empty().remove();
                }
            },error : function () {
                layer.msg("服务器异常");
            },
            complete: function () {
                $then.button("reset");
            }
        })
    });

    $("#btnInsertTable").on("click",function () {
       var content = $("#jsonContent").val();
       if(content !== "") {
           try {
               var jsonObj = $.parseJSON(content);
               var data = foreachJson(jsonObj,"");
               var table = "| 参数名称  | 参数类型  | 示例值  |  备注 |\n| ------------ | ------------ | ------------ | ------------ |\n";
               $.each(data,function (i,item) {
                    table += "|" + item.key + "|" + item.type + "|" + item.value +"| |\n";
               });
                insertToMarkdown(table);
           }catch (e) {
               showError("Json 格式错误:" + e.toString(),"#json-error-message");
               return;
           }
       }
       $("#convertJsonToTableModal").modal("hide");
    });
    $("#convertJsonToTableModal").on("hidden.bs.modal",function () {
        $("#jsonContent").val("");
    }).on("shown.bs.modal",function () {
        $("#jsonContent").focus();
    });

    function insertToMarkdown(body) {
        window.isLoad = true;
        if(window.editor.type == "vditor"){
            var strongs = document.getElementsByTagName("strong");
            var s = window.getSelection();

            if(s.rangeCount > 0) s.removeAllRanges();

            for(var i = 0; i < strongs.length; i++) {
                var range = document.createRange();
                range.selectNode(strongs[i]);
                s.addRange(range);
            }
        }
        window.editor.insertValue(body,true);
        window.editorTool.resetEditorChanged(true);
    }

    // ############################ 文档模板功能 end ######################//


    // ########################  附件相关实现 ######################//

    $("#attachInfo").on("click",function () {
        $("#uploadAttachModal").modal("show");
    });

    window.uploader = null;

    // 附件上传实现
    $("#uploadAttachModal").on("shown.bs.modal",function () {
        if(window.uploader === null){
            try {
                window.uploader = WebUploader.create({
                    auto: true,
                    dnd : true,
                    swf: window.data.baseUrl+'/static/webuploader/Uploader.swf',
                    server: window.data.uploadServer,
                    formData : { "identify" : window.data.book["identify"] ,"doc_id" :  window.selectNode.id },
                    pick: "#filePicker",
                    fileVal : "editormd-file-file",
                    compress : false,
                    fileSingleSizeLimit: window.data.uploadFileSize
                }).on("beforeFileQueued",function (file) {
                    // uploader.reset();
                    this.options.formData.doc_id = window.selectNode.id;
                }).on( 'fileQueued', function( file ) {
                    var item = {
                        state : "wait",
                        attachment_id : file.id,
                        file_size : file.size,
                        file_name : file.name,
                        message : "正在上传"
                    };
                    window.attachVueApp.lists.push(item);

                }).on("uploadError",function (file,reason) {
                    for(var i in window.attachVueApp.lists){
                        var item = window.attachVueApp.lists[i];
                        if(item.attachment_id == file.id){
                            item.state = "error";
                            item.message = "上传失败:" + reason;
                            break;
                        }
                    }

                }).on("uploadSuccess",function (file, res) {
                    for(var index in window.attachVueApp.lists){
                        var item = window.attachVueApp.lists[index];
                        if(item.attachment_id === file.id){
                            if(res.errcode === 0) {
                                window.attachVueApp.lists.splice(index, 1, res.attach ? res.attach : res.data);
                            }else{
                                item.message = res.message;
                                item.state = "error";
                            }
                        }
                    }
                }).on("uploadProgress",function (file, percentage) {
                    var $li = $( '#'+file.id ),
                        $percent = $li.find('.progress .progress-bar');

                    $percent.css( 'width', percentage * 100 + '%' );
                }).on("error", function (type) {
                    if(type === "F_EXCEED_SIZE"){
                        layer.msg("文件超过了限定大小");
                    }
                    console.log(type);
                });
            }catch(e){
                console.log(e);
            }
        }
    });

    /**
     * 将数据重置到Vue列表中
     * @param $lists
     */
    function pushVueLists($lists) {
        window.attachVueApp.lists = []

        $.each($lists, function (i, item) {
            window.attachVueApp.lists.push(item);
        });
    }


    window.attachVueApp = new Vue({
        el: "#attachList",
        data: {
            lists: window.data.attachList
        },
        delimiters: ['${', '}'],
        methods: {
            removeAttach: function ($attach_id) {
                var $this = this;
                var item = $this.lists.filter(function ($item) {
                    return $item.attachment_id == $attach_id;
                });

                if (item && item[0].hasOwnProperty("state")) {
                    $this.lists = $this.lists.filter(function ($item) {
                        return $item.attachment_id != $attach_id;
                    });
                    return;
                }
                $.ajax({
                    url: window.removeAttachURL,
                    type: "post",
                    data: {"attach_id": $attach_id},
                    success: function (res) {
                        if (res.errcode === 0) {
                            $this.lists = $this.lists.filter(function ($item) {
                                return $item.attachment_id != $attach_id;
                            });
                        } else {
                            layer.msg(res.message);
                        }
                    }
                });
            }
        },
        watch: {
            lists: function ($lists) {
                $("#attachInfo").text(" " + $lists.length + " 个附件")
            }
        }
    });

    // ########################  附件相关实现 end ######################//

    /**
     * 启动自动保存，默认30s自动保存一次
     */
    if (window.book && window.book.auto_save) {
        setTimeout(function () {
            setInterval(function () {
                var $then = $("#markdown-save");
                if (!window.saveing && $then.hasClass("change")) {
                    $then.trigger("click");
                }
            }, 30000);
        }, 30000);
    }



    //实现小提示
    $("[data-toggle='tooltip']").hover(function () {
        var title = $(this).attr('data-title');
        var direction = $(this).attr("data-direction");
        var tips = 3;
        if (direction === "top") {
            tips = 1;
        } else if (direction === "right") {
            tips = 2;
        } else if (direction === "bottom") {
            tips = 3;
        } else if (direction === "left") {
            tips = 4;
        }
        index = layer.tips(title, this, {
            tips: tips
        });
    }, function () {
        layer.close(index);
    });


    function uploadImage($id, $callback) {
        /** 粘贴上传图片 **/
        document.getElementById($id).addEventListener('paste', function (e) {
            if (e.clipboardData && e.clipboardData.items) {
                var clipboard = e.clipboardData;
                for (var i = 0, len = clipboard.items.length; i < len; i++) {
                    if (clipboard.items[i].kind === 'file' || clipboard.items[i].type.indexOf('image') > -1) {

                        var imageFile = clipboard.items[i].getAsFile();

                        var fileName = String((new Date()).valueOf());

                        switch (imageFile.type) {
                            case "image/png" :
                                fileName += ".png";
                                break;
                            case "image/jpg" :
                                fileName += ".jpg";
                                break;
                            case "image/jpeg" :
                                fileName += ".jpeg";
                                break;
                            case "image/gif" :
                                fileName += ".gif";
                                break;
                            default :
                                layer.msg("不支持的图片格式");
                                return;
                        }
                        var form = new FormData();

                        form.append('editormd-image-file', imageFile, fileName);

                        var layerIndex = 0;

                        $.ajax({
                            url: window.imageUploadURL,
                            type: "POST",
                            dataType: "json",
                            data: form,
                            processData: false,
                            contentType: false,
                            beforeSend: function () {
                                layerIndex = $callback('before');
                            },
                            error: function () {
                                layer.close(layerIndex);
                                $callback('error');
                                layer.msg("图片上传失败");
                            },
                            success: function (data) {
                                layer.close(layerIndex);
                                $callback('success', data);
                                if (data.errcode !== 0) {
                                    layer.msg(data.message);
                                }

                            }
                        });
                        e.preventDefault();
                    }
                }
            }
        });
    }

    /**
     * 初始化代码高亮
     */
    function initHighlighting() {
        $('pre code,pre.ql-syntax').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    }






});