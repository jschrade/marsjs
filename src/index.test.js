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

        it('should have a x maximum', function() {
            var terrain = new marsRover.Terrain(3, 4);

            expect(terrain.xMax()).to.eql(2);
        });

        it('should have a y maximum', function() {
            var terrain = new marsRover.Terrain(3, 4);

            expect(terrain.yMax()).to.eql(3);
        });

        it('should add an obstacle', function() {
            var terrain = new marsRover.Terrain(2, 2);

            expect(terrain.terrain).to.eql([
                [0, 0],
                [0, 0]
            ]);

            terrain.addObstacle([0,0]);

            expect(terrain.terrain).to.eql([
                [1, 0],
                [0, 0]
            ]);

            terrain.addObstacle([1,1]);

            expect(terrain.terrain).to.eql([
                [1, 0],
                [0, 1]
            ]);

            terrain.addObstacle([1, 0]);

            expect(terrain.terrain).to.eql([
                [1, 1],
                [0, 1]
            ]);
        });

        it('should be able to tell if location is obstacle free', function() {
            var terrain = new marsRover.Terrain(2, 2);
            terrain.addObstacle([0, 0]);
            terrain.addObstacle([1, 0]);
            expect(terrain.terrain).to.eql([
                [1, 1],
                [0, 0]
            ]);
            expect(terrain.isClear([0, 0])).to.be.false;
            expect(terrain.isClear([1, 0])).to.be.false;
            expect(terrain.isClear([0, 1])).to.be.true;
            expect(terrain.isClear([1, 1])).to.be.true;
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

        it('should parse a command string', function() {
            var terrain = new marsRover.Terrain(1, 1);
            var rover = new marsRover.Rover(
                terrain,
                [0, 0],
                marsRover.directions.north
            );

            expect(rover.parseCommands('f,b,l,r')).to.eql([
                'f',
                'b',
                'l',
                'r'
            ]);
            expect(rover.parseCommands('f,r,ls,zr,b')).to.eql([
                'f',
                'r',
                'b'
            ]);
        });

        it('should find obstacles', function() {
            var terrain = new marsRover.Terrain(2, 2);
            terrain.addObstacle([0,0]);
            var rover = new marsRover.Rover(
                terrain,
                [0, 1],
                marsRover.directions.south
            );

            expect(rover.checkClear([0, 0])).to.be.false;
            expect(rover.checkClear([0, 1])).to.be.true;
            expect(rover.checkClear([1, 0])).to.be.true;
            expect(rover.checkClear([1, 1])).to.be.true;
        });

        it('should move to locations free of obstacles', function() {
            var terrain = new marsRover.Terrain(2, 2);
            terrain.addObstacle([0,0]);
            var rover = new marsRover.Rover(
                terrain,
                [0, 1],
                marsRover.directions.south
            );

            expect(rover.moveRover(0, 1)).to.be.true;
            expect(rover.x).to.eql(0);
            expect(rover.y).to.eql(1);
            expect(rover.moveRover(1, 0)).to.be.true;
            expect(rover.x).to.eql(1);
            expect(rover.y).to.eql(0);
            expect(rover.moveRover(1, 1)).to.be.true;
            expect(rover.x).to.eql(1);
            expect(rover.y).to.eql(1);
        });

        it('should not move to locations with obstacles', function() {
            var terrain = new marsRover.Terrain(1, 2);
            terrain.addObstacle([0,0]);
            var rover = new marsRover.Rover(
                terrain,
                [0, 1],
                marsRover.directions.south
            );

            expect(rover.moveRover(0, 0)).to.be.false;
            expect(rover.x).to.eql(0);
            expect(rover.y).to.eql(1);
        });

        it('should turn left', function() {
            var terrain = new marsRover.Terrain(1, 1);
            var rover = new marsRover.Rover(
                terrain,
                [0, 0],
                marsRover.directions.north
            );

            expect(rover.direction).to.eql(marsRover.directions.north);

            rover.commandLeft()
            expect(rover.direction).to.eql(marsRover.directions.west);

            rover.commandLeft()
            expect(rover.direction).to.eql(marsRover.directions.south);

            rover.commandLeft()
            expect(rover.direction).to.eql(marsRover.directions.east);

            rover.commandLeft()
            expect(rover.direction).to.eql(marsRover.directions.north);
        });

        it('should turn right', function() {
            var terrain = new marsRover.Terrain(1, 1);
            var rover = new marsRover.Rover(
                terrain,
                [0, 0],
                marsRover.directions.north
            );

            expect(rover.direction).to.eql(marsRover.directions.north);

            rover.commandRight()
            expect(rover.direction).to.eql(marsRover.directions.east);

            rover.commandRight()
            expect(rover.direction).to.eql(marsRover.directions.south);

            rover.commandRight()
            expect(rover.direction).to.eql(marsRover.directions.west);

            rover.commandRight()
            expect(rover.direction).to.eql(marsRover.directions.north);
        });

        it('should move forward', function() {
            var terrain = new marsRover.Terrain(1, 2);
            var rover = new marsRover.Rover(
                terrain,
                [0, 0],
                marsRover.directions.north
            );

            expect(rover.commandForward()).to.be.true;
            expect(rover.x).to.eql(0);
            expect(rover.y).to.eql(1);

            expect(rover.commandForward()).to.be.true;
            expect(rover.x).to.eql(0);
            expect(rover.y).to.eql(0);

            expect(rover.direction).to.eql(marsRover.directions.north);

            terrain = new marsRover.Terrain(2, 2);
            rover = new marsRover.Rover(
                terrain,
                [1, 0],
                marsRover.directions.north
            );

            expect(rover.commandForward()).to.be.true;
            expect(rover.x).to.eql(1);
            expect(rover.y).to.eql(1);

            expect(rover.commandForward()).to.be.true;
            expect(rover.x).to.eql(1);
            expect(rover.y).to.eql(0);

            expect(rover.direction).to.eql(marsRover.directions.north);
        });

        it('should move backward', function() {
            var terrain = new marsRover.Terrain(1, 2);
            var rover = new marsRover.Rover(
                terrain,
                [0, 0],
                marsRover.directions.north
            );

            expect(rover.commandBackward()).to.be.true;
            expect(rover.x).to.eql(0);
            expect(rover.y).to.eql(1);

            expect(rover.commandBackward()).to.be.true;
            expect(rover.x).to.eql(0);
            expect(rover.y).to.eql(0);

            expect(rover.direction).to.eql(marsRover.directions.north);

            terrain = new marsRover.Terrain(2, 2);
            rover = new marsRover.Rover(
                terrain,
                [1, 0],
                marsRover.directions.north
            );

            expect(rover.commandBackward()).to.be.true;
            expect(rover.x).to.eql(1);
            expect(rover.y).to.eql(1);

            expect(rover.commandBackward()).to.be.true;
            expect(rover.x).to.eql(1);
            expect(rover.y).to.eql(0);

            expect(rover.direction).to.eql(marsRover.directions.north);
        });

        it('should run command string', function() {
            var terrain = new marsRover.Terrain(3, 3);
            terrain.addObstacle([1,1]);
            var rover = new marsRover.Rover(
                terrain,
                [0, 0],
                marsRover.directions.east
            );

            expect(rover.runCommands('f,r,f,f')).to.eql([
                'f','r','f'
            ]);
            expect(rover.x).to.eql(1);
            expect(rover.y).to.eql(2);
            expect(rover.direction).to.eql(marsRover.directions.south);
        });
    });
});
