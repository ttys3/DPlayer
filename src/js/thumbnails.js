class Thumbnails {
    constructor (options) {
        this.container = options.container;
        this.barWidth = options.barWidth;
        this.container.style.backgroundImage = `url('${options.url}')`;
        this.apiURL = options.url;
        this.events = options.events;
    }

    resize (width, height, barWrapWidth) {
        this.container.style.width = `${width}px`;
        this.container.style.height = `${height}px`;
        this.container.style.top = `${-height + 2}px`;
        this.barWidth = barWrapWidth;
    }

    show () {
        this.container.style.display = 'block';
        this.events && this.events.trigger('thumbnails_show');
    }

    move (time, position) {
        const timeInt = Math.floor(parseInt(time) / 30) * 30;
        // console.log('time: %d, time new: %d, pos: %d', time, timeInt, position);
        this.container.style.backgroundImage = `url('${this.apiURL}&t=${timeInt}&w=160')`;
        this.container.style.left = `${Math.min(Math.max(position - this.container.offsetWidth / 2, -10), this.barWidth - 150)}px`;
    }

    hide () {
        this.container.style.display = 'none';

        this.events && this.events.trigger('thumbnails_hide');
    }
}

export default Thumbnails;
