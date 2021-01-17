// To Finalize
// <a-entity id="hexbox" hexbox></a-entity>

// To Test
// <a-entity scale="0.01 0.01 0.01" gltf-model="#shock-absorber">
//    <a-box scale="300 300 300"material="transparent: true; color: red; opacity: 0.5"></a-box>
// </a-entity>


let sensorRight = 500;
let sensorLeft = 500;
let sensorTop = 500;
let sensorBottom = 500;
let sensorFront = 500;
let sensorBack = 500;

let buttonRight = 0;
let buttonLeft = 0;
let buttonTop = 0;
let buttonBottom = 0;
let buttonFront = 0;
let buttonBack = 0


const ROOT_OFFSET_X = 0;
const ROOT_OFFSET_Y = 0;
const ROOT_OFFSET_Z = 0;

const MIN_SENSOR_VALUE = 50;
const MAX_SENSOR_VALUE =470;

const TOP_PLANE_COLOR = '#D81B60';
const LEFT_PLANE_COLOR = '#8E24AA';
const RIGHT_PLANE_COLOR = '#1E88E5';
const FRONT_PLANE_COLOR = '#43A047';
const BACK_PLANE_COLOR = '#FFB300';

const socket = io();
window.onload = function () {


    socket.on('hello', function (data) {
        console.log("hello, Nizar!")
    })

    // Establish socket connection

    setInterval(function () {
        socket.emit('getTouch', "lol")
    }, 100)


}

socket.on('touch', function (data) {

    sensorRight = data.right;
    sensorLeft = data.left;
    sensorTop = data.top;
    sensorBottom = data.bottom;
    sensorFront = data.front;
    sensorBack = data.back;

    buttonRight = data.righttouch;
    buttonLeft = data.lefttouch;
    buttonTop = data.toptouch;
    buttonBottom = data.bottomtouch;
    buttonFront = data.fronttouch;
    buttonBack = data.backtouch;

    // console.log (buttonBottom);

})


let architectureConceptModel = {
    src: './assets/models/architecture-concept.glb',
    width: 1.5,
    height: 2,
    depth: 2,
    minScale: 0.01,
    maxScale: 0.03
}

let architectureSketchModel = {
    src: './assets/models/architecture-sketch.glb',
    width: 1.5,
    height: 2,
    depth: 2,
    minScale: 0.0001,
    maxScale: 0.0001
}

let shockAbsorberModel = {
    src: './assets/models/shock-absorber.glb',
    width: 100,
    height: 300,
    depth: 160,
    minScale: 0.01,
    maxScale: 0.03
}

let skullModelModel = {
    src: './assets/models/skull.glb',
    width: 1.5,
    height: 2,
    depth: 2,
    minScale: 0.5,
    maxScale: 0.2
}

let woodenCrateModel = {
    src: './assets/models/wooden-crate.glb',
    width: 3,
    height: 3,
    depth: 3,
    minScale: 0.5,
    maxScale: 2
}

let models = []
// models.push(architectureConceptModel);
// models.push(architectureSketchModel);
models.push(shockAbsorberModel);
models.push(skullModelModel);
models.push(woodenCrateModel);


// console.log (sensorRight);

AFRAME.registerComponent('sender', {
    init: function () {

        const receiver = document.getElementById('hexbox');

        setInterval(() => {
            // let sensorRight = 500;
            // let sensorLeft = 500;
            // let sensorTop = 500;
            // let sensorBottom = 500;
            // let sensorFront = 500;
            // let sensorBack = 500;

            // let buttonRight = 0;
            // let buttonLeft = 0;
            // let buttonTop = 0;
            // let buttonBottom = 0;
            // let buttonFront = 0;
            // let buttonBack = 0

            receiver.emit('touch', {
                sensorRight: sensorRight,
                sensorLeft: sensorLeft,
                sensorTop: sensorTop,
                sensorBottom: sensorBottom,
                sensorFront: sensorFront,
                sensorBack: sensorBack,
                buttonRight: buttonRight,
                buttonLeft: buttonLeft,
                buttonTop: buttonTop,
                buttonBottom: buttonBottom,
                buttonFront: buttonFront,
                buttonBack: buttonBack
            })
        }, 30)
    }
});

