# cindr.musicPlayer.js
A plain-JavaScript, no-external-references, music-player-management library, a demo of which can be found at https://music.cindr.media.

- [Setup and Basics](README.md#Setup-and-Basics)
- [Methods](README.md#Methods)
  - [Song](README.md#Song)
    - [Play](README.md#cindrmsongplay)
    - [Pause](README.md#cindrmsongpause)
    - [Stop](README.md#cindrmsongstop)
    - [Next](README.md#cindrmsongnext)
    - [Previous](README.md#cindrmsongprevious)
    - [Seek (Percent)](README.md#cindrmsongseekpercentpercent)
    - [Seek (Time)](README.md#cindrmsongseektimetime)
  - [Playlist](README.md#Playlist)
    - [Add Song](README.md#cindrmplaylistaddsong)
    - [Insert Song](README.md#cindrmplaylistinsertindex-song)
    - [Remove Song](README.md#cindrmplaylistremoveindex)
    - [Clear Playlist](README.md#cindrmplaylistclear)
    - [Replace Playlist](README.md#cindrmplaylistreplacesongs)
    - [Play From Beginning](README.md#cindrmplaylistplay)
    - [Play At Index](README.md#cindrmplaylistseekindex)
  - [Player](README.md#Player)
    - [Get/Set Volume](README.md#cindrmplayervolumevolume)
    - [Mute/Unmute](README.md#cindrmplayermutemute)
    - [Shuffle](README.md#cindrmplayershuffleshuffle)
    - [Repeat One/All](README.md#cindrmplayerrepeatvalue)
  - [UI Management](README.md#ui-management)
    - [Monitor UI](README.md#cindrmuimonitor)
  - [Direct Access](README.md#Direct-Access)
    - [Get Internals](README.md#cindrmgetinternals)
- [Events](README.md#Events)
  - [play](README.md#play)
  - [pause](README.md#pause)
  - [end](README.md#end)
  - [timeupdate](README.md#timeupdate)
  - [songchange](README.md#songchange)
  - [playlistchange](README.md#playlistchange)
  - [shufflechange](README.md#shufflechange)
  - [repeatchange](README.md#repeatchange)
  - [volumechange](README.md#volumechange)
- [Controls](README.md#Controls)
  - [Play](README.md#play-1)
  - [Pause](README.md#pause-1)
  - [Stop](README.md#stop)
  - [Next](README.md#next)
  - [Previous](README.md#previous)
  - [Shuffle](README.md#shuffle)
  - [Repeat](README.md#repeat)
  - [Volume](README.md#volume)
  - [Mute](README.md#mute)
  - [Progress](README.md#progress)
  - [Seek](README.md#seek)
  - [Buffer](README.md#buffer)
- [Display](README.md#Display)
  - [Song Info](README.md#song-info)
  - [Song Meta](README.md#song-meta)
  - [Song List](README.md#song-list)


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
Replaces the playlist with the provided set of songs.

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
If the library is [managing your UI for you](README.md#ui-management), you can tell it where to output certain values by adding the **data-cindrM-song-info** and **data-cindrM-song-meta** attributes to your controls, and you can also have it manage your song list display.

## Song Info
All properties in your song object are available to your UI through the **data-cindrM-song-info** attribute.  For example, if you define a song like this:

    {
      'album' : 'Metallica',
      'art'   : '/music/Metallica/Metallica/album-cover-art.png'
      'artist': 'Metallica',
      'name'  : 'Wherever I May Roam',
      'url'   : '/music/Metallica/Metallica/Wherever I May Roam.mp3'
    }

You could access all of the properties using the **data-cindrM-song-info** attribute:

    <img data-cindrM-song-info="art" />
    
    Now Playing:
    <span data-cindrM-song-info="name"></span>
    by <span data-cindrM-song-info="artist"></span>
    (off their <span data-cindrM-song-info="album"></span> album).

All properties are available outside your [song list](README.md#song-list), where they will refer to the current song, as well as inside your [song list](README.md#song-list), where they will refer to the song at that position in the playlist.

## Song Meta

Additional information about songs is available to your UI through the **data-cindrM-song-meta** attribute.  The following values are supported:

- **index**: The (zero-based) index of the song.
- **index-readable**: The (one-based) index of the  song.
- **currentTime**: The playback position of the song, in seconds.
- **currentTime-readable**: The playback position of the song, formatted to be human readable.
- **duration**: The duration of the song, in seconds.
- **duration-readable**: The duration of the song, formatted to be human readable.

For example, you could display the play progress of the current song like this:

    <span data-cindrM-song-meta="currentTime-readable"></span> / <span data-cindrM-song-meta="duration-readable"></span>

All properties are available outside your [song list](README.md#song-list), where they will refer to the current song, but only the **index** and **index-readable** properties are available inside your [song list](README.md#song-list), where they will refer to the song at that position in the playlist.

## Song List

In order to manage your song list display, the library looks for two specific elements: one with ID **cindrM-song-list-container** and the other with ID **cindrM-song-container**.  **cindrM-song-list-container** defines the container that holds your song list, and **cindrM-song-container** defines the format of each song in that list.

For example:

    <div class="list-container disable-text-selection" id="cindrM-song-list-container">
      <div class="song" id="cindrM-song-container">
        <span class="remove-song">&times;</span>
        
        <span class="index">
          <span class="song-index" data-cindrM-song-meta="index-readable"></span>
        </span>
        
        <span class="info">
          <span class="ellipsis" data-cindrM-song-info="name"></span>
          <span class="ellipsis" data-cindrM-song-info="album"></span>
        </span>
        
        <span class="duration">
          <span data-cindrM-song-info="duration"></span>
        </span>
      </div>
    </div>

The **cindrM-song-container** will be repeated for every song in the playlist and placed inside the **cindrM-song-list-container**.  The repeated elements will have their index appended to their ID, so the element for the first song will be **id="cindrM-song-container-0"**.
