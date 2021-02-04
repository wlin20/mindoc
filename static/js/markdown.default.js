$(function () {
    editormd.katexURL = {
        js  : window.katex.js,
        css : window.katex.css
    };

    let initConfig = {
        width: "100%",
        height: "100%",
        path: window.editormdLib,
        toolbar: true,
        placeholder: "本编辑器支持 Markdown 编辑，左边编写，右边预览。",
        imageUpload: true,
        imageFormats: ["jpg", "jpeg", "gif", "png","svg", "JPG", "JPEG", "GIF", "PNG","SVG"],
        imageUploadURL: window.imageUploadURL,
        toolbarModes: "full",
        fileUpload: true,
        fileUploadURL: window.fileUploadURL,
        taskList: true,
        flowChart: true,
        htmlDecode: "style,script,iframe,title,onmouseover,onmouseout,style",
        lineNumbers: false,
        sequenceDiagram: true,
        tocStartLevel: 1,
        tocm: true,
        previewCodeHighlight: 1,
        highlightStyle: window.highlightStyle ? window.highlightStyle : "github",
        tex:true,
        saveHTMLToTextarea: true,

        onload: function() {
            this.hideToolbar();
            var keyMap = {
                "Ctrl-S": function(cm) {
                    saveDocument(false);
                },
                "Cmd-S": function(cm){
                    saveDocument(false);
                },
                "Ctrl-A": function(cm) {
                    cm.execCommand("selectAll");
                }
            };
            this.addKeyMap(keyMap);

            //如果没有选中节点则选中默认节点
            openLastSelectedNode();
            window.editorTool.uploadImage("docEditor", function ($state, $res) {
                if ($state === "before") {
                    return layer.load(1, {
                        shade: [0.1, '#fff'] // 0.1 透明度的白色背景
                    });
                } else if ($state === "success") {
                    if ($res.errcode === 0) {
                        var value = '![](' + $res.url + ')';
                        window.editor.insertValue(value);
                    }
                }
            });
            window.isLoad = true;
        },
        onchange: function () {
            window.editorTool.resetEditorChanged(true);
        }
    }
    let editor = editormd("docEditor", initConfig);
    window.editorTool.wrapEditor(editor,initConfig,"markdown.default",
        function (str){
            editor.clear()
            editor.insertValue(str);
            editor.setCursor({line: 0, ch: 0});
        },
        editor.insertValue,
        editor.getMarkdown,
        editor.getHTML)

});