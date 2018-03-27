define(function (require) {
    function Control(scene, camera, domElement) {
        var THREE = require('THREE');
        var Notify = require("Notify");
        var raycaster = new THREE.Raycaster();
        var selection = [];
        var movePlane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10 ), new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity:0.3} ) );

        var kb = {
            x: false, y: false, z: false, ctrl: false, alt: false, shift: false,
            up: false, down: false, left: false, right: false
        };

        var mouse = {
            position: new THREE.Vector2(),
            left: false,
            wheel: false,
            right: false
        };

        var PI_2 = Math.PI / 2;
        var TO_DEG = Math.PI / 180.0; 
        var centre = new THREE.Vector3(0,0,0);
        var dist = 5;
        var x = 0, y = 0, xz, z = 1;
        var rot_y = 0, rot_w = 0;
        this.scene = scene;
        
        this.Reset = function(){
            camera.up = new THREE.Vector3(0,1,0);
            centre = new THREE.Vector3(0,0,0);
            dist = 5;
            rot_y = 30;
            rot_w = 20;
            calcXYZ();
            updateCamPos();
        };

        this.Reset();
        
        this.Fit = function(){
            console.log(GetBBox());
        };

        this.Update = function(){
            UpdateCenter();
        };

        function GetBBox(){
            var bBox = new THREE.Box3();
            for(var i = _this.scene.children.length - 1; i > 0; i--){
                if(_this.scene.children[i].isModel){
                    bBox.expandByObject(_this.scene.children[i]);
                }
            }
            return bBox;
        }

        function UpdateCenter(){
            var m = new THREE.Vector3(), cam_vec = new THREE.Vector3(), n = new THREE.Vector3();
            if(kb.up && !kb.down){            
                cam_vec.subVectors(camera.position, centre);
                m.crossVectors(cam_vec, camera.up);
                n.crossVectors(m, cam_vec);
                n.normalize();
                n.multiplyScalar(0.1);
                centre.add(n);
            }
            if(kb.down && !kb.up){
                cam_vec.subVectors(camera.position, centre);
                m.crossVectors(cam_vec, camera.up);
                n.crossVectors(cam_vec, m);
                n.normalize();
                n.multiplyScalar(0.1);
                centre.add(n);            
            }
            if(kb.left && !kb.right){         
                cam_vec.subVectors(camera.position, centre);
                m.crossVectors(cam_vec, camera.up);
                m.normalize();
                m.multiplyScalar(0.1);
                centre.add(m);            
            }
            if(!kb.left && kb.right){       
                cam_vec.subVectors(camera.position, centre);
                m.crossVectors(camera.up, cam_vec);
                m.normalize();
                m.multiplyScalar(0.1);
                centre.add(m);            
            }
            if(kb.up || kb.down || kb.left || kb.right){
                updateCamPos();
            }
        }

        function updateCamPos() {
            camera.position.set(dist * x, dist * y, dist * z);
            camera.position.add(centre);
            camera.lookAt(centre);
            /*
            var vec = new THREE.Vector3( -0.1, -0.1, 4.5 );
            vec.applyQuaternion( camera.quaternion );
            cube.position.copy( vec );
            */
        }

        function setKeyState(keyCode, state){
            switch ( keyCode ) {
                case 16: // shift
                    kb.shift = state;
                    break;
                case 17: // ctrl
                    kb.ctrl = state;
                    break;
                case 18: // alt
                    kb.alt = state;
                    break;
                case 37: // left
                    kb.left = state;
                    break;
                case 38: // up
                    kb.up = state;
                    break;
                case 39: // right
                    kb.right = state;
                    break;
                case 40: // down
                    kb.down = state;
                    break;
                case 88: // x
                    kb.x = state;
                    break;
                case 89: // y
                    kb.y = state;
                    break;
                case 90: // z
                    kb.z = state;
                    break;
            }
        }

        function onKeyDown(e) {
            setKeyState(e.keyCode, true);
        }

        function onKeyUp(e) {
            setKeyState(e.keyCode, false);
        }

        function setMouseState(btn, state){
            if(0 === btn){
                mouse.left = state;
            }
            else if(1 === btn){
                mouse.wheel = state;
            }
            else if(2 === btn){
                mouse.right = state;
            }
        }

        function onMouseDown(event) {
            event.preventDefault();
            if(0 === event.button){
                mouse.left = true;
                var intersects = raycaster.intersectObjects( _this.scene.children );
                if(intersects.length){
                    var dist = Number.MAX_VALUE;
                    var sel = null;
                    for(var i = 0; i < intersects.length; i++){
                        if(intersects[i].object.hasOwnProperty("pointParent") && dist > intersects[i].distance){
                            dist = intersects[i].distance;
                            selection.length = 0;
                            selection.push(intersects[i].object);
                        }
                    }
                }
                if(0 < selection.length){
                    Notify.Event(Notify.CommonEvents.ItemSelected, selection);
                    movePlane.position.set( selection[0].pointParent.x, selection[0].pointParent.y, selection[0].pointParent.z );
                    movePlane.lookAt(camera.position);
                    scene.add(movePlane);
                }
            }
            else if(1 === event.button){
                mouse.wheel = true;
            }
            else if(2 === event.button){
                mouse.right = true;
            }
        }

        function onMouseUp(event) {
            event.preventDefault();
            if(0 === event.button){
                mouse.left = false;
                selection.length = 0;
                scene.remove(movePlane);
            }
            else if(1 === event.button){
                mouse.wheel = false;
            }
            else if(2 === event.button){
                mouse.right = false;
            }
        }

        function onMouseWheel(e){
            var delta = e.wheelDelta || -e.detail;
            dist = Math.max(1, dist + (dist * delta / 2000.0));
            updateCamPos();
        }

        function calcXYZ(){
            y = Math.sin(rot_w * TO_DEG);
            xz = Math.abs(Math.cos(rot_w * TO_DEG));
            x = Math.sin(rot_y * TO_DEG) * xz;
            z = Math.cos(rot_y * TO_DEG) * xz;
        }

        function onMouseMove(event) {
            mouse.position.x = ( event.clientX / domElement.width ) * 2 - 1;
            mouse.position.y = - ( event.clientY / domElement.height ) * 2 + 1;
            raycaster.setFromCamera( mouse.position, camera );
            if(mouse.right){
                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
                rot_y += movementX * -0.5;
                rot_y += 360.0;
                rot_y %= 360.0;
                if(movementY > 0){
                    rot_w = Math.min(90, rot_w + movementY * 0.5);
                }
                else{
                    rot_w = Math.max(-90, rot_w + movementY * 0.5);
                }

                calcXYZ();
                updateCamPos();
            }
            else if(mouse.wheel){
                var m = new THREE.Vector3(), cam_vec = new THREE.Vector3(), n = new THREE.Vector3();
                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
                cam_vec.subVectors(camera.position, centre);
                m.crossVectors(cam_vec, camera.up);
                n.crossVectors(m, cam_vec);
                m.normalize();
                n.normalize();
                m.multiplyScalar(movementX * 0.005);
                n.multiplyScalar(movementY * 0.005);
                centre.add(m);
                centre.add(n);
                updateCamPos();
            }
            else if(mouse.left && 0 < selection.length){
                movePlane.position.set( selection[0].pointParent.x, selection[0].pointParent.y, selection[0].pointParent.z );
                movePlane.lookAt(camera.position);
                var intersects = raycaster.intersectObjects( [movePlane] );
                if(0 < intersects.length){
                    selection[0].pointParent.X = intersects[0].point.x;
                    selection[0].pointParent.Y = intersects[0].point.y;
                    selection[0].pointParent.Z = intersects[0].point.z;
                    //console.log(intersects[0]);
                }
            }
        }

        var _this = this;
        domElement.addEventListener('keydown', onKeyDown, false );
        domElement.addEventListener('keyup', onKeyUp, false );
        domElement.addEventListener('mousedown', onMouseDown, false );
        domElement.addEventListener('mouseup', onMouseUp, false );
        domElement.addEventListener('mousemove', onMouseMove, false );
        domElement.addEventListener('mousewheel', onMouseWheel, false );
        domElement.addEventListener('contextmenu', function(evt) { evt.preventDefault(); }, false);
    }

    return Control;
});
