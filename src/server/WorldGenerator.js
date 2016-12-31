/*
Copyright (c)2016 Thomas S. Phillips.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

Perry;

/**
Create a world.

Creates a world with given parameters.

== Geographic Subdivisions
- A World contains Zone objects.
- A Zone contains Scene objects.
- A Scene contains a TileMap.

== Political Subdivisions
- A World contains 1 or more Territory objects.
- A Territory can be one of [Country, Empire, Kingdom, Republic]
- A Territory is divided into 1 or more Province objects.

== Seed Generation
Every Entity object has a seed.
Every Entity can contain other entities.
To create a new sub-entity,
New Entity seed = createSeed(entitySeed, subentityCount)

*/
Perry.Client.WorldGenerator = class {

    constructor(args) {
    } // constructor()

} // class StoryArcGenerator
