/**
 * https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/mode
 * textTrack.mode = "disabled" | "hidden" | "showing";
 * Safari additionally requires the default boolean attribute to be set to true
 * when implementing your own video player controls in order for the subtitles cues to be shown.
 *
 * The default mode is disabled, unless the default Boolean attribute is specified,
 * in which case the default mode is showing. When a text track is loaded in the disabled state,
 * the corresponding WebVTT file is not loaded until the state changes to either showing or hidden.
 */
class Subtitle {
    constructor (container, video, options, events) {
        this.container = container;
        this.video = video;
        this.options = options;
        this.events = events;

        this.init();
    }

    init () {
        this.container.style.fontSize = this.options.fontSize;
        this.container.style.bottom = this.options.bottom;
        this.container.style.color = this.options.color;

        // init default track
        // if (this.video.textTracks && this.video.textTracks[0]) {
        //     this.switch(0);
        // }
    }

    onCuechangeHandle (e) {
        // console.log('oncuechange event fired: track label: %s', e.target.label);
        const cue = e.target.activeCues[0];
        this.container.innerHTML = '';
        if (cue) {
            const template = document.createElement('div');
            template.appendChild(cue.getCueAsHTML());
            const trackHtml = template.innerHTML.split(/\r?\n/).map((item) => `<p>${item}</p>`).join('');
            this.container.innerHTML = trackHtml;
        }
        this.events.trigger('subtitle_change');
    }

    switch (index) {
        index = typeof index === 'string' ? parseInt(index) : index;
        const track = this.video.textTracks[index];
        console.log('vtt: switching to track index: %d', index);
        // disabled prev
        if (this.textTrackIndex !== undefined && this.textTrackIndex >= 0) {
            this.prevTextTrack = this.video.textTracks[this.textTrackIndex];
            this.prevTextTrack.removeEventListener('cuechange', this.onCuechangeHandle);
            this.prevTextTrack.mode = 'disabled';
            // console.log('remove old event for index: %d', this.textTrackIndex);
        }
        this.textTrackIndex = index;
        // show the subtitle
        track.mode = 'showing';
        track.addEventListener('cuechange', this.onCuechangeHandle.bind(this));
        this.show();
    }

    show () {
        this.container.classList.remove('dplayer-subtitle-hide');
        this.events.trigger('subtitle_show');
    }

    hide () {
        this.container.classList.add('dplayer-subtitle-hide');
        this.events.trigger('subtitle_hide');
    }

    toggle () {
        if (this.container.classList.contains('dplayer-subtitle-hide')) {
            this.show();
        }
        else {
            this.hide();
        }
    }

    destroy () {
        for (const track of this.video.textTracks) {
            if (track.mode === 'showing') {
                track.removeEventListener('cuechange', this.onCuechangeHandle);
                track.mode = 'disabled';
            }
        }
        this.video.querySelectorAll('track').forEach((tr) => tr.remove());
    }
}

export default Subtitle;
