# cindr.musicPlayer.js
A plain-JavaScript, no-external-references, music-player-management library.
- [Setup and Basics](README.md#Setup-and-Basics)
- [Methods](README.md#Methods)
  - [Song](README.md#Song)
  - [Playlist](README.md#Playlist)
  - [Player](README.md#Player)
  - [Direct Access](README.md#Direct-Access)
- [Events](README.md#Events)
- [Controls](README.md#Controls)
- [Display](README.md#Display)

# Setup and Basics



# Methods


## Song


### cindrM.song.play
Plays the current song at the current time.

### cindrM.song.pause
Pauses the current song.

### cindrM.song.stop
Pauses the current song and resets the current time to zero.

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
Inserts the provided song at the specified (zero-based) index, pushing back any songs at or above the specified index.

### cindrM.playlist.remove(index)
Removes the song at the specified (zero-based) index and returns it.  If the removed song is the current song, the next song (if any) will start playing.

### cindrM.playlist.clear
Removes all songs from the playlist.

### cindrM.playlist.replace(songs)
Replaces the playlist with the provided playlist.

### cindrM.playlist.play
Plays the first song in the playlist.

### cindrM.playlist.seek(index)
Plays the song at the specified (zero-based) index.

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

