var toDestroy = undefined;
//clock and timer for destruction delay for explosion
var collisionClock = new THREE.Clock();
var collisionTimer = 1;



function handleAsteroids() {

    for (var i = 0; i <= asteroids.length - 1; i++) {

        // Asteroidenkollision
        for (var j = i + 1; j <= asteroids.length - 1; j++) {
            if (collision.intersectSphereOther(asteroidHitBoxes[i],
                asteroidHitBoxes[j])) {
                //asteroidCollision(i, j);
                asteroids[i].collide(asteroids[j], "asteroid", i, j);
            }
        }
        // Kollision mit Player
        for (var j = 0; j <= playerHitBoxes.length - 1; j++) {
            if (collision.intersectSphereShipHitBox(asteroidHitBoxes[i],
                    playerHitBoxes[j])) {
                //destroyAsteroid(i);
                asteroids[i].collide(player, "player", i);
                // asteroidHitBySpaceship(i);
                // TODO: INCLUDE changeAsteroidDirection(i); 
                player.playerHitByAsteroid();
                break;
            }
        }

        /** NICHT LÖSCHEN **/
        // Kollision mit Gegner
        // for (var j = 0; j < enemies.length - 1; j++) {
        //     var enemyHitboxes = getEnemyHitboxes(enemies[j]);
        //     for (var k = 0; i <= enemyHitboxes.length - 1; k++) {
        //         if (collision.intersectSphereBox(asteroids[i], enemyHitboxes[k])) {
        //             asteroidHitBySpaceship(asteroids[i]);
        //             enemyHitbyAsteroid(enemies[j]);
        //         }
        //
        // }
    }

}


function handleProjectiles() {

    // for every projectile
    for (var i = 0; i <= projectiles.length - 1; i++) {

        var projectileSucceded = false;

        // Asteroidentreffer
        if (projectiles[i].name === "Laser") {

            for (var j = 0; j <= asteroidHitBoxes.length - 1; j++) {
                if (collision.intersectPointSphere(projectiles[i].getObjectByName("upperPoint"), asteroidHitBoxes[j]) ||
                        collision.intersectPointSphere(projectiles[i].getObjectByName("lowerPoint"), asteroidHitBoxes[j])) {
                    successLaser(i);
                    //hitAsteroid(j, "Laser");
                    asteroids[j].collide(projectiles[i], "laser", j);
                    projectileSucceded = true;
                    break;
                }
            }
        }


        else if (projectiles[i].name === "Rocket") {
            for (var j = 0; j <= asteroidHitBoxes.length - 1; j++) {
                if (collision.intersectPointSphere(projectiles[i].getObjectByName("upperPoint"), asteroidHitBoxes[j]) ||
                        collision.intersectPointSphere(projectiles[i].getObjectByName("lowerPoint"), asteroidHitBoxes[j])) {
                    successRocket(i);
                    //destruction implementet in handleCollision()
                    toDestroy = j;
                    collisionTimer = 0;
                    //hitAsteroid(j, "Rocket");
                    asteroids[j].collide(projectiles[i], "rocket", j);                    
                    projectileSucceded = true;
                    break;
                }
            }
        }


        else if (projectiles[i].name === "Explosion") {
            for (var j = 0; j <= asteroidHitBoxes.length - 1; j++) {
                if (collision.intersectSphereOther(asteroidHitBoxes[j],
                    projectiles[i])) {
                   //hitAsteroid(j, "Explosion");
                    asteroids[j].collide(projectiles[i], "explosion", j);
                }
            }
        }


        else if (projectiles[i].name === "MachineGun") {
            for (var j = 0; j <= asteroidHitBoxes.length - 1; j++) {
                if (collision.intersectSphereOther(asteroidHitBoxes[j],
                    projectiles[i])) {
                    successMachineGunBullet(i);
                    //hitAsteroid(j, "MachineGun");
                    asteroids[j].collide(projectiles[i], "machinegun", j);
                    projectileSucceded = true;
                    break;
                }
            }
        }


        // Collect items via projectiles
        if (projectileSucceded === false) {

            if (projectiles[i].name === "Laser") {
                for (var j = 0; j <= itemHitBoxes.length - 1; j++) {

                    // if (collision.intersectLineBox(projectiles[i].getObjectByName("lowerPoint"),
                    //         projectiles[i].getObjectByName("upperPoint"), itemHitBoxes[j])) {

                    if (collision.intersectPointBox(projectiles[i].getObjectByName("upperPoint"), itemHitBoxes[j]) ||
                           collision.intersectPointBox(projectiles[i].getObjectByName("lowerPoint"), itemHitBoxes[j]) ||
                           collision.intersectPointBox(projectiles[i].getObjectByName("midPoint"), itemHitBoxes[j])) {

                        successLaser(i);
                        collected(j);
                        break;
                    }
                }
            }


            else if (projectiles[i].name === "Rocket") {
                for (var j = 0; j <= itemHitBoxes.length - 1; j++) {
                    if (collision.intersectPointBox(projectiles[i].getObjectByName("upperPoint"), itemHitBoxes[j]) ||
                            collision.intersectPointBox(projectiles[i].getObjectByName("lowerPoint"), itemHitBoxes[j]) ||
                            collision.intersectPointBox(projectiles[i].getObjectByName("midPoint"), itemHitBoxes[j])) {
                        successRocket(i);
                        collected(j);
                        break;
                    }
                }
            }


            else if (projectiles[i].name === "Explosion") {
                for (var j = 0; j <= itemHitBoxes.length - 1; j++) {
                    if (collision.intersectSphereBox(itemHitBoxes[j],
                        projectiles[i])) {
                        collected(j);
                    }
                }
            }


            else if (projectiles[i].name === "MachineGun") {
                for (var j = 0; j <= itemHitBoxes.length - 1; j++) {
                    if (collision.intersectSphereBox(itemHitBoxes[j],
                        projectiles[i])) {
                        /** NICHT LÖSCHEN **/
                        // successMachineGunBullet(i);
                        collected(j);
                    }
                }
            }

        /** NICHT LÖSCHEN **/
        // Gegner wird getroffen
        // for (var j = 0; j < enemies.length - 1; j++) {

        //     var enemyHitboxes = getEnemyHitboxes(enemies[j]);
        //     for (var k = 0; i <= enemyHitboxes.length - 1; k++) {

        //         if (projectiles[i].name === "Laser") {
        //             if (intersectBoxCylinder(enemyHitboxes[k], projectiles[i])) {
        //                 successLaser(projectiles[i]);
        //                 enemyHitByLaser(enemies[j]);
        //             }
        //         }

        //         else if (projectiles[i].name === "EnemyLaser") {
        //             if (intersectBoxCylinder(enemyHitboxes[k], projectiles[i])) {
        //                 successLaser(projectiles[i]);
        //                 enemyHitByLaser(enemies[j]);
        //             }
        //         }

        //         else if (projectiles[i].name === "Rocket") {
        //             if (intersectBoxCylinder(enemyHitboxes[k], projectiles[i])) {
        //                 successRocket(projectiles[i]);
        //             }
        //         }

        //         else if (projectiles[i].name === "Explosion") {
        //             if (intersectSphereBox(projectiles[i], enemyHitboxes[k])) {
        //                 enemyHitByExplosion(enemyHitboxes[k]);

        //             }
        //         }

        //         else if (projectiles[i].name === "MachineGun") {
        //             if (intersectSphereBox(projectiles[i], enemyHitboxes[k])) {
        //                 successMachineGunBullet(projectiles[i]);
        //                 enemyHitByMachineGun(enemies[j]);
        //             }
        //         }
        //     }

        // }

        // Player wird getroffen
        // Player kann nicht von den eigenen Projektilen getroffen werden,
        // da diese schneller fliegen (sollen!!!) als der Player selbst
        // var playerHitboxes = getPlayerHitboxes();
        // for (var j = 0; j < getPlayerHitboxes.length - 1; j++) {

        //     if (projectiles[i].name === "Explosion") {
        //         if (intersectSphereOther(getAsteroidHitbox(asteroids[j]),
        //                 projectiles[i])) {
        //             playerHitByExplosion();

        //         }
        //     }

        //     else if (projectiles[i].name === "EnemyLaser") {
        //         if (intersectBoxCylinder(getPlayerHitboxes[j], projectiles[i])) {
        //             successLaser(projectiles[i]);
        //             playerHitByLaser();
        //         }
        //     }

        // }

        }
    }

}

