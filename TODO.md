John
----

* Get it working in production
* Enable dragging current beat into arrangement (improvement over "add to arrangement" button)
* Select/generation logic & visuals
* "How do I get to the next beat easily? There should be a keyboard shortcut for that"
* Add number of subdivisions (aka note size in our case) to beat info header
* Visual divisions every 4 notes
* (up)Load all existing samples
* Disable text select anywhere user swipe, click quickly, or drag & drop
* Arrangement needs to be on one line (scroll) because of react-beautiful-dnd limitations
* Refactor track/sample/synth so that synths are one track, other benefits

* Concept of active beat, selected beats, non-selected beats
    * By default, selected beats are the current gen and next/prev iterate through them
    * Select mode lets user select arbitrary set of beats
    * Active beat shown in red, selected beats shown as normal, non-selected beats grayed out somewhat
    * Prior generations are "selected" by activating a beat in that generation

Note:
* Can the synth preview not use global state?


Ian
---

* More responsive editing/beat switching (lag)
* Add templates/archs for random arrangement
    * Change create song to be based on number of samples / note density
* Fix mouse-off state for family tree nodes


Next Beta
---------

* Create our own non-canvas family tree renderer


Up For Grabs
------------

Beta:
* Letting user know what a beat/track is (in terms of what the buttons do)
* Color generation and beat number inside of cytoscape nodes to distinguish them
* Color stars same as node rating color
* Randomize Best Beats and Create Song should be two options under the same action
  ("Generate Arrangement") show song "contour" or more info in a tooltip
* Big magic button for "Create New Arrangement"


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


Aryn and Josh User Test
-----------------------

* Undo would be great
* Piano UI for synth would be dope
* Mute/Solo bugs still?
* Way to export
* More continuous melody sound (might go w Piano visualization)?
* Node ids are confusing ("is that what I rated it?")
    * Wish there were metadata of some kind around the node
    * Improve node colors to indicate meaning (aka how well it was rated)
* What does arrangement mean? Arrangement of beats?
    * Beat terminology confusing. The whole thing being a beat isn't totally obvious.
* Arrangement UI sucks
* Tried to drag cytoscape node to arrangement
* Wrong UI component for adding beats to arrangement
* Hide arrangement until user is ready to user it (and don't show in a sliding panel?)
* Randomize best beats and Create song functions not obvious
* Don't loop arrangement by default, but allow that ability
* Create song warning message is not clear
* (John Note) Fluctuations in complexity seem extreme and unpredictable
* Add ability to choose which beats from each generation are used in an arrangement somehow
    * To exclude beats that don't "flow" well, even if they aren't poorly rated
    * Principle:
      * rating is trying to account for 2 things:
        * how good a beat is
        * how good it is in the context of an arrangement with the other generated beats