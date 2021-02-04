/**
 * Created by
 */

/**
 * 打开最后选中的节点
 */
function openLastSelectedNode() {
    //如果文档树或编辑器没有准备好则不加载文档
    if (window.treeCatalog == null || window.editor == null) {
        return false;
    }
    var $isSelected = false;
    if (window.localStorage) {
        var $selectedNodeId = window.sessionStorage.getItem("MinDoc::LastLoadDocument:" + window.book.identify);
        try {
            if ($selectedNodeId) {
                //遍历文档树判断是否存在节点
                $.each(window.documentCategory, function (i, n) {
                    if (n.id == $selectedNodeId && !$isSelected) {
                        var $node = {"id": n.id};
                        window.treeCatalog.deselect_all();
                        window.treeCatalog.select_node($node);
                        $isSelected = true;
                    }
                });

            }
        } catch ($ex) {
            console.log($ex)
        }
    }

    //如果节点不存在，则默认选中第一个节点
    if (!$isSelected && window.documentCategory.length > 0) {
        var doc = window.documentCategory[0];

        if (doc && doc.id > 0) {
            var node = {"id": doc.id};
            $("#sidebar").jstree(true).select_node(node);
            $isSelected = true;
        }
    }
    return $isSelected;
}

/**
 * 设置最后选中的文档
 * @param $node
 */
function setLastSelectNode($node) {
    if (window.localStorage) {
        if (typeof $node === "undefined" || !$node) {
            window.sessionStorage.removeItem("MinDoc::LastLoadDocument:" + window.book.identify);
        } else {
            var nodeId = $node.id ? $node.id : $node.node.id;
            window.sessionStorage.setItem("MinDoc::LastLoadDocument:" + window.book.identify, nodeId);
        }
    }
}

/**
 * 保存排序
 * @param node
 * @param parent
 */
function jstree_save(node, parent) {

    var parentNode = window.treeCatalog.get_node(parent.parent);

    var nodeData = window.getSiblingSort(parentNode);

    if (parent.parent !== parent.old_parent) {
        parentNode = window.treeCatalog.get_node(parent.old_parent);
        var newNodeData = window.getSiblingSort(parentNode);
        if (newNodeData.length > 0) {
            nodeData = nodeData.concat(newNodeData);
        }
    }

    var index = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });

    $.ajax({
        url: window.sortURL,
        type: "post",
        data: JSON.stringify(nodeData),
        success: function (res) {
            layer.close(index);
            if (res.errcode === 0) {
                layer.msg("保存排序成功");
            } else {
                layer.msg(res.message);
            }
        }
    })
}

/**
 * 创建文档
 */
function openCreateCatalogDialog($node) {
    var $then = $("#addDocumentModal");

    var doc_id = $node ? $node.id : 0;

    $then.find("input[name='parent_id']").val(doc_id);
    $then.find("input[name='doc_id']").val('');
    $then.find("input[name='doc_name']").val('');

    $then.modal("show");
}

/**
 * 处理排序
 * @param node
 * @returns {Array}
 */
function getSiblingSort(node) {
    var data = [];

    for (var key in node.children) {
        var index = data.length;

        data[index] = {
            "id": parseInt(node.children[key]),
            "sort": parseInt(key),
            "parent": Number(node.id) ? Number(node.id) : 0
        };
    }
    return data;
}


/**
 * 删除一个文档
 * @param $node
 */
function openDeleteDocumentDialog($node) {
    var index = layer.confirm('你确定要删除该文档吗？', {
        btn: ['确定', '取消'] //按钮
    }, function () {

        $.post(window.deleteURL, {"identify": window.book.identify, "doc_id": $node.id}).done(function (res) {
            layer.close(index);
            if (res.errcode === 0) {
                window.treeCatalog.delete_node($node);
                window.documentCategory.remove(function (item) {
                    return item.id == $node.id;
                });


                // console.log(window.documentCategory)
                setLastSelectNode();
            } else {
                layer.msg("删除失败", {icon: 2})
            }
        }).fail(function () {
            layer.close(index);
            layer.msg("删除失败", {icon: 2})
        });

    });
}

/**
 * 打开文档编辑界面
 * @param $node
 */
function openEditCatalogDialog($node) {
    var $then = $("#addDocumentModal");
    var doc_id = parseInt($node ? $node.id : 0);
    var text = $node ? $node.text : '';
    var parentId = $node && $node.parent !== '#' ? $node.parent : 0;


    $then.find("input[name='doc_id']").val(doc_id);
    $then.find("input[name='parent_id']").val(parentId);
    $then.find("input[name='doc_name']").val(text);

    var open = $node.a_attr && $node.a_attr.opened ? $node.a_attr.opened  : 0;


    console.log($node)
    $then.find("input[name='is_open'][value='" + open + "']").prop("checked", "checked");

    for (var index in window.documentCategory) {
        var item = window.documentCategory[index];
        if (item.id === doc_id) {
            $then.find("input[name='doc_identify']").val(item.identify);
            break;
        }
    }

    $then.modal({show: true});
}

/**
 * 将一个节点推送到现有数组中
 * @param $node
 */
function pushDocumentCategory($node) {
    for (var index in window.documentCategory) {
        var item = window.documentCategory[index];
        if (item.id === $node.id) {
            window.documentCategory[index] = $node;
            return;
        }
    }
    window.documentCategory.push($node);
}



