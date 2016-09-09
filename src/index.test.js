var expect = require('chai').expect;
var marsRover = require('./index');

describe('marsjs', function() {

    describe('commands', function() {
        it('should return possible commands', function() {
            expect(marsRover.commands).to.satisfy(function(array){
                return array.every(function(item) {
                    return typeof item === 'string';
                });
            });
        });
    });

    describe('directions', function() {
        it('should return directions', function() {
            expect(marsRover.directions).to.have.all.keys(
                'north', 'south', 'east', 'west'
            );
        });
    });

    describe('Terrain', function() {
        it('should be able to create a new terrain', function() {
            var terrain = new marsRover.Terrain(3, 4);

            expect(terrain.width).to.eql(3);
            expect(terrain.height).to.eql(4);
            expect(terrain.terrain).to.eql([
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ]);
        });
    });

    describe('Rover', function() {
        it('should be able to create a new rover', function() {
            var location = (0, 1);
            var terrain = new marsRover.Terrain(2, 1);
            var rover = new marsRover.Rover(
                terrain,
                location,
                marsRover.directions.west
            );

            expect(rover.direction).to.eql(marsRover.directions.west);
            expect(rover.x).to.eql(location[0]);
            expect(rover.y).to.eql(location[1]);
            expect(rover.terrain.terrain).to.eql([
                [0, 0]
            ]);
        });
    });

});
