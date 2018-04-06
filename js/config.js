define(["THREE"], function (THREE) {
    return {
        player:{
            bgColor: 0xcfd8dc
        },
        control:{

        },
        camera:{
            FOV: 35,
            near: 0.1,
            far: 10000
        },
        point:{
            material: new THREE.MeshLambertMaterial({color: 0x7777ff}),
            materialSelected: new THREE.MeshLambertMaterial({color: 0xff77dd}),
            geom: new THREE.SphereGeometry( 0.02, 15, 15 ),
            size: 0.1
        }
    };
});