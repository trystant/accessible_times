$(function () {
           //Find the audio control on the page
           var audio = document.getElementById('ctrlaudio');
           //songNames holds the comma separated name of songs
           var songNames = "http://grandkru.com/song1.mp3,http://grandkru.com/song2.mp3,http://grandkru.com/song3.mp3,http://grandkru.com/song4.mp3"
           var lstsongNames = songNames.split(',');
           var curPlaying = 0;
           // Attaches an event ended and it gets fired when current playing song get ended
           audio.addEventListener('ended', function() {
               var urls = audio.getElementsByTagName('source');
               // Checks whether last song is already run
               if (urls[0].src.indexOf(lstsongNames[lstsongNames.length - 1]) == -1) {
                   //replaces the src of audio song to the next song from the list
                   urls[0].src = urls[0].src.replace(lstsongNames[curPlaying], lstsongNames[++curPlaying]);
                   //Loads the audio song
                   audio.load();
                   //Plays the audio song
                   audio.play();
                   }
           });
       });