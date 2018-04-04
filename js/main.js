define('THREE', ['js/lib/three.min'], function ( THREE ) { window.THREE = THREE; return THREE; });

requirejs.config({
    baseUrl: '.',
    paths: { "Player" : "js/player/Player",
            "Model" : "js/model/Model",
            "Control": "js/player/Control",
            "Point": "js/model/Point",
            "Config": "js/config",
            "Notify": "js/player/Notify",
            "PlayerHelper": "js/player/PlayerHelper"
        }
});

require(["THREE", "Player", "Model", "Point", "Config", "Notify", "Control", "PlayerHelper"],
    function(THREE, player, Model, Point, Config, Notify, Control, PlayerHelper){            
        window.Config = Config;
        window.Config.point.material = new THREE.MeshLambertMaterial({color: 0x7777ff});
        _Player = player;
        _Player.init(document.body);

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        m = new Model(geometry);
        p = null;
        Notify.RegesterEvent(Notify.CommonEvents.PlayerReady, function(d){_Player.AddModel(m);});
        Notify.RegesterEvent(Notify.CommonEvents.ItemSelected, function(d){console.log(d[0]); });

        document.addEventListener('mousedown', function(event) {
            PlayerHelper.playerFocus = (event.target === _Player.renderer.domElement);
        }, false);

        document.addEventListener('keydown', function(event) {
            if(192 === event.keyCode && _Player && PlayerHelper.playerFocus){
                _Player.SetRenderMode();
            }
        }, false);
    }
);