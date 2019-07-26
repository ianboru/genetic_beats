* Fix tempo bug (when it's not 100) - investigate/bisect - John
* Actions at the bottom (rate, mutate), play at the bottom? - John
* Consolidate BeatViewStore and BeatStore
* All Solo tracks can be enabled on drums

* Fix weird play lineage behavior - Ian
* Switch star rating to how much to change slider

* Duplicate beat in lineage? - John
* Add beat property which is a scale name/key (refers to scale in master list of scales) - John
* volume section - Ian


Other:
* Move play states onto beat? Questionable.

Design Needed:
* Describe workflow somewhere in simple terms ("listen, edit, rate, mutate, listen to lineage" - or whatever)

Potentially really hard:
* Lineage playback seems to skip / stutter between beats sometimes


* Live performance mode

* Style play button/play controls for lineage

* Refactor beat data structure so that it's an array of sections rather than an array of tracks
    * each section is an array of tracks
    * get its own rating, mute/solo, delete, mutate buttons

* UI for sections:
    * also Mutate Rated Sections button
    * Mute/Solo/Gain for each section (remove mute/solo/gain per synth track)

* Full piano UI
* Potentially:
  * show tooltip on Kill Last Beat to encourage using it when user rates a beat 5 or less
  * or only show the Kill Last Beat button when they rate the current beat 5 or less
* Lineages:
    * Play evolution of a beat (up to a 10 rating)
    * "Snapshots" of beats - when user rates 10?

* Simplify rating - 5 stars?
* Visually separate musical sections, and give them different colors
* Add back arrangement - as existing UI, or new single-view UI
* Utility - beat diff metric
    * longer lines between beats in a lineage depending on how much change
    * Things that are too similar won't mate potentially
    * Learn what manual changes a user makes to improve their beats (or what changes they rate highly)
* Sample mutation
* Lock synth / samples
* Checkbox to mutate various things - synth type, scale, percussion kit, etc.
* Pull presets into workflow, or create new presets
* Monophonic vs polyphonic synth
* Enforce monophone in UX


* Do new synth UI
* Create intro graphic
* A/B test rating thing

* Hook up Google Analytics
* Changing tempo breaks arrangement playback timing

Bugs:
    * Display rating on minibeat
    * In arrangement:
        * Switch ID on existing beat
        * Insert beat anywhere
        * Preview beats while adding
        * See family tree structure while adding
    * Drag to change tempo
    * Synth Gain not working
    * Deleting in arrangement while playing
    * Changing tempo messes up arrangement playback

    High :
        * Select Generation for Mating
    Low
    * tooltip blocks arrangement controls - john - low

    Real Low
    * Switch family while playing arrangement breaks
    * Switch family should go to family tree
    * Don't save families with no beats
    * Refactor updateFamilyInStorage to work with multiple stores
        * Make sure to save arrangement data (no longer called with localStorage.setItem)
    * Handle arrangement when we call killSubsequentGenerations
    * Selecting beats on Family Tree tab is broken? Leave off until connected to functionality?
    * save arrangment family
    * arrangement only hidden when disabled (0 beats) but still accessible - john
    * Add warning when playing but there are no notes to play - john

High value and/or easy:

* Redesign sample selection (to test sample without changing) - john
    * Categorize samples
* Select/generation logic & visuals - 3 design - john


High value but hard:
    * Give beats names instead of IDs
    * Design/add UI component for adding beats to arrangement from arrangement tab - 6 design
    * Improve synth UI
    * Delete beat - kinda a weird feature and not super urgent so putting this off
    * Export beat or arrangement as sound file would be amazing or share
    * Online collaboration, let friends score things before mating
    * Undo would be great
    * Ability to change note duration
    * Redesign arrangement view
    * Add multiple measures to beat and pagination when creating/play

medium/low value:
    * Note drag selection/deselection bug across tracks - john
    * TODO about refactoring actual arrangement to its own component
    * Simplify more around arrangement playback
    * play a generation
    * Gain not saved with family info
        * Make gain independent between beats
    * exclude generation from arrangement

    * Ability to “favorite” or rename beats
    * Starting counting from 1 rather than 0 for generation/beatnum
    * ?test? Doesn't always save arrangements (made new arrangement, added some beats, switched to different family, switched back, second arrangement was gone)
    * Easily play a beat and all of its descendants / mutations / related beats
    * You've reached the max number of instruments

    * Add number of subdivisions (aka note size in our case) to beat info header
    * Add to arrangement button should be “empty”
    * Add templates/archs for random arrangement
    * "Accented notes" for velocity approximation for samples, eg just having 1 extra option instead of range of velocity
        * Make it possible to add two of same sample for now?
    * Add config options in general for random arrangement
    * Play should warn when user is trying to play an empty beat or arrangement
    * improve Create song warning message clarity

low value:
    * Improve console error messages
    * Move some stuff into "screens" folder, distinguished from "components"
    * GainSlider NaN issue on mutate action
    * Record progression of a beat being made, adding/removing beats & tracks, etc
    * Add ability to rename current family
    * Bug: Synth didn’t get muted right away when something else was soloed (took until the beat played through) ** likely related to beat repeat refresh behavior
    * "Similarity matrix", cluster beats by similarities
    * Effects for synth


Maintenance:
* react-beautiful-dnd update: https://github.com/atlassian/react-beautiful-dnd/releases/tag/v10.0.0
