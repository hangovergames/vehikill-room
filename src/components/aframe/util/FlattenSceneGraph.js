// Copyright (c) 2019-2021 Hangover Games Ltd <info@hangover.games>. All rights reserved.
// Copyright (c) 2018-2019 Pixelface Oy

/* global THREE */

export const FlattenSceneGraph =
{
    // Removes all structure from a scene graph and simplifies things to 1 container with multiple objects
    // Generally used to simplify loaded gltfs. Breaks original object.
    // only use this with static objects!
    flatten: function(root)
    {
        var group = new THREE.Group();
        group.position.copy(root.position);
        group.quaternion.copy(root.quaternion);
        group.scale.copy(root.scale);

        var invMatrix = new THREE.Matrix4();
        invMatrix.getInverse(group.matrix);

        var transfers = [];
        var matrices = [];

        root.traverse(function (obj)
        {
            // either a group or a simple Object3D (also just a container)
            if (!obj.isGroup || obj.type === "Object3D") {
                var matrix = new THREE.Matrix4();
                matrix.multiplyMatrices(invMatrix, obj.matrixWorld);
                // need to store in an intermediate container before removing children, or traverse breaks
                transfers.push(obj);
                matrices.push(matrix);
            }
        });

        for (var i = 0, len = transfers.length; i < len; ++i) {
            var obj = transfers[i];
            group.add(obj);
            matrices[i].decompose(obj.position, obj.quaternion, obj.scale);
        }

        return group;
    }

};
