2018-08-19
==========

* Concept of active beat, selected beats, non-selected beats
    * By default, selected beats are the current gen and next/prev iterate through them
    * Select mode lets user select arbitrary set of beats
    * Active beat shown in red, selected beats shown as normal, non-selected beats grayed out somewhat
* Change scoring color (OR active beat color) to green or blue
* Prior generations are "selected" by activating a beat in that generation
* Start counting generation and beats from 1 rather than 0 (at least in the UI)
* Reorganize beat display: generation, beat, and score in bar above beat and prev/rate/next in bar below
* Switch Rate Beat to star rating system (10 start or 5 stars with half steps)
* Move mate, current family, new family, clear all to the family tree side of the screen
* Add number of subdivisions (aka note size in our case) to beat info header
* Hover effect for notes (in beat) and nodes (in family tree) to make it obvious that they're clickable
* Getting warning about mating clearing all generations during select mode
* Group instruments (eg, percussion vs melodic instruments vs synth, vs whatever)


OLD
===

* Stop or score mid beat
* Replay beat during scoring or final generation(H)
* Save and load beats to playback by generation and member (L)
* Separate initial configuration into config file (M)
* Create UI choose instruments to include or exclude. Web is optimal for future multi-person use. (M)
* Create UI to load wavs into library (L)