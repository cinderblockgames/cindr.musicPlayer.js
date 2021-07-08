/* global document */
/* global console */
/* global EventTarget */
/* global CustomEvent */

// Exposed entry point to the cindr music player.
const cindrM = new EventTarget();

// Private setup.
(function initialize(cindr) {

  //******************************
  // Basic tracking.
  //******************************

  const player = {
    audio: document.createElement('audio'),
    playing: false,

    volume: -1,
    muted: false,

    index: -1,
    playlist: [],
    shuffled: [],

    shuffle: false,
    repeat: 'none',

    monitoring: null
  };

  //******************************
  // Default functionality.
  //******************************

  // Continue playing through the playlist.
  player.audio.addEventListener('ended', () => {
    if (player.repeat == 'song') {
      cindr.playlist.seek(playlist.index);
    } else if (!player.shuffle && (player.index + 1) < player.playlist.length) {
      cindr.song.next();
    } else if (player.shuffle && (player.shuffled.indexOf(player.index) + 1) < player.shuffled.length) {
      cindr.song.next();
    } else if (player.repeat == 'playlist') {
      cindr.playlist.seek(0);
    } else {
      cindr.song.stop();
    }
  });

  // Preload songs.
  player.audio.setAttribute('preload', 'auto');

  // Promote audio events.
  player.audio.addEventListener('timeupdate', () => events.timeupdate());
  player.audio.addEventListener('progress', () => events.timeupdate());
  player.audio.addEventListener('loadedmetadata', () => events.timeupdate());
  player.audio.addEventListener('ended', () => events.end());

  // Track default volume.
  player.volume = player.audio.volume * 100;

  //******************************
  // Helper functions.
  //******************************

  const strict = {
    lt: function lt(left, right) {
      return ((typeof left === typeof right) && (left < right));
    },
    lte: function lte(left, right) {
      return ((typeof left === typeof right) && (left <= right));
    },
    gt: function gt(left, right) {
      return ((typeof left === typeof right) && (left > right));
    },
    gte: function gte(left, right) {
      return ((typeof left === typeof right) && (left >= right));
    }
  };

  const shuffler = {

    reset: function reset() {
      if (player.shuffle) {
        // Shuffle indexes.
        player.shuffled = [...Array(player.playlist.length).keys()].sort(() => Math.random() - 0.5);

        // Swap so the current song is the start of the list.
        const current = player.shuffled.indexOf(player.index);
        [player.shuffled[0], player.shuffled[current]] = [player.shuffled[current], player.shuffled[0]];
      } else {
        player.shuffled = [];
      }
    },

    next: function next() {
      const next = player.shuffled.indexOf(player.index) + 1;
      const index = next < player.shuffled.length ? next : 0;
      shuffler.play(index);
    },

    previous: function previous() {
      const current = player.shuffled.indexOf(player.index);
      const index = (current > 0 ? current : player.shuffled.length) - 1;
      shuffler.play(index);
    },

    // Helpers.

    play: function play(index) {
      const play = player.playing;

      player.index = player.shuffled[index];
      player.audio.pause();
      player.audio.currentTime = 0;
      player.audio.src = player.playlist[player.index].url;

      if (play) {
        player.audio.play();
      }

      events.songchange();

      if (play) {
        events.play();
      }
    }

  };

  const update = {

    songList: function songList(event) {
      const info = event.detail;
      while (player.monitoring.songList.firstChild) {
        player.monitoring.songList.removeChild(player.monitoring.songList.lastChild);
      }

      info.playlist.forEach((song, index) => {
        const node = player.monitoring.songListTemplate.cloneNode(true);
        node.id += '-' + index;
        update.song(
          node,
          { song: song, index: index, 'index-readable': index + 1 },
          { clean: true, current: index == info.index }
        );
        player.monitoring.songList.appendChild(node);
      });
    },

    currentSongInfo: function currentSongInfo(event) {
      const info = event.detail;
      update.song(document, info);

      if (player.monitoring) {
        const songs = player.monitoring.songList.querySelectorAll('[id*="cindrM-song-container-"]');
        for (let index = 0; index < songs.length; index++) {
          const node = songs[index];
          if (index == info.index) {
            node.classList.add('cindrM-current-song');
          } else {
            node.classList.remove('cindrM-current-song');
          }
        }
      }
    },

    currentTime: function currentTime(event) {
      const info = event.detail;
      update.meta(document, info);
    },

    playControl: function playControl() {
      document.querySelectorAll('[data-cindrM-control~="play"]')
        .forEach(node => node.classList.add('cindrM-playing'));

      ['pause', 'stop'].forEach(control => {
        document.querySelectorAll('[data-cindrM-control~="' + control + '"]')
          .forEach(node => node.classList.remove('cindrM-paused'));
      });
    },

    pauseControl: function pauseControl() {
      document.querySelectorAll('[data-cindrM-control~="play"]')
        .forEach(node => node.classList.remove('cindrM-playing'));

      ['pause', 'stop'].forEach(control => {
        document.querySelectorAll('[data-cindrM-control~="' + control + '"]')
          .forEach(node => node.classList.add('cindrM-paused'));
      });
    },

    shuffleControl: function shuffleControl(event) {
      const nodes = document.querySelectorAll('[data-cindrM-control~="shuffle"]');
      if (event.detail.shuffle) {
        nodes.forEach(node => node.classList.add('cindrM-shuffling'));
      } else {
        nodes.forEach(node => node.classList.remove('cindrM-shuffling'));
      }
    },

    repeatControl: function repeatControl(event) {
      const type = event.detail.repeat;
      const nodes = document.querySelectorAll('[data-cindrM-control~="repeat"]');
      if (type == 'none') {
        nodes.forEach(node => {
          node.classList.add('cindrM-repeating-none');
          node.classList.remove('cindrM-repeating-song');
          node.classList.remove('cindrM-repeating-playlist');
        });
      } else if (type == 'song') {
        nodes.forEach(node => {
          node.classList.remove('cindrM-repeating-none');
          node.classList.add('cindrM-repeating-song');
          node.classList.remove('cindrM-repeating-playlist');
        });
      } else if (type == 'playlist') {
        nodes.forEach(node => {
          node.classList.remove('cindrM-repeating-none');
          node.classList.remove('cindrM-repeating-song');
          node.classList.add('cindrM-repeating-playlist');
        });
      }
    },

    volumeControl: function volumeControl(event) {
      const nodes = document.querySelectorAll('[data-cindrM-control~="volume"]');
      nodes.forEach(node => update.node(node, event.detail.volume));
    },

    muteControl: function muteControl(event) {
      const nodes = document.querySelectorAll('[data-cindrM-control~="mute"]');
      if (event.detail.muted) {
        nodes.forEach(node => node.classList.add('cindrM-muted'));
      } else {
        nodes.forEach(node => node.classList.remove('cindrM-muted'));
      }
    },

    progressControl: function progressControl(event) {
      const info = event.detail;
      if (!Object.is(info.duration, NaN)) {
        const nodes = document.querySelectorAll('[data-cindrM-control~="progress"]');
        nodes.forEach(node => update.node(node, info.currentTime / info.duration));
      }
    },

    bufferControl: function bufferControl(event) {
      const info = event.detail;
      if (info.buffered.length > 0 && !Object.is(info.duration, NaN)) {
        const nodes = document.querySelectorAll('[data-cindrM-control~="buffer"]');
        nodes.forEach(node => update.node(node, info.buffered.end(info.buffered.length - 1) / info.duration));
      }
    },

    // Event helpers, not event handlers.

    song: function song(node, info, options) {
      options = options || { clean: false, current: false };

      const infoNodes = node.querySelectorAll('[data-cindrM-song-info]');
      infoNodes.forEach(node => {
        const data = node.getAttribute('data-cindrM-song-info');
        if (Object.keys(info.song).includes(data)) {
          update.node(node, info.song[data], options.clean);
        } else {
          output.warn('Ignoring invalid cindrM-song-info value request.', data);
        }
      });

      update.meta(node, info, options.clean);

      if (options.current) {
        node.classList.add('cindrM-current-song');
      }
    },

    meta: function meta(node, info, clean) {
      const metaNodes = node.querySelectorAll('[data-cindrM-song-meta]');
      metaNodes.forEach(node => {
        const data = node.getAttribute('data-cindrM-song-meta');
        if (Object.keys(info).filter(key => key != 'song').includes(data)) {
          // Skip when base value is NaN because otherwise there's a flicker as we update to an empty string and then fix it on the next tick.
          const index = data.indexOf('-readable'); // <--
          if (index == -1 || !Object.is(info[data.substring(0, index)], NaN)) { // <--
            update.node(node, info[data], clean);
          } // <--
        } else {
          output.warn('Ignoring invalid cindrM-song-meta value request.', data);
        }
      });
    },

    node: function node(node, value, clean) {
      if (['IMG'].includes(node.nodeName)) {
        node.src = value;
      } else if (['PROGRESS', 'INPUT'].includes(node.nodeName)) {
        node.value = value;
      } else if (node.firstChild) {
        node.firstChild.nodeValue = value;
      } else {
        node.textContent = value;
      }

      if (clean) {
        for (let index = node.attributes.length - 1; index >= 0; index--) {
          const attr = node.attributes[index].nodeName;
          if (['data-cindrM-song-info', 'data-cindrM-song-meta',
               'data-cindrm-song-info', 'data-cindrm-song-meta'].includes(attr)) {
            node.removeAttribute(attr);
          }
        }
      }
    },

  };

  const output = {
    warn: function warn(message, value) {
      console.warn(message + ' [(' + (typeof value) + ') ' + value + ']');
    },
    info: function info(message, value) {
      console.info(message + ' [(' + (typeof value) + ') ' + value + ']');
    }
  };

  const format = {
    time: function time(seconds) {
      if (!Object.is(seconds, NaN)) {
        // https://stackoverflow.com/a/5539081/128217
        const hr = Math.floor(seconds / 3600);
        const min = Math.floor(seconds % 3600 / 60);
        const sec = Math.floor(seconds % 3600 % 60);
        return hr > 0
          ? hr + ':' + ('0' + min).slice(-2) + ('0' + sec).slice(-2) // h:mm:ss
          : min + ':' + ('0' + sec).slice(-2); // m:ss
      }
    }
  };

  const build = {
    detail: function detail(options) {
      return { detail: options };
    },

    repeatOrder: function repeatOrder(options) {
      if (options && options.repeatOrder) {
        const valid = ['none', 'song', 'playlist'];
        const order = options.repeatOrder;
        const result = {};

        for (let index = 0; index < order.length; index++) {
          const value = order[index];
          if (valid.includes(value)) {
            if (result[value]) {
              output.warn('Repeated value provided in options.repeatOrder; using default repeat order instead.', value);
              return build.defaultRepeatOrder();
            } else {
              const next = (index + 1) < order.length ? (index + 1) : 0;
              result[value] = order[next];
            }
          } else {
            output.warn('Invalid value provided in options.repeatOrder; using default repeat order instead.', value);
            return build.defaultRepeatOrder();
          }
        };

        return result;
      } else {
        return build.defaultRepeatOrder();
      }
    },

    defaultRepeatOrder: function defaultRepeatOrder() {
      return {
        'none'    : 'song',
        'song'    : 'playlist',
        'playlist': 'none'
      };
    }
  };

  //******************************
  // Events.
  //******************************

  const events = {
    raise: function raise(eventType, detail) {
      cindr.dispatchEvent(
        new CustomEvent(eventType, detail)
      );
    },
  
    // https://www.sitepoint.com/essential-audio-and-video-events-for-html5/

    play:           () => events.raise('play'                                          ),
    pause:          () => events.raise('pause'                                         ),
    end:            () => events.raise('end'                                           ),
    timeupdate:     () => events.raise('timeupdate'    , events.detail.timeupdate()    ),
    songchange:     () => events.raise('songchange'    , events.detail.songchange()    ),
    playlistchange: () => events.raise('playlistchange', events.detail.playlistchange()),
    shufflechange:  () => events.raise('shufflechange' , events.detail.shufflechange() ),
    repeatchange:   () => events.raise('repeatchange'  , events.detail.repeatchange()  ),
    volumechange:   () => events.raise('volumechange'  , events.detail.volumechange()  )
  };

  events.detail = {
    timeupdate: function timeupdate() {
      return build.detail({
        currentTime           : player.audio.currentTime,
        'currentTime-readable': format.time(player.audio.currentTime),
        duration              : player.audio.duration,
        'duration-readable'   : format.time(player.audio.duration),
        buffered              : player.audio.buffered
      });
    },

    songchange: function songchange() {
      return build.detail({
        song                  : player.playlist[player.index],
        index                 : player.index,
        'index-readable'      : player.index + 1,
        currentTime           : player.audio.currentTime,
        'currentTime-readable': format.time(player.audio.currentTime),
        duration              : player.audio.duration,
        'duration-readable'   : format.time(player.audio.duration)
      });
    },

    playlistchange: function playlistchange() {
      return build.detail({
        playlist        : player.playlist,
        index           : player.index,
        'index-readable': player.index + 1
      });
    },

    shufflechange: function shufflechange() {
      return build.detail({
        shuffle: player.shuffle
      });
    },

    repeatchange: function repeatchange() {
      return build.detail({
        repeat: player.repeat
      });
    },

    volumechange: function volumechange() {
      return build.detail({
        volume: player.volume,
        muted : player.muted
      });
    }
  };

  //******************************
  // Public interface.
  //******************************

  // Song functions.
  cindr.song = {

    play: function play() {
      if (player.playlist.length == 0) {
        output.warn('Playlist empty; ignoring call to song.play().');
      } else if (player.playing) {
        output.info('Already playing; ignoring call to song.play().');
      } else {
        if (player.index > -1) {
          player.audio.play();
          player.playing = true;
          events.play();
        } else {
          cindr.playlist.play();
        }
      }
    },

    pause: function pause() {
      if (player.playlist.length == 0) {
        output.warn('Playlist empty; ignoring call to song.pause().');
      } else if (!player.playing) {
        output.info('Already paused; ignoring call to song.pause().');
      } else {
        player.audio.pause();
        player.playing = false;
        events.pause();
      }
    },

    stop: function stop() {
      if (player.playlist.length == 0) {
        output.warn('Playlist empty; ignoring call to song.stop().');
      } else if (!player.playing) {
        if (player.audio.currentTime == 0) {
          output.info('Already stopped; ignoring call to song.stop().');
        } else {
          player.audio.currentTime = 0;
        }
      } else {
        cindr.song.pause();
        player.audio.currentTime = 0;
      }
    },

    next: function next() {
      if (player.playlist.length == 0) {
        output.warn('Playlist empty; ignoring call to song.next().');
      } else {
        if (player.shuffle) {
          shuffler.next();
        } else if ((player.index + 1) < player.playlist.length) {
          cindr.playlist.seek(player.index + 1);
        } else {
          cindr.playlist.seek(0);
        }
      }
    },

    previous: function previous() {
      if (player.playlist.length == 0) {
        output.warn('Playlist empty; ignoring call to song.previous().');
      } else {
        if (player.audio.currentTime > 2 && player.audio.duration > 2) {
          // If we're over two seconds into the song, start it over.
          player.audio.currentTime = 0;
        } else if (player.shuffle) {
          shuffler.previous();
        } else if (player.index > 0) {
          cindr.playlist.seek(player.index - 1);
        } else {
          cindr.playlist.seek(player.playlist.length - 1);
        }
      }
    },

    seekPercent: function seekPercent(percent) {
      if (player.playlist.length >= 0) {
        if (strict.gte(percent, 0) && strict.lte(percent, 100)) {
          player.audio.currentTime = player.audio.duration * (percent / 100);
        } else {
          output.warn('Ignoring invalid value sent to song.seekPercent(percent).', percent);
        }
      } else {
        output.warn('Playlist empty; ignoring call to song.seekPercent().');
      }
    },

    seekTime: function seekTime(seconds) {
      if (player.playlist.length >= 0) {
        if (strict.gte(seconds, 0) && strict.lte(seconds, player.audio.duration)) {
          player.audio.currentTime = seconds;
        } else {
          output.warn('Ignoring invalid value sent to song.seekTime(seconds).', seconds);
        }
      } else {
        output.warn('Playlist empty; ignoring call to song.seekTime().');
      }
    }

  };

  // Playlist functions.
  cindr.playlist = {

    add: function add(song) {
      player.playlist.push(song);
      if (player.index == -1) {
        player.index = 0;
        player.audio.src = player.playlist[player.index].url;
        events.songchange();
      }

      shuffler.reset();
      events.playlistchange();
    },

    insert: function insert(index, song) {
      if (strict.gte(index, 0) && strict.lte(index, player.playlist.length)) {
        if (index == player.playlist.length) {
          cindr.playlist.add(song);
        } else {
          if (index <= player.index) {
            player.index++;
          }
          player.playlist.splice(index, 0, song);

          shuffler.reset();
          events.playlistchange();
        }
      } else {
        output.warn('Ignoring invalid value sent to playlist.insert(index, song).', index);
      }
    },

    remove: function remove(index) {
      if (strict.gte(index, 0) && strict.lt(index, player.playlist.length)) {
        let removed = null;
        if (index < player.index) {
          removed = player.playlist.splice(index, 1);
          player.index--;
        } else if (index == player.index) {
          if ((player.index + 1) < player.playlist.length) {
            removed = player.playlist.splice(index, 1);
            cindr.playlist.seek(player.index);
          } else {
            if (player.playing) {
              cindr.song.stop();
            }
            removed = player.playlist.splice(index, 1);
            player.index--;
          }
        } else { // if (index > player.index)
          removed = player.playlist.splice(index, 1);
        }

        shuffler.reset();
        events.playlistchange();
        return removed[0];
      } else {
        output.warn('Ignoring invalid value sent to playlist.remove(index).', index);
      }
    },

    clear: function clear() {
      if (player.playlist.length > 0) {
        cindr.playlist.replace([]);
      }
    },

    replace: function replace(songs) {
      if (player.playing) {
        player.song.stop();
      }

      if (songs.length > 0) {
        player.index = 0;
        player.playlist = songs;
        player.audio.src = player.playlist[player.index].url;
        events.songchange();
      } else {
        player.index = -1;
        player.playlist = [];
        player.audio.src = null;
      }

      shuffler.reset();
      events.playlistchange();
    },

    play: function play() {
      if (player.playlist.length > 0) {
        player.playing = true; // Set to true before calling seek so that seek plays the song.
        cindr.playlist.seek(0);
      } else {
        output.warn('Playlist empty; ignoring call to playlist.play().');
      }
    },

    seek: function seek(index) {
      if (strict.gte(index, 0) && strict.lt(index, player.playlist.length)) {
        const play = player.playing;

        player.index = index;
        player.audio.pause();
        player.audio.currentTime = 0;
        player.audio.src = player.playlist[player.index].url;

        if (play) {
          player.audio.play();
        }

        shuffler.reset();
        events.songchange();

        if (play) {
          events.play();
        }
      } else {
        output.warn('Ignoring invalid value sent to playlist.seek(index).', index);
      }
    }

  };

  // Player options.
  cindr.player = {

    volume: function volume(volume) {
      if (strict.gte(volume, 0) && strict.lte(volume, 100)) {
        if (player.muted || (volume != player.volume)) {
          player.volume = volume;
          player.audio.volume = (player.volume / 100);
          events.volumechange();
        }
      } else {
        output.info('No valid value sent to player.volume(volume); returning current volume.', volume);
        return player.volume;
      }
    },

    mute: function mute(mute) {
      if (mute === true || mute === false) {
        if (mute != player.muted) {
          player.muted = mute;
          player.audio.volume = player.muted ? 0 : (player.volume / 100);
          events.volumechange();
        }
      } else {
        output.info('No valid value sent to player.mute(mute); returning current mute state.', mute);
        return player.muted;
      }
    },

    shuffle: function shuffle(shuffle) {
      if (shuffle === true || shuffle === false) {
        if (shuffle != player.shuffle) {
          player.shuffle = shuffle;
          shuffler.reset();
          events.shufflechange();
        }
      } else {
        output.info('No valid value sent to player.shuffle(shuffle); returning current shuffle state.', shuffle);
        return player.shuffle;
      }
    },

    repeat: function repeat(value) {
      if (value === 'none' || value === 'song' || value === 'playlist') {
        if (value != player.repeat) {
          player.repeat = value;
          events.repeatchange();
        }
      } else {
        output.info('No valid value sent to player.repeat(value); returning current repeat type.', value);
        return player.repeat;
      }
    }

  };

  // UI management.
  cindr.ui = {
    monitor: function monitor(options) {
      // Find and track the song list container, if there is one.
      const list = document.getElementById('cindrM-song-list-container');
      if (list) {
        // Pull out the song container, if there is one.
        const song = document.getElementById('cindrM-song-container');
        if (song) {
          player.monitoring = {
            songList: list,
            songListTemplate: song.parentElement.removeChild(song)
          };
          cindr.addEventListener('playlistchange', update.songList);
          if (player.playlist.length > 0) {
            update.songList(events.detail.playlistchange()); // Set UI.
          }
        }
      }

      // Track the current song info, if there are any elements that use it.
      if (document.querySelector('[data-cindrM-song-info]') || document.querySelector('[data-cindrM-song-meta]')) {
        cindr.addEventListener('songchange', update.currentSongInfo);
        if (player.index > -1) {
          update.currentSongInfo(events.detail.songchange()); // Set UI.
        }
      }
      if (document.querySelector('[data-cindrM-song-meta]')) {
        cindr.addEventListener('timeupdate', update.currentTime);
        update.currentTime(events.detail.timeupdate());
      }

      // Track controls for managing the player.
      if (document.querySelector('[data-cindrM-control]')) {
        // play
        document.querySelectorAll('[data-cindrM-control~="play"]').forEach(node =>
          node.addEventListener('click', cindr.song.play)
        );
        cindr.addEventListener('play', update.playControl);

        // pause
        document.querySelectorAll('[data-cindrM-control~="pause"]').forEach(node =>
          node.addEventListener('click', cindr.song.pause)
        );
        cindr.addEventListener('pause', update.pauseControl);
        update.pauseControl(); // Set UI.

        // stop
        document.querySelectorAll('[data-cindrM-control~="stop"]').forEach(node =>
          node.addEventListener('click', cindr.song.stop)
        );

        // next
        document.querySelectorAll('[data-cindrM-control~="next"]').forEach(node =>
          node.addEventListener('click', cindr.song.next)
        );

        // previous
        document.querySelectorAll('[data-cindrM-control~="previous"]').forEach(node =>
          node.addEventListener('click', cindr.song.previous)
        );

        // shuffle
        document.querySelectorAll('[data-cindrM-control~="shuffle"]').forEach(node =>
          node.addEventListener('click', function click() {
            cindr.player.shuffle(!player.shuffle);
          })
        );
        cindr.addEventListener('shufflechange', update.shuffleControl);

        // repeat
        const nextRepeat = build.repeatOrder(options);
        player.repeat = Object.keys(nextRepeat)[0]; // The first key is the default.
        document.querySelectorAll('[data-cindrM-control~="repeat"]').forEach(node =>
          node.addEventListener('click', function click() {
            cindr.player.repeat(nextRepeat[player.repeat]);
          })
        );
        cindr.addEventListener('repeatchange', update.repeatControl);
        update.repeatControl(events.detail.repeatchange()); // Set UI.

        // volume
        document.querySelectorAll('[data-cindrM-control~="volume"]').forEach(node => {
          const update = function update() {
            cindr.player.mute(false);
            cindr.player.volume(parseFloat(this.value));
          };
          node.addEventListener('mousedown', update); // Respond to the initial click on the control.
          node.addEventListener('input', update); // Respond to the value as the user updates the control.
          node.addEventListener('change', update); // Respond to the final value when the user stops updating the control.
        });
        cindr.addEventListener('volumechange', update.volumeControl);
        update.volumeControl(events.detail.volumechange()); // Set UI.

        // mute
        document.querySelectorAll('[data-cindrM-control~="mute"]').forEach(node =>
          node.addEventListener('click', function click() {
            cindr.player.mute(!player.muted);
          })
        );
        cindr.addEventListener('volumechange', update.muteControl);

        // progress
        cindr.addEventListener('timeupdate', update.progressControl);

        // seek
        document.querySelectorAll('[data-cindrM-control~="seek"]').forEach(node =>
          node.addEventListener('click', function click(event) {
            const wide = this.offsetWidth > this.offsetHeight;
            let progress = null;
            if (wide) {
              const location = event.pageX - this.getBoundingClientRect().left;
              const width = this.offsetWidth;
              progress = location / width;
            } else {
              const location = event.pageY - this.getBoundingClientRect().top;
              const height = this.offsetHeight;
              progress = location / height;
            }
            cindr.song.seekPercent(progress * 100);
          })
        );

        // buffer
        cindr.addEventListener('timeupdate', update.bufferControl);
      }
    }
  };

  // Direct access.
  cindr.getInternals = () => player;

})(cindrM);
