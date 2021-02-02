
$(function () {

    window.editorType = "markdown.vditor"
    //挂载到全局
    window.editor = new Vditor("vditor", {
        // 这个是自定义导航栏
        // toolbar:["emoji", "headings", "bold", "italic", "strike", "link", "|",
        //     "list", "ordered-list", "check", "|",
        //     "quote", "line", "code", "inline-code", "|",
        //     "upload", "record", "table", "|",
        //     "export", "fullscreen", "preview"],

        // 工具栏配置是否隐藏和固定
        toolbarConfig: {
            // 是否固定工具栏
            pin: false,
        },

        // 全屏选项
        fullscreen: {
            index: 9999,
        },

        // 展示模式
        mode: "wysiwyg",
        theme: "dark",
        //编辑器高度
        // height: window.innerHeight,
        // height: screen.height,
        height: "auto",

        //是否展示大纲,手机端自动隐藏就行了
        outline: {
            enable: true
        },

        //打印调试信息
        debugger: false,

        //是否启动打字机模式
        typewriterMode: false,

        //默认提示文本
        placeholder: "欢迎使用文档系统",

        // 是否启用字数统计
        counter: {
            enable: true,
            type: "text",
        },

        tab: "\t",
        // 文件上传配置
        upload: {
            accept: "image/*,.mp3, .wav, .rar, .zip",
            // token: "test",
            url: window.imageUploadURL,
            // 上传文件名
            fieldName:"editormd-image-file",
            linkToImgUrl: "/",
            filename(name) {
                return name
                    .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, "")
                    .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, "")
                    .replace("/\\s/g", "");
            },
            // 转换影响结果为插件规定的格式
            format(files, responseText) {
                debugger
                var response = JSON.parse(responseText)
                var errcode = response.errcode;
                var succMap = {};
                var errFiles = [];

                if (errcode == 0){
                    succMap[response.attach.file_name] = response.attach.http_path;
                }else{
                    errFiles.push(files[0].name)
                }

                var result = {
                    "msg": response.message,
                    "code": errcode,
                    "data": {
                        "errFiles": errFiles,
                        "succMap": succMap
                    }
                }
                return JSON.stringify(result)
            }
        },
        // 获得焦点方法
        focus(md) {
            document.onkeydown = function (event) {
                // 判断 Ctrl+S
                if (event.ctrlKey == true && event.keyCode == 83) {
                    // alert('触发ctrl+s');
                    event.preventDefault();
                }
            }
        },
        // 失去焦点方法
        blur(value){
            console.info(window.editor.getCursorPosition());
            // console.info("blur:"+value);
        },
        // 输入时回调方法
        input(value, previewElement){
            // console.info(value)
            // console.info(previewElement)
            window.isLoad = false
            window.toobarFunction.resetEditorChanged(true)
        },
        // 异步渲染后回调方法
        after(){
            console.info("vditor::after")
            window.editor.setValue('text')
            openLastSelectedNode()
        }
    });



});