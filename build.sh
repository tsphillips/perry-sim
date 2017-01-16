#!/bin/bash

# Copyright (c)2016 Thomas S. Phillips.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

DATE=`date +%Y%m%d%H%M%S`

SERVER_FILES="\
    src/Perry.js \
    src/Math.js \
    src/server/EventEngine.js \
    src/server/Entity.js \
    src/server/Body.js \
    src/server/Agent.js \
    src/server/Scene.js \
    src/server/Generator.js \
    src/server/SceneMapGenerator.js \
    src/server/StoryArcGenerator.js \
    "

CLIENT_FILES="\
    src/Perry.js \
    src/Math.js \
    src/client/ImageCache.js \
    src/client/TileSet.js \
    src/client/TileSetGenerator.js \
    src/client/WebDisplay.js \
    "


echo ${SERVER_FILES} | xargs cat > build/perry.server.js
echo ${CLIENT_FILES} | xargs cat > build/perry.client.js
cp build/*.js docs/js
