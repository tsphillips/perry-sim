/*
Copyright (c)2017 Thomas S. Phillips.

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

var zone = new Perry.Server.Entity();

zone.type = "Zone";

zone.addConnection("Zone");
zone.addConnection("Zone");
zone.addConnection("Zone");
zone.addConnection("Zone");

zone.addContent("Scene");
zone.addContent("Scene");
zone.addContent("Scene");
zone.addContent("Scene");

var q1 = PSMath.int2Glyph([-1, 0, 1, 1000]);
var q2 = PSMath.glyph2Int(q1);