//弹出创建文档的遮罩层
$("#btnAddDocument").on("click", function () {
    $("#addDocumentModal").modal("show");
});
//用于还原创建文档的遮罩层
$("#addDocumentModal").on("hidden.bs.modal", function () {
    $(this).find("form").html(window.sessionStorage.getItem("MinDoc::addDocumentModal"));
    var $then = $("#addDocumentModal");

    $then.find("input[name='parent_id']").val('');
    $then.find("input[name='doc_id']").val('');
    $then.find("input[name='doc_name']").val('');
}).on("shown.bs.modal", function () {
    $(this).find("input[name='doc_name']").focus();
}).on("show.bs.modal", function () {
    window.sessionStorage.setItem("MinDoc::addDocumentModal", $(this).find("form").html())
});

function showError($msg, $id) {
    if (!$id) {
        $id = "#form-error-message"
    }
    $($id).addClass("error-message").removeClass("success-message").text($msg);
    return false;
}

function showSuccess($msg, $id) {
    if (!$id) {
        $id = "#form-error-message"
    }
    $($id).addClass("success-message").removeClass("error-message").text($msg);
    return true;
}




$(function (){


    /**
     * 添加文档
     */
    $("#addDocumentForm").ajaxForm({
        beforeSubmit: function () {
            var doc_name = $.trim($("#documentName").val());
            if (doc_name === "") {
                return showError("目录名称不能为空", "#add-error-message")
            }
            $("#btnSaveDocument").button("loading");
            return true;
        },
        success: function (res) {
            if (res.errcode === 0) {
                var data = {
                    "id": res.data.doc_id,
                    'parent': res.data.parent_id === 0 ? '#' : res.data.parent_id ,
                    "text": res.data.doc_name,
                    "identify": res.data.identify,
                    "version": res.data.version ,
                    state: { opened: res.data.is_open == 1},
                    a_attr: { is_open: res.data.is_open == 1}
                };

                var node = window.treeCatalog.get_node(data.id);
                if (node) {
                    window.treeCatalog.rename_node({ "id": data.id }, data.text);
                    $("#sidebar").jstree(true).get_node(data.id).a_attr.is_open = data.state.opened;
                } else {
                    window.treeCatalog.create_node(data.parent, data);
                    window.treeCatalog.deselect_all();
                    window.treeCatalog.select_node(data);
                }
                pushDocumentCategory(data);
                $("#markdown-save").removeClass('change').addClass('disabled');
                $("#addDocumentModal").modal('hide');
            } else {
                showError(res.message, "#add-error-message");
            }
            $("#btnSaveDocument").button("reset");
        }
    });

    /***
     * 加载指定的文档到编辑器中
     * @param $node
     */
    window.loadDocument = function($node) {
        var index = layer.load(1, {
            shade: [0.1, '#fff'] // 0.1 透明度的白色背景
        });

        $.get(window.editURL + $node.node.id ).done(function (res) {
            layer.close(index);

            if (res.errcode === 0) {
                window.isLoad = true;
                try {
                    window.editor.setValue(res.data.markdown,true);
                }catch(e){
                    console.log(e);
                }
                var node = {
                    "id": res.data.doc_id,
                    'parent': res.data.parent_id === 0 ? '#' : res.data.parent_id,
                    "text": res.data.doc_name, "identify": res.data.identify,
                    "version": res.data.version
                };
                pushDocumentCategory(node);
                window.selectNode = node;
                window.attachVueApp.lists = res.data.attach;
                // window.data.attachList = res.data.attach;
                // pushVueLists(res.data.attach);
                setLastSelectNode($node);
            } else {
                layer.msg("文档加载失败");
            }
        }).fail(function () {
            layer.close(index);
            layer.msg("文档加载失败");
        });
    };




    /**
     * 文档目录树
     */
    $("#sidebar").jstree({
        'plugins': ["wholerow", "types", 'dnd', 'contextmenu'],
        "types": {
            "default": {
                "icon": false  // 删除默认图标
            }
        },
        'core': {
            'check_callback': true,
            "multiple": false,
            'animation': 0,
            "data": window.documentCategory
        },
        "contextmenu": {
            show_at_node: false,
            select_node: false,
            "items": {
                "添加文档": {
                    "separator_before": false,
                    "separator_after": true,
                    "_disabled": false,
                    "label": "添加文档",
                    "icon": "fa fa-plus",
                    "action": function (data) {
                        var inst = $.jstree.reference(data.reference),
                            node = inst.get_node(data.reference);

                        openCreateCatalogDialog(node);
                    }
                },
                "编辑": {
                    "separator_before": false,
                    "separator_after": true,
                    "_disabled": false,
                    "label": "编辑",
                    "icon": "fa fa-edit",
                    "action": function (data) {
                        var inst = $.jstree.reference(data.reference);
                        var node = inst.get_node(data.reference);
                        openEditCatalogDialog(node);
                    }
                },
                "删除": {
                    "separator_before": false,
                    "separator_after": true,
                    "_disabled": false,
                    "label": "删除",
                    "icon": "fa fa-trash-o",
                    "action": function (data) {
                        var inst = $.jstree.reference(data.reference);
                        var node = inst.get_node(data.reference);
                        openDeleteDocumentDialog(node);
                    }
                }
            }
        }
    }).on("ready.jstree",function () {
        window.treeCatalog = $("#sidebar").jstree(true);
        //如果没有选中节点则选中默认节点
        openLastSelectedNode();
    }).on('select_node.jstree', function (node, selected) {

        if ($("#markdown-save").hasClass('change')) {
            if (confirm("编辑内容未保存，需要保存吗？")) {
                window.editorTool.saveDocument(false, function () {
                    loadDocument(selected);
                });
                return true;
            }
        }
        //如果是空目录则直接出发展开下一级功能
        if (selected.node.a_attr && selected.node.a_attr.disabled) {
            selected.instance.toggle_node(selected.node);
            return false
        }


        loadDocument(selected);
    }).on("move_node.jstree", jstree_save).on("delete_node.jstree",function($node,$parent) {
        openLastSelectedNode();
    });

})
