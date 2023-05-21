function Point(p1, p2) {
	if (p2 == null) {
        if (p1 == null) {
            this.x = this.y = 0;
        } else {
            this.x = p1.x == null ? 0 : p1.x;
            this.y = p1.y == null ? 0 : p1.y;
        }
    } else {
        this.x = p1 == null ? 0 : p1;
        this.y = p2 == null ? 0 : p2;
    }
}

Point.prototype.middle = function() {
    this.x = Math.floor(this.x) + 0.5;
    this.y = Math.floor(this.y) + 0.5;
}

Point.prototype.add = function(p1, p2) {
    if (p1 == null) {
        if (p2 != null) this.y += p2;   
    } else {
        if (p2 == null) {
            this.x += p1.x;
            this.y += p1.y;
        } else {
            this.x += p1;
            this.y += p2;
        }
    }
};

Point.prototype.addDirection = function(direction, distance) {
    if (direction != null && distance != null) {
        switch (direction) {
            case Direction.UP:
                this.y -= distance;
                break;
            case Direction.DOWN:
                this.y += distance;
                break;
            case Direction.LEFT:
                this.x -= distance;
                break;
            case Direction.RIGHT:
                this.x += distance;
                break;
        }
    }
};

Point.prototype.getPosition = function(event, canvas) {
    if (event != null && canvas != null) {
        var rect = canvas.getBoundingClientRect();
        if (event.x != undefined && event.y != undefined) {
            this.x = event.x;
            this.y = event.y;
        } else { // Firefox
            this.x = event.clientX/* + document.body.scrollLeft + document.documentElement.scrollLeft*/;
            this.y = event.clientY/* + document.body.scrollTop + document.documentElement.scrollTop*/;
        }
        this.x -= rect.left;
        this.y -= rect.top;
        return this;
    } else {
        return null;   
    }
};

Point.prototype.adjust = function(direction, alignOnly) {
    switch (direction) {
        case Direction.UP:
            var old = this.y;
            this.x = Math.floor(this.x) + 0.5;
            if (!alignOnly) this.y = Math.max(this.y, Math.floor(this.y) + 0.5);
            return old != this.y;
        case Direction.DOWN:
            var old = this.y;
            this.x = Math.floor(this.x) + 0.5;
            if (!alignOnly) this.y = Math.min(this.y, Math.floor(this.y) + 0.5);
            return old != this.y;
        case Direction.LEFT:
            var old = this.x;
            if (!alignOnly) this.x = Math.max(this.x, Math.floor(this.x) + 0.5);
            this.y = Math.floor(this.y) + 0.5;
            return old != this.x;
        case Direction.RIGHT:
            var old = this.x;
            if (!alignOnly) this.x = Math.min(this.x, Math.floor(this.x) + 0.5);
            this.y = Math.floor(this.y) + 0.5;
            return old != this.x;
    }
    return false;
}

Point.prototype.increment = function(direction) {
    if (direction != null) {
        if (BU.contains(direction, Direction.LEFT)) this.x--;
        if (BU.contains(direction, Direction.RIGHT)) this.x++;
        if (BU.contains(direction, Direction.UP)) this.y--;
        if (BU.contains(direction, Direction.DOWN)) this.y++;
    }
};

Point.prototype.distanceToMiddle = function(direction) {
    if (direction != null && direction != Direction.NONE) {
        if (BU.contains(direction, Direction.LEFT)) return this.x - Math.floor(this.x) - 0.5;
        else if (BU.contains(direction, Direction.RIGHT)) return Math.floor(this.x) + 0.5 - this.x;
        else if (BU.contains(direction, Direction.UP)) return this.y - Math.floor(this.y) - 0.5;
        else if (BU.contains(direction, Direction.DOWN)) return Math.floor(this.y) + 0.5 - this.y;
    } else {
        return 0;   
    }
};

Point.prototype.equals = function(p) {
    return p != null && this.x == p.x && this.y == p.y;
};

Point.prototype.distanceNoSqrt = function(p) {
    if (p != null) {
        var dx = this.x - p.x;
        var dy = this.y - p.y;
        return dx * dx + dy * dy;
    } else {
        return 0;
    }
}

Point.prototype.distance = function(p) {
    return Math.sqrt(this.distanceNoSqrt(p));
}