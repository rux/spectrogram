spectrogram
===========

A simple scrolling spectrogram app for spotify.


installation
------------

 * On a Mac clone/copy the spectrogram directory into a ~/Spotify/spectrogram/ directory
 * On Windows clone/copy the spectrogram directory into a "My Documents\Spotify\spectrogram\" directory.

You should then be able to type "spotify:app:spectrogram" into the search bar.


use
---

The only control currently is clicking anywhere on the window, and it will cycle through different palletes that exist in the code.  It is super easy to add new ones, should you have a favourite colour scheme.  Just edit the spectroscope.js file.  Around line 50 you will see some lines that read "gradient.push ( ... )".  Just copy one of those lines and change the list of colours and a new scheme will be available next time you start the spectrogram.


TODO
----

It's not the standard western way of presenting a spectrogram, but I want to have a vertical-scroll mode that will better represent the left-right split of noise.  Top/bottom is just odd for a left/right medium, yet it's still the convention.  Bloody silly if you ask me.
