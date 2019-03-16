Bugs: 
    * research leaving react music for web audio - john
        * Deleting beats while the arrangement is playing can break 

    * Main beat player can get *way* off - ian
        * metronome off from beat 
    * switching beat quickly breaks beat 
    * There is silence/chopiness after each beat when playing in arrangement - ian
    * arrangement only hidden when disabled (0 beats) but still accessible - john
    * Add warning when playing but there are no notes to play - john 
    * Fix link to beat detail from family tree beatblocks - ian
    * tooltip blocks arrangemenet controls - john


    * Switch family while playing arrangement breaks
    * Switch family should go to family tree
    * Don't save families with no beats
    * Refactor updateFamilyInStorage to work with multiple stores
        * Make sure to save arrangement data (no longer called with localStorage.setItem)
    * Handle arrangement when we call killSubsequentGenerations
    * Selecting beats on Family Tree tab is broken? Leave off until connected to functionality?
    * save arrangmenet family
High value and/or easy:

* Redesign sample selection (to test sample without changing) - john
    * Categorize samples
* Select/generation logic & visuals - 3 design - john


High value but hard:
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
    * Safari breaks on this.context right now. React version? in react-music scheduler.js
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
    * Highlight notes in intermediate color until they're gonna play
    * Move some stuff into "screens" folder, distinguished from "components"
    * GainSlider NaN issue on mutate action
    * Record progression of a beat being made, adding/removing beats & tracks, etc
    * Add ability to rename current family
    * Bug: Synth didn’t get muted right away when something else was soloed (took until the beat played through) ** likely related to beat repeat refresh behavior
    * "Similarity matrix", cluster beats by similarities
    * Effects for synth


Maintenance:
* react-beautiful-dnd update: https://github.com/atlassian/react-beautiful-dnd/releases/tag/v10.0.0