/** NICHT LÖSCHEN **/
function handlePlayerEnemyCollision() {

    // var playerHitboxes = getPlayerHitboxes();
    // for (var i = 0; i <= playerHitboxes.length - 1; i++) {
    //     for (var j = 0; j <= enemies.length; j++) {
    //         var enemyHitboxes = getEnemyHitboxes(enemies[j]);
    //         for (var k = 0; i <= enemyHitboxes.length - 1; k++) {
    //             if (intersectBoxBox(playerHitboxes[i], enemyHitboxes[k])) {
    //                 playerEnemyCollision();
    //                 enemyPlayerCollision(enemies[j]);
    //             }
    //         }
    //     }
    // }

}

/** NICHT LÖSCHEN **/
function handleEnemyEnemyCollision() {

    // for (var i = 0; i <= enemies.length - 2; i++) {
    //     var enemyHitboxes1 = getEnemyHitboxes(enemies[i]); {
    //         for (var j = 0; j < enemyHitboxes1.length; j++) {
    //             for (var k = i+1; k <= enemies.length - 1; k++) {
    //                 var enemyHitboxes2 = getEnemyHitboxes(enemies[k]);
    //                 for (var l = 0; l < enemyHitboxes2.length; l++) {
    //                     if (intersectBoxBox(enemyHitboxes1[j], enemyHitboxes2[l])) {
    //                         enemyEnemyCollision(enemies[i], enemies[k]);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

}


function handlePlayerPopupCollision() {

    for (var i = 0; i < playerHitBoxes.length; i++) {
        for (var j = 0; j < itemHitBoxes.length; j++) {
            if (collision.intersectShipHitBoxBox(playerHitBoxes[i],
                itemHitBoxes[j])) {
                collected(j);
            }
        }
    }

}

function handleCollision() {

    collisionTimer += collisionClock.getDelta();
    handlePlayerPopupCollision();
    handleAsteroids();
    handleProjectiles();
    /** NICHT LÖSCHEN **/
    //handlePlayerEnemyCollision();
    //handleEnemyEnemyCollision();

    //check if Asteroid needs to be destroyed. Delay between hit and destruction implemented to give explosion time to develop
    if (toDestroy !== undefined && collisionTimer > 1) {
        hitAsteroid(toDestroy, "Rocket");
        toDestroy = undefined;
        asteroidAudio.play();
    }

}
