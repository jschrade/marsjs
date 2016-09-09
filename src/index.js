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

function Rover(terrain, location, direction) {
    this.terrain = terrain;
    this.x = location[0];
    this.y = location[1];
    this.direction = direction;
};
