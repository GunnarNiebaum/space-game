// Botklasse
// TODO: In Bot mit Spieler als Ursprung rechnen
// TODO: Operator Overloading entfernen
// TODO: Eigene MATH-Klasse konstruieren, die 3JS erleichtert

var minObstacleDistance = 100;
var minShipSize = 10;
var maxShipSize = 20;
var maxAsteroidSize = 30;
var guardingRadius = 50;
var minDistanceToPlayer = 10;

var asteroids, enemies, enemy, asteroid, playerPosition,
    worldRadius, radius, i;



// Sortierfunktion fuer Bots (Enemies und Asteroids)
// je naeher am Schiff, desto niedriger der Indize
function compare(a,b) {
    var distanceA = a.location.distanceToSquared(playerPosition);
    var distanceB = b.location.distanceToSquared(playerPosition)

    if(distanceA < distanceB) {
        return -1;
    } else if(distanceA > distanceB) {
        return 1;
    } else {
        return 0;
    }
}





// Asteroidenklasse
function Asteroid(location,radius, direction, speed) {
    this.direction = speed * direction.normalize();
    this.radius = radius;
    this.location = location;
};

Asteroid.prototype.move = function(delta, asteroids, enemies) {
    this.location += delta * direction;
};

Asteroid.prototype.onCollisionDetect(other) {
    // TODO: aufspalten in Dreiecke mit reflektiertem Winkel
}





// Enemyklasse
function Enemy(location, speed ,weapon) {
    this.speed = speed;
    this.location = location;
    this.weapon = weapon;
    this.isAlive = true;
    this.shootAble = false;
    this.onBezier = false;
};

Enemy.prototype.move = function(delta, asteroids, enemies) {
    var wrongDir, avoidDir, alpha, shootAble, d, distanceToShip;

    // 0. Schritt: TODO: Checke ob auf Bezierkurve oder nicht

    // Achte darauf, dass sich der Spieler nicht um mehr als 90° zur
    // urspruenglichen Richtung gedreht hat

    // 1. Schritt: Gehe in Richtung Spieler (Idealrichtung)
    var directionToPlayer = new THREE.Vector3();
    directionToPlayer.copy(playerPosition);
    directionToPlayer.sub(this.location);

    var distanceToPlayer = new THREE.Vector3();
    distanceToPlayer.copy(directionToPlayer);
    distanceToPlayer.length();

    directionToPlayer.normalize();

    // 2. Schritt: Ueberpruefe, ob dem Spieler zu nahe geraten
    if(distanceToPlayer < minDistanceToPlayer) {
            // fliege in Bezierkurve hinter den Flieger
            // setze Idealrichtung als Richtung zu naechstem Punkt auf der Kurve
    } else {
        // Gelange hinter dem Spieler:
        // berechne Bezierkurve und setze flag onBezier = true

    }

    // 3. Schritt: Ueberpruefe auf Hindernisse
    var obstacles = [];
    var possibleObstacle = false;

    // Setze, da Abstand nach vorne wichtiger, Schiff voruebergehend auf die
    // Position mit idealer Flugrichtung im naechsten Frame
    var shipPosition = new THREE.Vector3();
    shipPosition.copy(this.position);
    directionToPlayer.multiplyScalar(delta*this.speed);
    shipPosition.add(directionToPlayer);
    directionToPlayer.normalize();

    var shipDistance = distanceToPlayer + delta * this.speed;

    // Kontrolliere, ob sich im guardingRadius andere Gegenstaende befinden
    for(asteroid of asteroids) { // Asteroiden schon geupdatet
        d = abs(shipDistance - asteroid.location.distance(playerPosition));
        // Teste, ob im richtigen Ring um den Spieler
        if(d <= minObstacleDistance) { // nahe (in Bezug auf Distanz zum Player)
            possibleObstacle = true;
            distanceToShip = asteroid.position.distanceTo(shipPosition);
            if(distanceToShip <= guardingRadius) { // nahe an this
                obstacles.push(asteroid);
            }
        } else if(possibleObstacle && d > minObstacleDistance) {
            possibleObstacle = false;
            break; // da sortiert nun nur noch weiterliegende Objekte
        }

    }

    for(enemy of enemies) {
        d = abs(shipDistance - enemy.location.distance(playerPosition));
        if(d <= minObstacleDistance) { // nahe (in Bezug auf Distanz zum Player)
            distanceToShip = enemy.position.distanceTo(shipPosition);
            if(distanceToShip <= guardingRadius) { // nahe an this
                obstacles.push(enemy);
            }
        } else if(possibleObstacle && d > minObstacleDistance) {
            possibleObstacle = false;
            break;
        }

    }

    // 4. Schritt: ausweichen
    // naechstgelegenem Hindernis ausweichen, bis auf Weg kein Gegenstand

    if(obstacles.length > 0) {

        // 3.5. Schritt: Sortiere nach Distanz zu this
        // Naechste Objekte vorne
        obstacles.sort(function(a,b) {
            var distanceA = a.location.distanceToSquared(shipPosition);
            var distanceB = b.location.distanceToSquared(shipPosition);

            if(distanceA < distanceB) {
                return -1;
            } else if(distanceA > distanceB) {
                return 1;
            } else {
                return 0;
            }
        });

        // Ausweichalgorithmus:
        // Projeziere Szene auf Plane, deren Abstand zum Schiff durch den
        // maximalen Flugwinkel bestimmt ist
        // da alles Kugel genuegt Mittelpunkt und Radius

        // Ueberpruefe auf Kollision und merke den "Fehler"

        // Falls bevorzugte Richtung geht, gehe in diese Richtung mit einem
        // kleinen vom "Fehler" abhaengigen Unterschied

        // Sonst gehe in andere Richtung -> Projektion der Asteroiden in
        // Dictionary speichern (z.B. fuer entgegengesetzte Flugrichtung)

        // Falls dies auch nicht geht, ueberpruefe, ob Ecken der Plane frei

        // Falls vor einem alles versperrt, bleibe stehen




/*      // Ausweichrichtung:
        // gehe in die Richtung der Normalen (vom Gegenstand weg)
        // mit einem impactFactor sowie ...
        // negative Hindernisflugrichtung, bis zu 90° Winkel um ideale Richtung
        // gedreht
       avoidDir = new THREE.Vector3(0,0,0);
        avoidDir.sub(wrongDir);
        // TODO: Falls <Asteroid,Schiff> nahe -1 -> alpha auf +- 90°
        //          ansonsten variabel drehen
        alpha = Math.PI * Math.random() - Math.PI/2;
        avoidDir.applyAxisAngle(directionToPlayer,alpha);
        avoidDir.normalize();
        // je naeher an Gegenstand desto mehr ausweichen
        avoidImpact = this.speed * (1-distanceToCollisonObject/guardingRadius);*/
    } else {
        direction = directionToPlayer;
        shootAble = true;
    }

    // 5. Schritt: normalisiere, um Geschwindigkeit nur von speed
    //                              abhaengig zu machen
    direction.normalize();

    // 6. Schritt:
    // TODO: an 3JS-Syntax anpassen
    this.location += delta * this.speed * direction;
};

