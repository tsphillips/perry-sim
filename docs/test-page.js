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
var scene;

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
    ic = new Perry.Client.ImageCache();
    ic.debug = true;
    ic.onReady = callback;
    var images = [
        "img/perry.png",
        "img/dude.png",
        "img/perry-02.png",
        "img/iso-64x64-outside.png"
    ];
    ic.loadImage(images, function(){console.log("image loaded");});
} // loadAssets()

function startTest() {
    var people = 6;
    scene = new Perry.Server.Scene();
    scene.width = 256;
    scene.height = 256;
    scene.fill();

    wd = new Perry.Client.WebDisplay();
    wd.imageCache = ic;
    wd.scene = scene;

    wd_loop = setInterval(wd.tick.bind(wd), 16);

    wd.ctx.drawImage(ic.cache["img/perry.png"], 100, 100);

    agents = [];
    for (var k=0; k<people; k++) {
        agents[k] = new Perry.Server.Agent();
        agents[k].img = ic.cache["img/dude.png"];
    } // for k
    wd.camera = agents[0];
    scene.agents = agents;

    wd.freezeTest();
    wd.debug = true;

    updateHandle = setInterval(debugUpdate, 1 / 30);
} // startTest()

function debugUpdate() {
    for (var i=0; i<agents.length; i++) {
        agents[i].update(this);
    } // if
}

function rnd(n) {
    return Math.floor(Math.random() * n);
} // rnd()

function debugAgentTarget() {
    for (var k=0; k<agents.length; k++) {
        agents[k].setTarget(
            {i: rnd(scene.width), j: rnd(scene.height)},
            20+rnd(6));
    } // for k
} // debugAgentTarget()

window.onload = function() {
    timingTest();
    loadAssets(startTest);
} // onLoad()