AFRAME.registerComponent('hexbox', {
    init: function () {
        const el = this.el;

        // Load ThreeJS model loader
        const modelLoader = new THREE.GLTFLoader();

        // set-up renderer
        renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true, alpha: true, preserveDrawingBuffer: true});


        // Enable clipping planes in the renderer
        el.sceneEl.renderer.localClippingEnabled = true;

        // Offset root element from constants
        el.setAttribute('position', `${ROOT_OFFSET_X} ${ROOT_OFFSET_Y} ${ROOT_OFFSET_Z}`)

        let hexboxParentEl;
        let chosenModel = 0;
        let numberOfModelsLoaded = 0;

        loadModels()

        // Load all glb models from source and the received asset to each model as property
        function loadModels() {
            for (i = 0; i < models.length; i ++) {
                model = models[i]
                modelLoader.load(model.src, function (modelAsset) {
                    let asset = modelAsset.scene || modelAsset.scenes[0];
                    asset.animations = modelAsset.animations;
                    onModelLoaded(asset)
                });
            }
        }

        // Add asset to each model then initialize experience
        function onModelLoaded(asset) {
            models[numberOfModelsLoaded].asset = asset
            numberOfModelsLoaded++;
            if (numberOfModelsLoaded == models.length) {
                initHexboxParent()
            }
        }

        function initHexboxParent() {
            hexboxParentEl = document.createElement('a-entity');
            el.appendChild(hexboxParentEl);
        }

        const previousButton = document.getElementById('previous-button');
        previousButton.addEventListener('click', () => {
            changeToPreviousModel()
        })

        const nextButton = document.getElementById('next-button');
        nextButton.addEventListener('click', () => {
            changeToNextModel()
        })

        function changeToPreviousModel() {
            if (chosenModel > 0) {
                chosenModel -= 1;
            } else {
                chosenModel = models.length - 1;
            } changeHexboxModel()
        }

        function changeToNextModel() {
            if (chosenModel < models.length - 1) {
                chosenModel += 1;
            } else {
                chosenModel = 0;
            } changeHexboxModel()
        }

        function changeHexboxModel() {
            hexboxParentEl.setAttribute('hexbox-parent', {chosenModel: chosenModel});
        }

        values = {};

        // Start listening to sensors values from touch event
        el.addEventListener('touch', (e) => { // Ensure all elements are loaded before updating values
            if (hexboxParentEl != null) {
                values.sensorRight = e.detail.sensorRight;
                values.sensorLeft = e.detail.sensorLeft;
                values.sensorTop = e.detail.sensorTop;
                values.sensorBottom = e.detail.sensorBottom;
                values.sensorFront = e.detail.sensorFront;
                values.sensorBack = e.detail.sensorBack;
                values.buttonRight = e.detail.buttonRight;
                values.buttonLeft = e.detail.buttonLeft;
                values.buttonTop = e.detail.buttonTop;
                values.buttonBottom = e.detail.buttonBottom;
                values.buttonFront = e.detail.buttonFront;
                values.buttonBack = e.detail.buttonBack;

                updateValues()
            }
        })

        function updateValues() {
            hexboxParentEl.setAttribute('hexbox-parent', {
                chosenModel: chosenModel,

                sensorRight: values.sensorRight,
                sensorLeft: values.sensorLeft,
                sensorTop: values.sensorTop,
                sensorBottom: values.sensorBottom,
                sensorFront: values.sensorFront,
                sensorBack: values.sensorBack,

                buttonRight: values.buttonRight,
                buttonLeft: values.buttonLeft,
                buttonTop: values.buttonTop,
                buttonBottom: values.buttonBottom,
                buttonFront: values.buttonFront,
                buttonBack: values.buttonBack
            })
        }
    }
})


