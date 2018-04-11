define(["THREE", "Notify", "PlayerHelper", "SelectionMgr", "UndoMgr"], function (THREE, Notify, PlayerHelper, SelectionMgr, UndoMgr) {
    function Control(scene, camera, domElement) {

        var raycaster = new THREE.Raycaster();
        
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
        var moveStart = new THREE.Vector3(0,0,0);
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
            if(!PlayerHelper.playerFocus){
                return;
            }

            setKeyState(e.keyCode, true);
            if(87 < e.keyCode && 91 > e.keyCode){
                if(kb.shift){
                    PlayerHelper.setAxisParallel(e.keyCode, camera.position);
                }
                else{
                    PlayerHelper.setPlaneNormal(e.keyCode);
                }
            }
        }

        function onKeyUp(e) {
            if(!PlayerHelper.playerFocus){
                return;
            }
            
            setKeyState(e.keyCode, false);
            if(17 == e.keyCode && false === mouse.left){
                SelectionMgr.clear();
            }
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
                camera.startDrag(mouse.position);
                mouse.left = true;
                var intersects = raycaster.intersectObjects( _this.scene.children );
                if(intersects.length){
                    var dist = Number.MAX_VALUE;
                    var sel = null;
                    for(var i = 0; i < intersects.length; i++){
                        if(intersects[i].object.hasOwnProperty("pointParent") && dist > intersects[i].distance){
                            dist = intersects[i].distance;
                            SelectionMgr.toggle(intersects[i].object.pointParent);
                        }
                    }
                }
                if(0 < SelectionMgr.count()){
                    var last = SelectionMgr.count() - 1;
                    Notify.Event(Notify.CommonEvents.ItemSelected, null);
                    var planeNor = new THREE.Vector3(x, y, z);
                    planeNor.add(SelectionMgr.at(last));
                    PlayerHelper.showPlane(scene, SelectionMgr.at(last), planeNor);
                    moveStart = SelectionMgr.at(last);
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
                if(!kb.ctrl){
                    SelectionMgr.clear();
                }
                camera.endDrag();
                PlayerHelper.hidePlane(scene);
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
                m.multiplyScalar(movementX * 0.001 * dist);
                n.multiplyScalar(movementY * 0.001 * dist);
                centre.add(m);
                centre.add(n);
                updateCamPos();
            }
            else if(mouse.left){
                camera.moveDrag(mouse.position);
                if (0 < SelectionMgr.count()){
                    var intersects = raycaster.intersectObjects( [PlayerHelper.movePlane] );
                    if(0 < intersects.length){
                        var vec = new THREE.Vector3(intersects[0].point.x - moveStart.x, intersects[0].point.y - moveStart.y, intersects[0].point.z - moveStart.z);
                        moveStart = intersects[0].point;
                        if(PlayerHelper.moveAlongPlane){                        
                            SelectionMgr.move(vec.x, vec.y, vec.z);
                        }
                        else{
                            switch(PlayerHelper.selectedAxis){
                                case 88: //x
                                    SelectionMgr.move(vec.x, 0, 0);
                                    break;
                                case 89: //y
                                    SelectionMgr.move(0, vec.y, 0);
                                    break;
                                case 90: //z
                                    SelectionMgr.move(0, 0, vec.z);
                                    break;
                            }
                        }
                    }
                }
            }
        }

        function SelectObjects(){

        }

        var _this = this;
        document.addEventListener('keydown', onKeyDown, false );
        document.addEventListener('keyup', onKeyUp, false );
        domElement.addEventListener('mousedown', onMouseDown, false );
        domElement.addEventListener('mouseup', onMouseUp, false );
        domElement.addEventListener('mousemove', onMouseMove, false );
        domElement.addEventListener('mousewheel', onMouseWheel, false );
        domElement.addEventListener('contextmenu', function(evt) { evt.preventDefault(); }, false);
    }

    return Control;
});
