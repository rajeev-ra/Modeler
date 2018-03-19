define('THREE', ['js/lib/three.min'], function ( THREE ) { window.THREE = THREE; return THREE; });

requirejs.config({
    baseUrl: '.',
    paths: { "player" : "js/player/player",
            "Model" : "js/model/Model",
            "Control": "js/player/control",
            "Point": "js/model/point",
            "Config": "js/config"}
});

require(["THREE", "player", "Model", "Point", "Config"], function(THREE, player, Model, Point, Config){
    window.Config = Config;
    window.Config.point.material = new THREE.MeshLambertMaterial({color: 0x7777ff});
    _Player = player;
    _Player.init(document.body);

    m = new Model();
    m.geometry.vertices.push(new Point(-1,-1,0));
    m.geometry.vertices.push(new Point(0,2,0));
    m.geometry.vertices.push(new Point(1,-1,0));

    m.geometry.faces.push( new THREE.Face3( 0, 2, 1 ) );
    m.geometry.computeFaceNormals();
});