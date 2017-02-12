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
Generate a StoryArc.

At any point in the sim, the player is faced with the choice of what to do.
A StoryArc guides the player through a story, told as a series of choices.
This structure is meant to be a departure from the traditional video game quest mechanic.

Lots of random notes follow. Thus far I am pulling from various sources to
dance around the issue of procedurally generated plot. I think I can distill
some primitives from the notes so resultant plots (and their characters) do
not seem so formulaic or off-the-shelf.

A StoryArc has:
- characters
- locations
- props
- plot

Campbell (1949)
I. Departure
    1. The Call to Adventure
    2. Refusal of the Call
    3. Supernatural Aid
    4. Crossing the Threshold
    5. Belly of the Whale
II. Initiation
    6. The Road of Trials
    7. The Meeting with the Goddess
    8. Woman as Temptress
    9. Atonement with the Father
    10. Apotheosis
    11. The Ultimate Boon
III. Return
    12. Refusal of the Return
    13. The Magic Flight
    14. Rescue from Without
    15. The Crossing of the Return Threshold
    16. Master of Two Worlds
    17. Freedom to Live

David Adams Leeming (1981)
I. Departure
    1. Miraculous conception and birth
    2. Initiation of the hero-child
    3. Withdrawal from family or community for meditation and preparation
II. Initiation
    4. Trial and Quest
    5. Death
    6. Descent into the underworld
III. Return
    7. Resurrection and rebirth
    8. Ascension, apotheosis, and atonement

Phil Cousineau (1990)
I. Departure
    1. The Call to Adventure
II. Initiation
    2. The Road of Trials
    3. The Vision Quest
    4. The Meeting with the Goddess
    5. The Boon
III. Return
    6. The Magic Flight
    7.The Return Threshold
    8.The Master of Two Worlds

Christopher Vogler (2007)
I. Departure
    1. The Ordinary World
    2. The Call to Adventure
    3. Refusal of the Call
    4. Meeting with the Mentor
    5. Crossing the Threshold to the Special World
II. Initiation
    6. Tests, Allies and Enemies
    7. Approach to the Innermost Cave
    8. The Ordeal
    9. Reward
III. Return
    10. The Road Back
    11. The Resurrection
    12. Return with the Elixir

Christopher Booker (2004)
Meta-plot:
1. Anticiation Stage
2. Dream Stage
3. Frustration Stage
4. Nightmare Stage
5. Resolution

Story Plots
- Overcoming the Monster
- Rags to Riches
- The Quest
- Voyage and Return
- Comedy
- Tragedy
- Rebirth

Georges Polti
36 Dramatic Situations
1. Supplication
2. Deliverance
3. Crime pursued by vengence
4. Vengeance taken for kin upon kin
5. Pursuit
6. Disaster
7. Falling prey to cruelty/misfortune
8. Revolt
9. Daring Enterprise
10. Abduction
11. The enigma
12. Obtaining
13. Enmity of kin
14. Rivalry of kin
15. Murderous adultery
16. Madness
17. Fatal imprudence
18. Involuntary crimes of love
19. Slaying of kin unrecognized
20. Self-sacrifice for an ideal
21. Self-sacrifice for kin
22. All sacrificied for passion
23. Necessity of sacrificing loved ones
24. Rivalry of superior vs. inferior
25. Adultery
26. Crimes of love
27. Discovery of the dishonour of a loved one
28. Obstacles to love
29. An enemy loved
30. Ambition
31. Conflict with a god
32. Mistaken jealousy
33. Erroneous judgement
34. Remorse
35. Recovery of a lost one
36. Loss of loved ones


Characters
- round or flat
- regular, recurring, guest
- Role
    -- stock
    -- protagonist
    -- antagonist
    -- antihero
    -- foil

Stock Characters (Theophrastus)
- The Insincere Man
- The Flatterer
- The Garrulous Man
- The Boor
- The Complacent Man
- The Man without Moral Feeling
- The Talkative Man
- The Fabricator
- The Shamelessly Greedy Man
- The Pennypincher
- The Offensive Man
- The Hapless Man
- The Officious Man
- The Absent-Minded Man
- The Unsociable Man
- The Superstitious Man
- The Faultfinder
- The Suspicious Man
- The Repulsive Man
- The Unpleasant Man
- The Man of Petty Ambition
- The Stingy Man
- The Show-Off
- The Arrogant Man
- The Coward
- The Oligarchical Man
- The Late Learner
- The Slanderer
- The Lover of Bad Company
- The Basely Covetous Man

Stock Characters (assorted)
https://en.wikipedia.org/wiki/List_of_stock_characters
- Absent-minded professor
- Angry black woman
- Bad boy
- Battle-axe
- Black knight
- Boy next door
- Bug-eyed monster
- Cat lady
- Contender
- Crone
- Damsel in distress
- Dark lady
- Dark lord
- Eldery martial arts master
- Everyman
- Fall guy
- Farmer's daughter
- Femme fatal
- Final girl
- Gentleman thief
- Girl next door
- Grande dame
- Hag
- Harlequin
- Hooker with a heart of hold
- Hotshot
- Ingenue
- Jock (athlete)
- Knight-errant
- Little green men
- Loathely lady
- Lovers
- Mad scientist
- Magical negro
- Mammy archetype
- Manic Pixie Dream Girl
- Mary Sue
- Miles Gloriosus
- Mother's boy
- Nerd
- Noble savage
- Outlaw (stock character)
- Pantomime dame
- Petrushka
- Princesse lointaine
- Professor
- Redshirt
- Rightful kind
- Senex iratus
- Shrew
- Sinnekins
- Soubrette
- Southern belle
- Space Nazis
- Spear carrier
- Superhero
- Übermensch
- Supersoldier
- Supervillain
- Swashbuckler
- Tomboy
- Tortured artist
- Town drunk
- Tragic hero
- Tragic mulatto
- Vice
- Village idiot
- Villain
- Whisky priest
- White hunter
- Wise fool
- Wise old man
- Yokel
- Youxia

*/
Perry.Client.StoryArcGenerator = class {

    constructor() {
    } // constructor()

} // class StoryArcGenerator