Enemy.prototype.shoot = function() {
    // Schießt von location mit weapon in direction
    // TODO: Je naeher desto haeufiger
};

Enemy.prototype.shot = function() {
    // TODO: Fuer jeden Schuss im Spiel und jeden Gegenstand in der Naehe
    // ueberpruefe Kollision
    return false;
}





// Reflektiert Asteroiden a und b
function reflectAsteroids(a,b) {
    var factor;

    // "Normale" der Reflektion (zeigt von a nach b -> "Normale fuer a")
    var axis = new THREE.Vector3(0,0,0);
    axis.add(b.position);
    axis.sub(a);
    axis.normalize();

    var negAxis = new THREE.Vector3(0,0,0);
    negAxis.sub(axis);

    // Reflektion fuer Asteroid a
    var axisA = new THREE.Vector3;
    axisA.copy(axis);
    factor = 2 * Math.dot(axisA,a.direction)
    a.direction.negate();
    a.direction += axis.multiplyScalar(factor);

    // Reflektion fuer Asteroid b
    var axisB = new THREE.Vector3();
    axisB.copy(negAxis);
    factor = 2 * Math.dot(axisB,b.direction);
    b.direction.negate();
    b.direction += negAxis.multiplyScalar(factor);
}


// Kollisionsueberpruefung und getroffene Ausschalten
function checkCollisionAndDestroy() {
    // TODO:
    // falls Asteroid getroffen:
    // Asteroid ? -> abstossen und verkleinern
    // (notfalls loeschen, falls kleiner maxShipSize -> sowie bei Schuss)
    // Schiff   ? -> weiterbewegen
    // Schuss   ? -> explodieren und neu setzen

    // falls Schiff getroffen:
    // Asteroid, Schiff, Schuss von Gegner ? -> neu setzen
    // Schuss vom Spieler ? -> explodieren


    // gebe "Ueberlebende" zurueck
    return enemies;
}

// Testet so, dass sich Gegenstaende beim Erzeugen nicht behindern
function farAway(position,size) {
    // ueberpruefe Kollision mit Asteroiden
    // (ausnutzen, dass asteroids sortiert)
    distance = position.distanceTo(playerPosition);

    var asteroidsLength;
    for(i = 1; i <= asteroidsLength; i++) {
        asteroid = asteroids[asteroidsLength - i];
        var distanceAsteroid = asteroid.position.distanceTo(playerPosition);

        if(distance - size - distanceAsteroid - asteroid.radius < 0) {
            return false;
        }
    }

    // ueberpruefe Kollision mit Enemies
    var enemiesLength;
    for(i = 1; i <= enemiesLength; i++) {
        enemy = enemies[enemiesLength - i];
        var distanceEnemy = enemy.position.distanceTo(playerPosition);

        if(distance - size - distanceEnemy - maxShipSize < 0) {
            return false;
        }
    }

    // nichts gefunden
    return true;
}


