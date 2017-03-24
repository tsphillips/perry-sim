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

import { Entity } from './Entity';
import { World } from './World';
import { Zone } from '../zone/Zone';

export var Perry = new class {
    constructor() {
        this.type = 'Perry';
        this.name = 'Perry Sim, virtual world simulator.';
        this.objects = {};
    } // constructor()

    init() {
        this.world = this.create('World');
        this.world.init();
    }

    create(type) {
        var obj = undefined;
        switch(type) {
            case 'Entity': {
                obj = new Entity();
                break;
            }
            case 'World': {
                obj = new World();
                break;
            }
            case 'Zone': {
                obj = new Zone();
                break;
            }
        } // switch
        if (typeof obj === 'undefined') {
            return undefined;
        } // if
        obj.perry = this;
        this.objects[obj.uuid] = obj;
        return obj;
    } // create()

}; // class Perry
