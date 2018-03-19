define(function(){
    return{
        init: function(playerParent){
            var _this = this;
            _this.parent = playerParent;
            _this.parent.onresize = function(){
                _this.resize();
            };
            require(["THREE", "Control"], function(THREE, Control){
                _this.scene = new THREE.Scene();
                _this.camera = new THREE.PerspectiveCamera( window.Config.camera.FOV, window.innerWidth / window.innerHeight, window.Config.camera.near, window.Config.camera.far );
                _this.renderer = new THREE.WebGLRenderer({clearColor: new THREE.Color(window.Config.player.bgColor), clearAlpha: 1});
                _this.renderer.setSize( window.innerWidth, window.innerHeight );
                _this.parent.appendChild( _this.renderer.domElement );
                _this.renderer.setClearColor(new THREE.Color(window.Config.player.bgColor), 1);

                var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
                light.position.set( 0.5, 1, 0.75 );
                _this.scene.add( light );

                _this.control = new Control(_this.scene, _this.camera);

                function animate() {
                    requestAnimationFrame( animate );
                    _this.renderer.render( _this.scene, _this.camera );
                    _this.control.Update();
                }
                animate();
            });
        },

        resize: function(){
            if(this.parent){
                this.camera.aspect = this.parent.clientWidth / this.parent.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize( this.parent.clientWidth, this.parent.clientHeight );
                this.Render();
            }
        },

        AddModel: function(model){
            this.scene.add(model);
            for(var i = 0; i < model.geometry.vertices.length; i++){
                this.scene.add(model.geometry.vertices[i].mesh);
            }
        },

        Render: function(){            
            this.renderer.render( this.scene, this.camera );
        },

        parent: null,
        scene: null,
        camera: null,
        renderer: null,
        control: null
    }
});