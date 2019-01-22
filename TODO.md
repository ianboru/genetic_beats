High value and/or easy:

* Flash notification to confirm actions (beat rated, track added/deleted)
* Restore select to mate functionality
* Show mating controls help info as tool tips
* Add beat without leaving presets screen
* mute solo highlight makes it seem like both can be on
* Select/generation logic & visuals
* Improve cueing on synth vs instrument
* Give user tips for adjusting volume and other small/helpful behaviors
* Prompt through the process (ie, prompt to mutate after first beat has some instruments or mate after a few beats have been created)
    * Suggest mutate for when user is close to a good sound but can’t quite get it
    * Mention that beats are always editable
    * arrangement
* design/add UI component for adding beats to arrangement
* navigate to beat player on beatblock click
* play arrangement from selected beat

High value but hard:
* Improve synth UI
* Delete beat - kinda a weird feature and not super urgent so putting this off
* Export beat or arrangement as sound file would be amazing or share
* Online collaboration, let friends score things before mating
* Undo would be great
* Ability to change note duration
* Redesign arrangement view
* Add multiple measures to beat and pagination when creating/play

medium/low value:
* play a generation
* Gain not saved with family info
    * Make gain independent between beats
* exclude generation from arrangement

* Ability to “favorite” or rename beats
* Starting counting from 1 rather than 0 for generation/beatnum
* Doesn't always save arrangements (made new arrangement, added some beats, switched to different family, switched back, second arrangement was gone)
* Safari breaks on this.context right now. React version? in react-music scheduler.js
* Easily play a beat and all of its descendants / mutations / related beats
?mayb not necessary since refactor?"You've reached the max number of instruments"
* Redesign sample selection (to test sample without changing)
    * Categorize samples
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
?done?* Try to extract / separate visual style stuff from functional stuff (reusable components with separate concerns)
* Enable dragging current beat into arrangement (improvement over "add to arrangement" button)
* Disable text select anywhere user swipe, click quickly, or drag & drop
?understand? * Refactor track/sample/synth so that synths are one track, other benefits
* Add ability to rename current family
?still exists?* Bug: Synth didn’t get muted right away when something else was soloed (took until the beat played through) ** likely related to beat repeat refresh behavior
* "Similarity matrix", cluster beats by similarities
* Effects for synth


Maintenance:
* react-beautiful-dnd update: https://github.com/atlassian/react-beautiful-dnd/releases/tag/v10.0.0



