* Actions at the bottom (rate, mutate), play at the bottom? - John
* Switch star rating to how much to change slider - Luke
* Section volume - Ian
* Bug: All tracks can be Soloed at same time for drums
* Duplicate beat in lineage - John
* Add beat property which is a scale name/key (refers to scale in master list of scales)

Design Needed:
* Describe workflow somewhere in simple terms ("listen, edit, rate, mutate, listen to lineage" - or whatever)


* Live performance mode
* Style play button/play controls for lineage
* UI for sections:
    * add Mutate Rated Sections button
    * Mute/Solo/Gain for each section (remove mute/solo/gain per synth track)

* Full piano UI
* Potentially:
  * show tooltip on Kill Last Beat to encourage using it when user rates a beat 5 or less
  * or only show the Kill Last Beat button when they rate the current beat 5 or less

* Add back arrangement - as existing UI, or new single-view UI
* Utility - beat diff metric
    * longer lines between beats in a lineage depending on how much change
    * Learn what manual changes a user makes to improve their beats (or what changes they rate highly)
* Checkboxes to mutate various things - synth type, scale, percussion kit, etc.


High value and/or easy:
    * Synth Gain not working

* Redesign sample selection (to test sample without changing) - John
    * Categorize samples

High value but hard:
    * Export beat or arrangement as sound file would be amazing or share
    * Online collaboration, let friends score things before mating
    * Undo would be great
    * Ability to change note duration
    * Drag to change tempo

medium/low value:
    * Note drag selection/deselection bug across tracks
    * Make gain independent between beats
    * Ability to “favorite” or rename beats
    * Add number of subdivisions (aka note size in our case) to beat info header
    * "Accented notes" for velocity approximation for samples, eg just having 1 extra option instead of range of velocity
        * Make it possible to add two of same sample for now?
    * Display rating on minibeat
    * Hook up Google Analytics

low value:
    * Improve console error messages
    * Effects for synth
    * Add warning when playing but there are no notes to play


Maintenance:
* react-beautiful-dnd update: https://github.com/atlassian/react-beautiful-dnd/releases/tag/v10.0.0
