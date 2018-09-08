John
----

Beta:
* Reorganize beat display: generation, beat, and score in bar above beat and prev/rate/next in bar below
* "Add new beat to current generation" with select dropdown with options: "Empty beat", set of 
  templates that we give it, and all beats in current family tree
* Current beat area starts with big button to add beat to current generation and message about where
  the button will be after using it the first time
* Create new beat fucked
* Space bar should toggle playing, not trigger other buttons
* Reorganize all the buttons around current beat and make all config more accessible


* Enable dragging current beat into arrangement (improvement over "add to arrangement" button)
* Select/generation logic & visuals
* "How do I get to the next beat easily? There should be a keyboard shortcut for that"
* Add number of subdivisions (aka note size in our case) to beat info header
* Visual divisions every 4 notes
* (up)Load all existing samples
* Disable text select anywhere user swipe, click quickly, or drag & drop
* Arrangement needs to be on one line (scroll) because of react-beautiful-dnd limitations

* Concept of active beat, selected beats, non-selected beats
    * By default, selected beats are the current gen and next/prev iterate through them
    * Select mode lets user select arbitrary set of beats
    * Active beat shown in red, selected beats shown as normal, non-selected beats grayed out somewhat
    * Prior generations are "selected" by activating a beat in that generation


Ian
---

Beta:
* More responsive editing/beat switching (lag)
* Save arrangement with Family Tree
* Multiple arrangements


* Add templates/archs for random arrangement
    * Change create song to be based on number of samples / note density
* Fix mouse-off state for family tree nodes
* Removing beat from arrangement while it's playing loses synth notes


Next Beta
---------

* Create our own non-canvas family tree renderer


Up For Grabs
------------

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