AFRAME.registerComponent('hexbox-parent', {
    schema: {
        chosenModel: {
            type: 'int'
        },

        sensorRight: {
            type: 'number'
        },
        sensorLeft: {
            type: 'number'
        },
        sensorTop: {
            type: 'number'
        },
        sensorBottom: {
            type: 'number'
        },
        sensorFront: {
            type: 'number'
        },
        sensorBack: {
            type: 'number'
        },

        buttonRight: {
            type: 'int'
        },
        buttonLeft: {
            type: 'int'
        },
        buttonTop: {
            type: 'int'
        },
        buttonBottom: {
            type: 'int'
        },
        buttonFront: {
            type: 'int'
        },
        buttonBack: {
            type: 'int'
        }
    },
    init: function () { // console.log('a')
        const el = this.el;
        const data = this.data;

        data.previousChosenModel = data.chosenModel;

        let hexboxModelEl;
        let hexboxIndicatorEl;

        let model = models[data.chosenModel];

        initHexboxModel();
        initHexboxIndicator();

        function initHexboxModel() {
            hexboxModelEl = document.createElement('a-entity');
            hexboxModelEl.setAttribute('id', 'hexbox-model');
            hexboxModelEl.setObject3D('mesh', model.asset);
            el.appendChild(hexboxModelEl);
        }

        function initHexboxIndicator() {
            hexboxIndicatorEl = document.createElement('a-entity');
            hexboxIndicatorEl.setAttribute('id', 'hexbox-indicator');
            hexboxIndicatorEl.setAttribute('hexbox-idicator', {chosenModel: data.chosenModel})
            el.appendChild(hexboxIndicatorEl);
        }
    },
    update: function () {
        const el = this.el;
        const data = this.data;
        const sensorRange = MAX_SENSOR_VALUE - MIN_SENSOR_VALUE;

        const model = models[data.chosenModel];

        if (data.chosenModel != data.previousChosenModel) {
            data.previousChosenModel = data.chosenModel;
            changeModel()
        }

        function changeModel() {
            const hexboxModelEl = document.getElementById('hexbox-model');
            hexboxModelEl.setObject3D('mesh', model.asset);
        }

        scaleAndMove()

        function scaleAndMove() {
            let nomarlizedScale = normalize(data.sensorTop);
            scale = model.minScale + ((model.maxScale - model.minScale) * nomarlizedScale);
            y = model.height / 2 * scale;
            el.setAttribute('scale', `${scale} ${scale} ${scale}`);
            el.setAttribute('position', `0 ${y} 0`);
        }

        function normalize(number) {
            return Math.abs(((number - MIN_SENSOR_VALUE) / sensorRange) - 1);
        }

        function calculateXAxisValue(number) {
            return model.width / 2 - model.width * number;
        }

        function calculateYAxisValue(number) {
            return model.height / 2 - model.height * number;
        }

        function calculateZAxisValue(number) {
            return model.depth / 2 - model.depth * number;
        }

        const hexboxModelEl = document.getElementById('hexbox-model');

        hexboxModelEl.setAttribute('hexbox-model', {
            leftClip: calculateXAxisValue(normalize(data.sensorLeft)),
            rightClip: calculateXAxisValue(normalize(data.sensorRight)),
            frontClip: calculateZAxisValue(normalize(data.sensorFront)),
            backClip: calculateZAxisValue(normalize(data.sensorBack)),
            topClip: calculateYAxisValue(normalize(data.sensorBottom))
        })

        const hexboxIndicatorEl = document.getElementById('hexbox-indicator');

        hexboxIndicatorEl.setAttribute('hexbox-indicator', {
            chosenModel: data.chosenModel,

            leftClip: calculateXAxisValue(normalize(data.sensorLeft)),
            rightClip: calculateXAxisValue(normalize(data.sensorRight)),
            frontClip: calculateZAxisValue(normalize(data.sensorFront)),
            backClip: calculateZAxisValue(normalize(data.sensorBack)),
            topClip: calculateYAxisValue(normalize(data.sensorBottom)),

            topActivated: data.buttonTop,
            leftActivated: data.buttonLeft,
            rightActivated: data.buttonRight,
            frontActivated: data.buttonFront,
            backActivated: data.buttonBack
        })
    }
})


AFRAME.registerComponent('hexbox-model', {
    schema: {
        leftClip: {
            type: 'number'
        },
        rightClip: {
            type: 'number'
        },
        frontClip: {
            type: 'number'
        },
        backClip: {
            type: 'number'
        },
        topClip: {
            type: 'number'
        }
    },
    init: function () {
        this.el.addEventListener('model-loaded', this.update.bind(this));
    },
    update: function () {
        const el = this.el;
        const data = this.data;

        var mesh = el.getObject3D('mesh');
        if (! mesh) {
            return;
        }

        mesh.traverse(function (node) {
            const matrixWorld = mesh.matrixWorld;
            if (node.isMesh) {
                node.onBeforeRender = function () {
                    const material = node.material;

                    var topClippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), data.topClip);
                    topClippingPlane.applyMatrix4(matrixWorld);

                    var rightClippingPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), data.rightClip);
                    rightClippingPlane.applyMatrix4(matrixWorld);

                    var leftClippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), data.leftClip);
                    leftClippingPlane.applyMatrix4(matrixWorld);

                    var frontClippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), data.frontClip);
                    frontClippingPlane.applyMatrix4(matrixWorld);

                    var backClippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), data.backClip);
                    backClippingPlane.applyMatrix4(matrixWorld);

                    material.clippingPlanes = [
                        topClippingPlane,
                        rightClippingPlane,
                        leftClippingPlane,
                        frontClippingPlane,
                        backClippingPlane
                    ]
                }
            }
        });
    }
})


