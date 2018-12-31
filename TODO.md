Refactor:

* Try to extract / separate visual style stuff from functional stuff (reusable components with separate concerns)
* Move some stuff into "screens" folder, distinguished from "components"

* Redesign sample selection (to test sample without changing)
    * Categorize samples
* Safari breaks on this.context right now. React version? in react-music scheduler.js
* Star fill on mouse down
* GainSlider NaN issue on mutate action
* Note rerendering issue: have columns light up



John:

* Tooltips should appear faster and be more prominent
    * Show mating controls help info as tool tips
* Beat ID should be more prominent
* BUG: Star rating sometimes not working
* Add to arrangement button should be “empty”
* Improve console error messages


Ian:

* In app.js, switch render conditions to only rely on explicity "show*" boolean values and not other arbitrary state
    * Might be the wrong way to do it, but this needs to be improved somehow
    * NewBeatManager shouldn't be inside of BeatDisplay


Pair:
* Progress indicator for beat in arrangement





Beta test session todos:

For initial creation of beats from template, template screen should not close unless a button is clicked.
Stars should reset when switching beats

Other Stuff:
* Add beat without leaving presets screen
* mute solo highlight makes it seem like both can be on
* Doesn't always save arrangements (made new arrangement, added some beats, switched to different family, switched back, second arrangement was gone)
* Highlight notes in intermediate color until they're gonna play
* Highlight notes while arrangement beats are playing
* Play preview doesn't change when new sample is select
* Click-swiping across notes to set or unset doesn't work across multiple tracks




John
----

* Enable dragging current beat into arrangement (improvement over "add to arrangement" button)
* Select/generation logic & visuals
* Arrow keys to go to next/previous beat
* Add number of subdivisions (aka note size in our case) to beat info header
* Disable text select anywhere user swipe, click quickly, or drag & drop
* Refactor track/sample/synth so that synths are one track, other benefits
* Concept of active beat, selected beats, non-selected beats
    * By default, selected beats are the current gen and next/prev iterate through them
    * Select mode lets user select arbitrary set of beats
    * Active beat shown in red, selected beats shown as normal, non-selected beats grayed out somewhat
    * Prior generations are "selected" by activating a beat in that generation

Note:
* Can the synth preview not use global state?

Maintenance:
* react-beautiful-dnd update: https://github.com/atlassian/react-beautiful-dnd/releases/tag/v10.0.0



Ian
---

* More responsive editing/beat switching (lag)
* Add templates/archs for random arrangement
    * Change create song to be based on number of samples / note density
* Fix mouse-off state for family tree nodes



Next Beta
---------

* Refactor & cleanup
* Create our own non-canvas family tree renderer



Up For Grabs
------------

* Investigate error/rerender while playing song (possibly also slowing down playback)
* Letting user know what a beat/track is (in terms of what the buttons do)
* Add ability to rename current family
* Starting counting from 1 rather than 0 for generation/beatnum
* Didn't notice track type synth right away
* Tracks with 32 notes don't fit
* Improve synth UI
* Delete beat - kinda a weird feature and not super urgent so putting this off
* Group instruments (eg, percussion vs melodic instruments vs synth, vs whatever)
* Context switch of some kind for editing? Or, a mode for editing?
    * Maybe just prompt if people want to “engineer” the beat before rating?
* Title for “current beat” (like arrangement/family tree)?

* Bug: Synth didn’t get muted right away when something else was soloed (took until the beat played through) ** likely related to beat repeat refresh behavior

* Export beat or arrangement as sound file would be amazing
* "Seems like it would be a lot of fun in a group situation"
* "Similarity matrix", cluster beats by similarities
* Online collaboration, let friends score things before mating
* "Accented notes" for velocity approximation for samples, eg just having 1 extra option instead of range of velocity
    * Make it possible to add two of same sample for now?
* Add config options in general for random arrangement
* Effects for synth


Aryn (More Recent - Beta 1.0) User Test
---------------------------------------

* Family stuff confusing
* Not clear how to start
* Play should warn when user is trying to play an empty beat or arrangement
* Adding instruments is weird/confusing - sampler vs synth not clear
* Give user tips for adjusting volume and other small/helpful behaviors
* Prompt through the process (ie, prompt to mutate after first beat has some instruments or mate after a few beats have been created)
    * Suggest mutate for when user is close to a good sound but can’t quite get it
* Redo family tree!
* Mention that beats are always editable
* Aryn wished she knew how to find bass sounds (segment sampler sounds by “type”?)
* Aryn started to run out of inspiration after a while - not sure what to do next (check out presets, mutate, play with arrangement would have been cool)
* Ability to “favorite” or rename beats
* Share beats with other people!
* Gain not saved with family info
    * Make gain independent between beats


Aryn and Josh User Test
-----------------------

* Undo would be great
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
* Randomize best beats and Create song functions not obvious
* Don't loop arrangement by default, but allow that ability
* Create song warning message is not clear
* Add ability to choose which beats from each generation are used in an arrangement somehow
    * To exclude beats that don't "flow" well, even if they aren't poorly rated
    * Principle:
      * rating is trying to account for 2 things:
        * how good a beat is
        * how good it is in the context of an arrangement with the other generated beats

refactor:
- not easy to follow solo/mute flow; when set vs when used
