//             别间隔时间(毫秒), 识别服务地址, 认证token
const webAR = new WebAR(1000, 'https://cn1-crs.easyar.com:8443/search', 'bifLhZONJQFU++soq25dVpz4W9BGMFYYVl1qw9zfcQ26hCGuS+pVta4n+IRcOKoxQyK82ojXUj3KZn/3HVvrMw==');
// Threejs简单使用类
const threeHelper = new ThreeHelper();
// 列出并打开设备上的摄像头
document.querySelector('#openCamera').addEventListener('click', function () {
    const videoSelect = document.querySelector('#videoDevice');
    webAR.listCamera(videoSelect)
        .then(msg => {
        // 隐藏"打开摄像头"按钮
        this.style.display = 'none';
        videoSelect.style.display = 'inline-block';
        document.querySelector('#start').style.display = 'inline-block';
        document.querySelector('#stop').style.display = 'inline-block';
        videoSelect.onchange = () => {
            webAR.openCamera(JSON.parse(videoSelect.value));
        };
        // 打开摄像头
        // 打开后置摄像头参数： {audio: false, video: {facingMode: {exact: 'environment'}}}
        webAR.openCamera(JSON.parse(videoSelect.value))
            .then(msg => {
            console.info(msg);
        }).catch(err => {
            console.info(err);
        });
    })
        .catch(err => {
        // 没有找到摄像头
        console.info(err);
    });
});
// 开启识别
document.querySelector('#start').addEventListener('click', () => {
    webAR.startRecognize((msg) => {
        console.info(msg);
        //先把之前展示视频或者图片删掉
        const deleteNode = document.querySelector('#displayed');
        if(deleteNode){
            document.body.removeChild(deleteNode);
        }
        // 可以将 setting 作为meta上传到EasyAR的云识别，使用方法如下
        // const setting = JSON.parse(window.atob(msg.target.meta));

        const picMeta = JSON.parse(window.atob(msg.target.meta));
        console.log(picMeta);
        switch (picMeta.type) {
            case "model":{
                const setting = {
                    model: picMeta.path,
                    scale: 0.02,
                    position: [0, 0, 0]
                };
                threeHelper.loadObject(setting);
                break;
            }
            case "video":{
                const video = document.createElement('video');
                video.setAttribute('controls', 'controls');
                video.setAttribute('playsinline', 'playsinline');
                video.setAttribute('style', 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:99');
                document.body.appendChild(video);
                video.src = picMeta.path;
                video.id = "displayed";
                video.play();
                break;
            }
            default:{
                break;
            }
        }
    });
}, false);
// 暂停识别
document.querySelector('#stop').addEventListener('click', () => {
    webAR.stopRecognize();
}, false);
//# sourceMappingURL=app.js.map