AFRAME.registerComponent('hexbox-indicator', {
    schema: {
        chosenModel: {
            type: 'int'
        },

        leftClip: {
            type: 'number'
        },
        rightClip: {
            type: 'number'
        },
        frontClip: {
            type: 'number'
        },
        backClip: {
            type: 'number'
        },
        topClip: {
            type: 'number'
        },

        topActivated: {
            type: 'int'
        },
        leftActivated: {
            type: 'int'
        },
        rightActivated: {
            type: 'int'
        },
        frontActivated: {
            type: 'int'
        },
        backActivated: {
            type: 'int'
        }
    },
    init: function () {
        const el = this.el;
        const data = this.data;

        const box = document.createElement('a-entity');

        const topPlane = document.createElement('a-plane');
        topPlane.setAttribute('color', TOP_PLANE_COLOR);
        topPlane.setAttribute('rotation', '-90 0 0');
        topPlane.setAttribute('position', '0 0.5 0');
        topPlane.setAttribute('transparent', true);
        topPlane.setAttribute('material', 'opacity', 0.5);
        topPlane.setAttribute('material', 'side', 'double');
        box.appendChild(topPlane);

        const leftPlane = document.createElement('a-plane');
        leftPlane.setAttribute('color', LEFT_PLANE_COLOR);
        leftPlane.setAttribute('rotation', '0 -90 0');
        leftPlane.setAttribute('position', '-0.5 0 0');
        leftPlane.setAttribute('transparent', true);
        leftPlane.setAttribute('material', 'opacity', 0.5);
        leftPlane.setAttribute('material', 'side', 'double');
        box.appendChild(leftPlane);

        const rightPlane = document.createElement('a-plane');
        rightPlane.setAttribute('color', RIGHT_PLANE_COLOR);
        rightPlane.setAttribute('rotation', '0 90 0');
        rightPlane.setAttribute('position', '0.5 0 0');
        rightPlane.setAttribute('transparent', true);
        rightPlane.setAttribute('material', 'opacity', 0.5);
        rightPlane.setAttribute('material', 'side', 'double');
        box.appendChild(rightPlane);

        const frontPlane = document.createElement('a-plane');
        frontPlane.setAttribute('color', FRONT_PLANE_COLOR);
        frontPlane.setAttribute('rotation', '0 0 0');
        frontPlane.setAttribute('position', '0 0 0.5');
        frontPlane.setAttribute('transparent', true);
        frontPlane.setAttribute('material', 'opacity', 0.5);
        frontPlane.setAttribute('material', 'side', 'double');
        box.appendChild(frontPlane);

        const backPlane = document.createElement('a-plane');
        backPlane.setAttribute('color', BACK_PLANE_COLOR);
        backPlane.setAttribute('rotation', '0 180 0');
        backPlane.setAttribute('position', '0 0 -0.5');
        backPlane.setAttribute('transparent', true);
        backPlane.setAttribute('material', 'opacity', 0.5);
        backPlane.setAttribute('material', 'side', 'double');
        box.appendChild(backPlane);

        el.appendChild(box);

        data.box = box;
        data.topPlane = topPlane;
        data.leftPlane = leftPlane;
        data.rightPlane = rightPlane;
        data.frontPlane = frontPlane;
        data.backPlane = backPlane;

        this.el.addEventListener('model-loaded', this.update.bind(this));
    },
    update: function () {
        const el = this.el;
        const data = this.data;

        const model = models[data.chosenModel];

        const topPlane = data.topPlane;
        topPlane.setAttribute('scale', `${
            model.width
        } ${
            model.depth
        } 1`);
        topPlane.setAttribute('position', `0 ${
            data.topClip
        } 0`);

        const leftPlane = data.leftPlane;
        leftPlane.setAttribute('scale', `${
            model.depth
        } ${
            model.height
        } 1`);
        leftPlane.setAttribute(
            'position',
            `${ - data.leftClip
            } 0 0`
        );

        const rightPlane = data.rightPlane;
        rightPlane.setAttribute('scale', `${
            model.depth
        } ${
            model.height
        } 1`);
        rightPlane.setAttribute('position', `${
            data.rightClip
        } 0 0`);

        const frontPlane = data.frontPlane;
        frontPlane.setAttribute('scale', `${
            model.width
        } ${
            model.height
        } 1`);
        frontPlane.setAttribute('position', `0 0 ${
            data.frontClip
        }`);

        const backPlane = data.backPlane;
        backPlane.setAttribute('scale', `${
            model.width
        } ${
            model.height
        } 1`);
        backPlane.setAttribute('position', `0 0 -${
            data.backClip
        }`);

        if (data.topActivated == 1) {
            topPlane.setAttribute('visible', true);
        } else {
            topPlane.setAttribute('visible', false);
        }

        if (data.leftActivated == 1) {
            leftPlane.setAttribute('visible', true);
        } else {
            leftPlane.setAttribute('visible', false);
        }

        if (data.rightActivated == 1) {
            rightPlane.setAttribute('visible', true);
        } else {
            rightPlane.setAttribute('visible', false);
        }

        if (data.frontActivated == 1) {
            frontPlane.setAttribute('visible', true);
        } else {
            frontPlane.setAttribute('visible', false);
        }

        if (data.backActivated == 1) {
            backPlane.setAttribute('visible', true);
        } else {
            backPlane.setAttribute('visible', false);
        }
    }
})