// Erschaffe Asteroiden
function createAsteroid(level) {
    // Welt als Kugel -> Setze an den aeusseren 1/6 Rand
    positionRadius = worldRadius/6 * (5+Math.random());

    // zufaellig an den Rand positionieren
    do {
        alpha = 2 * Math.PI * Math.random();
        beta = Math.PI * Math.random();
        asteroidPosition = new THREE.Vector3(
            Math.sin(beta) * Math.sin(alpha),
            Math.sin(beta) * Math.cos(alpha),
            Math.cos(beta));
        asteroidPosition.multiplyScalar(positionRadius);
        // Radius zufaellig, aber mindestens so gross wie Schiff
        radius = minShipSize + Math.random * (maxAsteroidSize - minShipSize);
    } while(!farAway(asteroidPosition, radius));

    // speed abhaengig von Level
    speed = level;

    // Richtung:
    // Gegengesetzt zur Normalen mit kleinem Fehlerwinkel (bis zu 20°)
    direction = new THREE.Vector3(
            Math.sin(beta) * Math.sin(alpha),
            Math.sin(beta) * Math.cos(alpha),
            Math.cos(beta));
    direction += Math.pow(-1,Math.round(1000 * Math.random())) *
                     Math.random() * 0.36397023; // tan(20°)

    asteroid = new Asteroid(asteroidPosition, direction, speed);

    return asteroid;
}

// Erschaffe Enemy
function createEnemy(level) {
    var weapon;

    // Welt als Kugel -> Setze an den aeusseren 1/6 Rand
    radius = worldRadius/6 * (5+Math.random());

    // zufaellig an den Rand positionieren
    do {
        alpha = 2 * Math.PI * Math.random();
        beta = Math.PI * Math.random();
        enemyPosition = new THREE.Vector3(
            Math.sin(beta) * Math.sin(alpha),
            Math.sin(beta) * Math.cos(alpha),
            Math.cos(beta));
        enemyPosition.multiplyScalar(radius);
    } while(!farAway(enemyPosition, maxShipSize));

    // speed abhaengig von Level
    speed = 2;

    // weapon
    switch(Math.round(level * Math.random()) {
        case 0 : weapon = 0; break;
        case 1 : weapon = 1; break;
        case 2 : weapon = 2; break;
        case 3 : weapon = 3; break;
        default: weapon = 4; // hardest weapon
    }

    enemy = new Enemy(enemyPosition, speed, weapon);

    return enemy;
}


// aktualisiere Position der Asteroiden und Gegner
// Setze direction neu
function updateLocation(delta) {

    // 1. Schritt: Asteroiden und Gegner sortieren
    enemies.sort(compare);

    // 2. Schritt: Ausweichen
    // Asteroiden haben keine Intelligenz -> Bewegung behalten
    // Gegner sind intelligent -> allen vor sie liegenden Asteroiden ausweichen
    //                         -> allen vor sie liegenden Gegnern ausweichen
    // -> vordere updaten und Richtung des naechsten anhand der neuen Position
    //    ausrechnen

    // Asteroiden: Bewegung updaten
    for(asteroid of asteroids) {
        asteroid.move(delta, asteroids, enemies)
    }

    asteroids.sort(compare);

    // Enemies bewegen
    // erst ab bestimmter Distanz d_max ausweichen priorisieren
    // ab d_min auf jeden Fall ausweichen
    for(enemy of enemies) {
        enemy.move(delta, asteroid, enemies);
    }

}

// update-Methode, aufzurufen in jedem Durchlauf des Renderers
function update(delta) {
    // Spielerposition updaten
    playerPosition = new THREE.Vector3(0,0,0);
    // Gegner und Asteroiden updaten
    updateLocation(delta);
    // Kollisionsueberpruefung -> zerstoerte Loeschen
    enemies = checkCollisionAndDestroy(asteroids, enemies);
    // Schiessen
    for(enemy of enemies) {
        if(enemy.shootAble == true) {
            enemy.shoot();
            enemy.shootAble = false;
        }
    }
}


// Initialisierer der Bots je Level
function initAI(level) {
    // setzen unserer externen Faktoren
    playerPosition = Player.getPosition();
    worldRadius = World.getRadius();

    // erstelle Asteroiden
    asteroids = [];

    for(i = 0; i < 5 * level; i++) {
        asteroid = createAsteroid(level);
        asteroids.push(asteroid);
    }

    // erstelle Gegner
    enemies = [];

    for(i =0 ; i < 3 * level; i++) {
        enemy = createEnemy(level);
        enemies.push(enemy);
    }
}
