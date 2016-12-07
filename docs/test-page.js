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

var ic;
var wd;
var wd_loop;
var agent;
var a1;
var a2;

function timingTest() {
    var t1, t2;
    var p;
    t1 = Date.now();
    for (var i=0; i<10000000; i++) {
        p = {i: Math.random(), j: Math.random()};
    } // for i
    t2 = Date.now();
    console.log("New {}: " + (t2 - t1) + "ms");

    for (var i=0; i<10000000; i++) {
        p.i = Math.random();
        p.j = Math.random();
    } // for i
    t2 = Date.now();
    console.log("New {}: " + (t2 - t1) + "ms");
} // timingTest()

function loadAssets(callback) {
    ic = new Perry.ImageCache();
    ic.debug = true;
    ic.onReady = callback;
    var images = [
        "img/perry.png",
        "img/dude.png",
        "img/perry-01.png",
        "https://ifcomp.org/static/images/covers/noqmuesoxx4vb6qy"
    ];
    ic.loadImage(images, function(){console.log("image loaded");});
} // loadAssets()

function startTest() {
    var scene = new Perry.Scene();
    scene.width = 8000;
    scene.height = 8000;
    scene.fill();

    wd = new Perry.WebDisplay();
    wd.scene = scene;

    wd_loop = setInterval(wd.tick.bind(wd), 16);

    wd.ctx.drawImage(ic.cache["img/perry.png"], 100, 100);
    wd.ctx.drawImage(ic.cache["https://ifcomp.org/static/images/covers/noqmuesoxx4vb6qy"], 400, 400);

    agent = new Perry.Agent();
    wd.camera = agent;
    agent.img = ic.cache["img/dude.png"];
    agent.x = 5;
    agent.y = 5;

    a1 = new Perry.Agent();
    a1.img = ic.cache["img/dude.png"];

    scene.agents.push(agent);
    scene.agents.push(a1);

    agent.setTarget({i:10, j:3}, 0.2);
    console.log(agent);
    wd.freezeTest();
    wd.debug = true;
} // startTest()

window.onload = function() {
    timingTest();
    loadAssets(startTest);
} // onLoad()
