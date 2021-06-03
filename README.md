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


You can see a demo of this library at https://music.cindr.media.


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
*Valid values: [0, 100]*

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


### cindrM.player.volume(volume)
*Valid values: [0, 100]*

If volume is provided, sets the player volume level to the provided value.  If volume is not provided, returns the current volume level.

### cindrM.player.mute(mute)
*Valid values: true, false*

If mute is provided, mutes or unmutes the player.  If mute is not provided, returns the current mute state.

### cindrM.player.shuffle(shuffle)
*Valid values: true, false*

If shuffle is provided, shuffles or unshuffles the playlist.  If shuffle is not provided, returns the current shuffle state.

### cindrM.player.repeat(value)
*Valid values: none, song, playlist*

If value is provided, sets the repeat type to the provided value.  If value is not provided, returns the current repeat type.


## UI Management


### cindrM.ui.monitor
Enables management of the DOM for automated updates.  See [Controls](README.md#Controls) and [Display](README.md#Display) for information on how to set up your HTML to take advantage of this feature.

**NOTE:  Controls must be loaded into the DOM before this method is called in order for them to be managed by the library.**  All this method does is add the necessary event listeners.


## Direct Access


### cindrM.getInternals
Returns the internal tracking object used by cindr.musicPlayer.js.  If you need direct access to the audio element, you can find it by calling **cindrM.getInternals().audio**.

**NOTE:  Making changes to the internal tracking object is unsupported and can result in unpredictable behavior.**


# Events
Event listeners can be added for the below events by using the plain JavaScript method [**cindrM.addEventListener()**](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) or the jQuery method [**$(cindrM).on()**](https://api.jquery.com/on/).  Any custom data is provided in the [detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) property.

### play
This event is raised when a song starts playing.

### pause
This event is raised when a song is paused.

### end
This event is raised when a song completes playing.

### timeupdate
This event is raised when the playback position of a song is updated, when the load progress of a song is updated, and when the metadata for a song is loaded.  The following custom data is provided:

- **currentTime**: The playback position of the song, in seconds.
- **currentTime-readable**: The playback position of the song, formatted to be human readable.
- **duration**: The duration of the song, in seconds.
- **duration-readable**: The duration of the song, formatted to be human readable.
- **buffered**: The collection of time ranges that have been [buffered](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/buffering_seeking_time_ranges) for the song.

### songchange
This event is raised when the current song changes.  The following custom data is provided:

- **song**: The new current song.
- **index**: The (zero-based) index of the new current song.
- **index-readable**: The (one-based) index of the new current song.
- **currentTime**: The playback position of the song, in seconds.
- **currentTime-readable**: The playback position of the song, formatted to be human readable.
- **duration**: The duration of the song, in seconds.
- **duration-readable**: The duration of the song, formatted to be human readable.

### playlistchange
This event is raised when the set of songs in the playlist changes.  The following custom data is provided:

- **playlist**: The new set of songs in the playlist.
- **index**: The (zero-based) index of the current song.
- **index-readable**: The (one-based) index of the current song.

### shufflechange
This event is raised when the shuffle state of the player changes.  The following custom data is provided:

- **shuffle**: The new [shuffle state](README.md#cindrmplayershuffleshuffle) of the player.

### repeatchange
This event is raised when the shuffle type of the player changes.  The following custom data is provided:

- **repeat**: The new [repeat type](README.md#cindrmplayerrepeatvalue) of the player.

### volumechange
This event is raised when the volume level or mute state of the player changes.  The following custom data is provided:

- **volume**: The new [volume level](README.md#cindrmplayervolumevolume) of the player.
- **muted**: The new [mute state](README.md#cindrmplayermutemute) of the player.

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

