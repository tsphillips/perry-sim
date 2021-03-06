/*
Copyright (C)2017 Thomas S. Phillips.

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

import { Entity } from '../base/Entity';

/**
A partition of a World.
*/
export class Zone extends Entity {
    constructor() {
        super();
        this.type = 'Zone';
        this.class = Zone;
        this.name = 'Default Scene';
    } // constructor()
}; // class Zone
