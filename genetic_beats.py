import pygame as pg
import time
import numpy
import os
from datetime import datetime
from time import sleep
import asyncio

pg.mixer.init()
pg.init()
num_generations = 20
num_initial_members = 3
num_progeny_per_mating = 1
num_saved_progeny_per_generation = 3
note_subdivision = 16
num_loops = 2
tempo = 95
beat_length = (60/tempo)*(4 / note_subdivision)
mutation_rate = .50
print("beat_length: " + str(beat_length))
sounds = []
pg.mixer.set_num_channels(19)

dirpath = os.path.abspath(os.path.dirname(__file__))

# setting up sounds
sounds.append(pg.mixer.Sound(pg.mixer.Sound(f"{dirpath}/kick.wav")))
sounds.append(pg.mixer.Sound(pg.mixer.Sound(f"{dirpath}/snare.wav")))
sounds.append(pg.mixer.Sound(pg.mixer.Sound(f"{dirpath}/hi_hat.wav")))
#sounds.append(pg.mixer.Sound(pg.mixer.Sound("/Users/ianborukhovich/Projects/curiosity_driven_data_mining/genetic_beats/clave.wav")))
sounds.append(pg.mixer.Sound(pg.mixer.Sound(f"{dirpath}/G.wav")))
sounds.append(pg.mixer.Sound(pg.mixer.Sound(f"{dirpath}/C.wav")))
sounds.append(pg.mixer.Sound(pg.mixer.Sound(f"{dirpath}/Eb.wav")))
#sounds.append(pg.mixer.Sound(pg.mixer.Sound(f"{dirpath}/F#.wav")))
# sounds.append(pg.mixer.Sound(pg.mixer.Sound(f"{dirpath}/D.wav")))

num_sounds = len(sounds)
sound_lengths = []
for sound in sounds:
    sound_lengths.append(sound.get_length())

# every sound has a corresponding print output
sound_names  = ['Kc','Sn','Hh', 'G','C','Eb','D']

def array_of_random_integers(length, max_int):
    rand_int_array = []
    for i in range(0,length):
        random_binary = numpy.random.randint(0, max_int)
        rand_int_array.append(random_binary)
    return rand_int_array

def create_inital_generation(sounds):
    last_generation = []
    for j in range(0, num_initial_members):
        current_member = []
        for i in range(0, num_sounds):
            current_member = current_member + array_of_random_integers(note_subdivision, 2)
        last_generation.append(current_member)
    return last_generation

def create_next_generation(last_generation, last_generation_fitness):
    next_generation = []
    # pairwise comparison: all against all
    for a in range(0, len(last_generation)):
        for b in range(a, len(last_generation)): 
            #mate current pair to generate progeny
            if a != b:
                print("mating member " + str(a+1) + " and " + str(b+1))
                next_generation = next_generation + mate_current_pair(last_generation[a], last_generation_fitness[a], last_generation[b], last_generation_fitness[b])
    print("number of children " + str(len(next_generation)))
    return next_generation

def mate_current_pair(father,father_fitness, mother, mother_fitness):
    current_mating_beats = []
    for x in range(0, num_progeny_per_mating):
        #choose member to donate each beat
        child_beat = []
        # per note, chose mother or father note
        for y in range(0, len(father)):
            inhereted_beat = get_inherited_beat(father[y],father_fitness,mother[y], mother_fitness)
            # if random chance is greater than mutation rate, keep inherited note, otherwise flip it / mutate
            mutated_beat = inhereted_beat if numpy.random.randint(0,101) > mutation_rate*100 else 1 - inhereted_beat
            child_beat.append(mutated_beat)
        current_mating_beats.append(child_beat)
    return current_mating_beats

def get_inherited_beat(father_beat,father_fitness,mother_beat, mother_fitness):
    percent_difference = abs((father_fitness - mother_fitness)/max(father_fitness,mother_fitness))
    # roll 100-sided die and if the number you get is in the upper half of the distribution that
    if numpy.random.randint(0,101) > 100*(50 - percent_difference):
        return max(father_beat,mother_beat)
    else:
        return min(father_beat,mother_beat)

async def play_sound(sound):
    print("playing sound")
    sound.play()

def identify_fit_progeny(last_generation):
    print("identifying fit members")
    last_generation_fitness = []
    beat_num = 0
    for beat in last_generation:
        beat_num += 1
        #play beat to rate fitness
        play_beat(beat, num_loops)
        print("playing member " + str(beat_num) + " of " + str(len(last_generation)))
        sleep(0.5)
        fitness = False
        while not fitness:
            fitness = input("score beat\n")
        last_generation_fitness.append(int(fitness))
    saved_progeny_indices = find_top_n_indices(last_generation_fitness, num_saved_progeny_per_generation)
    # TODO: return only fitness scores of the fitest members of "last generation"
    return [last_generation[i] for i in saved_progeny_indices], [last_generation_fitness[i] for i in saved_progeny_indices]

def find_top_n_indices(list, n):
    top_n_indices = sorted(range(len(list)), key=lambda x: list[x])[-n:]
    return top_n_indices

def play_beat(beat, num_loops):
    # TODO: add ability to re-play beat
    stacked_beat = []
    try:
        for x in range(0, num_loops):
            beat_string = ""
            for i in range(0, note_subdivision):
                note_string = ""
                max_sound_length = 0
                #start_beat = datetime.now()
                #print("start beat " + str(start_beat))
                for j in range(0, num_sounds):
                    beat_index = i+ (note_subdivision - 1) * j
                    if beat[beat_index]:
                        loop = asyncio.get_event_loop()
                        task = loop.create_task(play_sound(sounds[j]))
                        loop.run_until_complete(task)
                        if(max_sound_length < sound_lengths[j]):
                            max_sound_length = sound_lengths[j]
                        note_string += sound_names[j]
                beat_string += note_string + " | "
                #print(str(max_sound_length) + " " + str(beat_length))
                time.sleep(beat_length)
                #end_beat = str(datetime.now()-start_beat)
                #print("end_beat " + end_beat)
            if x == 0:
                print(beat_string)
            print("loop number " + str(x+1) + " of " +str(num_loops))

    # TODO: fix KeyboardInterrupt
    except KeyboardInterrupt:
        print("interrupted")

#evolve num_generations
current_generation = create_inital_generation(sounds)
num_unscored_generations = 5
for x in range(0,num_generations+1):
    #mate pairs of members of current generation
    print("generation: " + str(x) + " of " + str(num_generations))
    if x % num_unscored_generations == 0:
        saved_progeny, last_generation_fitness = identify_fit_progeny(current_generation)
        current_generation = create_next_generation(saved_progeny,last_generation_fitness)
    else:
        current_generation = create_next_generation(current_generation,last_generation_fitness)


print("final generation")
num_members = 0
for beat in current_generation:
    num_members += 1
    print("member " + str(num_members) + " of " + str(len(current_generation)))
    play_beat(beat, 4)
