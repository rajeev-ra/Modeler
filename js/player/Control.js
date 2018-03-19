define(function (require) {
    function Control(scene, camera) {
        var THREE = require('THREE');
        var PI_2 = Math.PI / 2;
        var TO_DEG = Math.PI / 180.0; 
        var mouse_l_down = false, mouse_w_down = false, mouse_r_down = false;
        var but_up = false, but_down = false, but_left = false, but_right = false;
        var centre = new THREE.Vector3(0,0,0);
        var dist = 5;
        var x = 0, y = 0, xz, z = 1;
        var rot_y = 0, rot_w = 0; 
        
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

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
            for(var i = scene.children.length - 1; i > 0; i--){
                if(scene.children[i].isModel){
                    bBox.expandByObject(scene.children[i]);
                }
            }
            return bBox;
        }

        function UpdateCenter(){
            var m = new THREE.Vector3(), cam_vec = new THREE.Vector3(), n = new THREE.Vector3();
            if(but_up && !but_down){            
                cam_vec.subVectors(camera.position, centre);
                m.crossVectors(cam_vec, camera.up);
                n.crossVectors(m, cam_vec);
                n.normalize();
                n.multiplyScalar(0.1);
                centre.add(n);
            }
            if(but_down && !but_up){
                cam_vec.subVectors(camera.position, centre);
                m.crossVectors(cam_vec, camera.up);
                n.crossVectors(cam_vec, m);
                n.normalize();
                n.multiplyScalar(0.1);
                centre.add(n);            
            }
            if(but_left && !but_right){         
                cam_vec.subVectors(camera.position, centre);
                m.crossVectors(cam_vec, camera.up);
                m.normalize();
                m.multiplyScalar(0.1);
                centre.add(m);            
            }
            if(!but_left && but_right){       
                cam_vec.subVectors(camera.position, centre);
                m.crossVectors(camera.up, cam_vec);
                m.normalize();
                m.multiplyScalar(0.1);
                centre.add(m);            
            }
            if(but_up || but_down || but_left || but_right){
                updateCamPos();
            }
        }

        function updateCamPos() {
            camera.position.set(dist * x, dist * y, dist * z);
            camera.position.add(centre);
            camera.lookAt(centre);
        }

        function onKeyDown(e) {
            switch ( e.keyCode ) {
                case 38: // up
                    but_up = true;
                    break;

                case 37: // left
                    but_left = true;
                    break;

                case 40: // down
                    but_down = true;
                    break;

                case 39: // right
                    but_right = true;
                    break;
            }
        }

        function onKeyUp(e) {
            switch ( e.keyCode ) {
                case 38: // up
                    but_up = false;
                    break;

                case 37: // left
                    but_left = false;
                    break;

                case 40: // down
                    but_down = false;
                    break;

                case 39: // right
                    but_right = false;
                    break;
            }
        }

        function onMouseDown(e) {
            if(0 === e.button){
                mouse_l_down = true;
            }
            else if(1 === e.button){
                mouse_w_down = true;
            }
            else if(2 === e.button){
                mouse_r_down = true;
            }
        }

        function onMouseUp(e) {
            if(0 === e.button){
                mouse_l_down = false;
            }
            else if(1 === e.button){
                mouse_w_down = false;
            }
            else if(2 === e.button){
                mouse_r_down = false;
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
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            if(mouse_l_down){
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
            else if(mouse_w_down){
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
        }

        document.addEventListener('keydown', onKeyDown, false );
        document.addEventListener('keyup', onKeyUp, false );
        document.addEventListener('mousedown', onMouseDown, false );
        document.addEventListener('mouseup', onMouseUp, false );
        document.addEventListener('mousemove', onMouseMove, false );
        document.addEventListener('mousewheel', onMouseWheel, false );
    }

    return Control;
});
