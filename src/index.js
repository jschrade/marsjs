var _ = require('lodash');

var FORWARD = 'f'
var BACKWARD = 'b'
var LEFT = 'l'
var RIGHT = 'r'
var ALL_COMMANDS = [
    FORWARD,
    BACKWARD,
    LEFT,
    RIGHT
]
var NORTH = 'N'
var SOUTH = 'S'
var EAST = 'E'
var WEST = 'W'

module.exports = {
    'Terrain': Terrain,
    'Rover': Rover,
    'commands': ALL_COMMANDS,
    'directions': {
        'north': NORTH,
        'south': SOUTH,
        'east': EAST,
        'west': WEST
    }
};

function Terrain(width, height) {
    this.width = width;
    this.height = height;
    this.terrain = _.times(height, function() {
        return _.fill(Array(width), 0);
    });
};

Terrain.prototype.xMax = function () {
    return this.width - 1;
};

Terrain.prototype.yMax = function () {
    return this.height - 1;
};

Terrain.prototype.addObstacle = function (coord) {
    this.terrain[coord[1]][coord[0]] = 1;
};

Terrain.prototype.isClear = function (coord) {
    return this.terrain[coord[1]][coord[0]] == 0;
};

function Rover(terrain, location, direction) {
    this.terrain = terrain;
    this.x = location[0];
    this.y = location[1];
    this.direction = direction;
};

Rover.prototype.parseCommands = function (commandString) {
    return _.filter(_.split(commandString, ','), function(command) {
        return _.includes(ALL_COMMANDS, command);
    });
};

Rover.prototype.checkClear = function (location) {
    return this.terrain.isClear(location);
};

Rover.prototype.moveRover = function (x, y) {
    if (x < 0) {
        x = this.terrain.xMax();
    };
    if (x > this.terrain.xMax()) {
        x = 0;
    };
    if (y < 0) {
        y = this.terrain.yMax();
    };
    if (y > this.terrain.yMax()){
        y = 0;
    };

    if (!this.checkClear([x, y])) {
        return false;
    };

    this.x = x;
    this.y = y;

    return true;
};

Rover.prototype.commandLeft = function () {
    switch (this.direction) {
        case NORTH:
            this.direction = WEST;
            break;
        case SOUTH:
            this.direction = EAST;
            break;
        case EAST:
            this.direction = NORTH;
            break;
        case WEST:
            this.direction = SOUTH;
    };
    return true;
};

Rover.prototype.commandRight = function () {
    switch (this.direction) {
        case NORTH:
            this.direction = EAST;
            break;
        case SOUTH:
            this.direction = WEST;
            break;
        case EAST:
            this.direction = SOUTH;
            break;
        case WEST:
            this.direction = NORTH;
    };
    return true;
};

Rover.prototype.commandForward = function () {
    var x = this.x + 0;
    var y = this.y + 0;

    switch (this.direction) {
        case NORTH:
            y += 1;
            return this.moveRover(x, y);
        case SOUTH:
            y -= 1;
            return this.moveRover(x, y);
        case EAST:
            x += 1;
            return this.moveRover(x, y);
        case WEST:
            x -= 1;
            return this.moveRover(x, y);
    };
};

Rover.prototype.commandBackward = function () {
    var x = this.x;
    var y = this.y;

    switch (this.direction) {
        case NORTH:
            y -= 1
            return this.moveRover(x, y);
        case SOUTH:
            y += 1
            return this.moveRover(x, y);
        case EAST:
            x -= 1;
            return this.moveRover(x, y);
        case WEST:
            x += 1
            return this.moveRover(x, y);
    };
};

Rover.prototype.runCommands = function (commandString) {
    var instance = this;
    var commands = this.parseCommands(commandString);
    var success = [];

    _.each(commands, function(command) {
        var result = false;
        switch (command) {
            case FORWARD:
                result = instance.commandForward();
                break;
            case BACKWARD:
                result = instance.commandBackward();
                break;
            case LEFT:
                result = instance.commandLeft();
                break;
            case RIGHT:
                result = instance.commandRight();
        };

        if (result) {
            success.push(command);
        };

        return result
    });

    return success;
};
