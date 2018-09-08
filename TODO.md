John
----

* Enable dragging current beat into arrangement (improvement over "add to arrangement" button)
* Select/generation logic & visuals
* Reorganize beat display: generation, beat, and score in bar above beat and prev/rate/next in bar below
* Move mate button below family tree, mate it more prominent
* Switch initial beats to templates that can be added but otherwise empty initial gen
* "How do I get to the next beat easily? There should be a keyboard shortcut for that"
* Add number of subdivisions (aka note size in our case) to beat info header
* Visual divisions every 4 notes
* (up)Load all existing samples
* Disable text select anywhere user swipe, click quickly, or drag & drop

* Concept of active beat, selected beats, non-selected beats
    * By default, selected beats are the current gen and next/prev iterate through them
    * Select mode lets user select arbitrary set of beats
    * Active beat shown in red, selected beats shown as normal, non-selected beats grayed out somewhat
    * Prior generations are "selected" by activating a beat in that generation


Ian
---

* More responsive editing/beat switching (lag)
* Add templates/archs for random arrangement
    * Change create song to be based on number of samples / note density
* Add created date to saved family data and display in the family select dropdown
* Mute and solo shouldn’t carry to other beats (also changing sample loses mute/solo state)
* Got stuck in mute, turn on all solos turn off all solos
* Fix mouse-off state for family tree nodes



Up For Grabs
------------

* Space bar should toggle playing, not trigger other buttons
* Create new beat fucked
* Add ability to rename current family
* Starting counting from 1 rather than 0 for generation/beatnum
* Didn't notice track type synth right away
* Tracks with 32 notes don't fit
* Improve synth UI
* Delete beat - kinda a weird feature and not super urgent so putting this off
* Group instruments (eg, percussion vs melodic instruments vs synth, vs whatever)
* Context switch of some kind for editing? Or, a mode for editing?
    * Maybe just prompt if people want to “engineer” the beat before rating?
* How to remate generation?
    * Resolved by “active beats” possibly, “remate” button might be worth it
* Play/stop more obvious (maybe below current beat instead of above)
* Title for “current beat” (like arrangement/family tree)?


Future potential
----------------

* Export beat or arrangement as sound file would be amazing
* "Seems like it would be a lot of fun in a group situation"
* "Similarity matrix", cluster beats by similarities
* Online collaboration, let friends score things before mating
* "Accented notes" for velocity approximation for samples, eg just having 1 extra option instead of range of velocity
    * Make it possible to add two of same sample for now?
* Add config options in general for random arrangement
* Effects for synth