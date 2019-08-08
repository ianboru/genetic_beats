- Switch default change scale to Minor Change
- Bug: Various play buttons aren't mutually exclusive anymore - John
- Bug: Start tone after user interaction (currently broken in Safari and Chrome)
- Lineage can skip at beginning with lots of beats; investigate unnecessary re-rendering or other ways avoid skips - John
- Actions at the bottom (rate, mutate), play at the bottom? - John
- Solo/Gain for each section (ian)
- Bug: All tracks can be Soloed at same time for drums
- Pick lineage playback up where it left off, allow selecting starting beat when it's not currently playing
- Load lineage from local storage
- Name lineage
- Rename beats
- Undo 1 (or more) beat deletes
- Additional ocave
- Fix duplicate samplers
- Add custom sections
- URL sharing

Aryn Feedback

- "kills the vibe" - developer blue, developer red, developer yellow, system blue (select dropdowns)
- minibeat backgrounds: contrast between light gray and green is low
- Move section controls to line across top potentially
- Dot pattern across top of background, fade down ~300-500px
- around sections: get rid of white bevel, make shadow more diffuse, use higher corner radius
- light gray for titles of secondary things, labels, gain/delete icons
- re-layout section controls
- dropdowns: dark (but lighter than the background) with white/light text
- background dot texture thing

Design Needed:

- Describe workflow somewhere in simple terms ("listen, edit, rate, mutate, listen to lineage" - or whatever)

- Live performance mode
- Style play button/play controls for lineage

- Potentially:

  - show tooltip on Kill Last Beat to encourage using it when user rates a beat 5 or less
  - or only show the Kill Last Beat button when they rate the current beat 5 or less

- Add back arrangement - as existing UI, or new single-view UI
- Utility - beat diff metric
  - longer lines between beats in a lineage depending on how much change
  - Learn what manual changes a user makes to improve their beats (or what changes they rate highly)

High value and/or easy: \* Synth Gain not working

- Redesign sample selection (to test sample without changing) - John
  - Categorize samples

High value but hard:
_ Export beat or arrangement as sound file would be amazing or share
_ Online collaboration, let friends score things before mating
_ Undo would be great
_ Ability to change note duration \* Drag to change tempo

medium/low value:
_ Note drag selection/deselection bug across tracks
_ Make gain independent between beats
_ Ability to “favorite” or rename beats
_ Add number of subdivisions (aka note size in our case) to beat info header
_ "Accented notes" for velocity approximation for samples, eg just having 1 extra option instead of range of velocity
_ Make it possible to add two of same sample for now?
_ Display rating on minibeat
_ Hook up Google Analytics

low value:
_ Improve console error messages
_ Effects for synth \* Add warning when playing but there are no notes to play

Maintenance:

- react-beautiful-dnd update: https://github.com/atlassian/react-beautiful-dnd/releases/tag/v10.0.0
