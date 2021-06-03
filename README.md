# cindr.musicPlayer.js
A plain-JavaScript, no-external-references, music-player-management library.

# Methods


## Song


### cindrM.song.play
Plays the current song at the current time.

### cindrM.song.pause
Pauses the current song.

### cindrM.song.stop
Pauses the current song and resets the current time to 0.

### cindrM.song.next
Plays the next song in the playlist, cycling back to the beginning of the playlist if the current song is the last song in the playlist.

### cindrM.song.previous
Plays the previous song in the playlist, cycling back to the end of the playlist if the current song is the first song in the playlist.

### cindrM.song.seekPercent(percent)
Sets the current time of the current song at the specified percent through the song.  Does not start the song playing if it is currently paused.

### cindrM.song.seekTime(time)
Sets the current time of the current song.  Does not start the song playing if it is currently paused.

## Playlist


### cindrM.playlist.add(song)
Adds the provided song to the end of the playlist.

### cindrM.playlist.insert(index, song)
Inserts the provided song at the specified (0-based) index, pushing back any songs at or above the specified index.

### cindrM.playlist.remove(index)
Removes the song at the 

### cindrM.playlist.clear


### cindrM.playlist.replace


### cindrM.playlist.play


### cindrM.playlist.seek


## Player


### cindrM.player.volume


### cindrM.player.mute


### cindrM.player.shuffle


### cindrM.player.repeat


## UI Management


### cindrM.ui.monitor


## Direct Access


### cindrM.getInternals
(internals, including the audio player object) (making changes to the returned object is unsupported and can result in unpredictable behavior)

# Events
### play
### pause
### end
### timeupdate
### songchange
### playlistchange
### shufflechange
### repeatchange
### volumechange

# Controls
### play
### pause
### stop
### next
### previous
### shuffle
### repeat
### volume
### mute
### progress
### seek
### buffer

# Display


## data-cindrM-song-info


## data-cindrM-song-meta

