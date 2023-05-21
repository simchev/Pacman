function drawArc(context, x0, y0, x1, y1, x2, y2, radius) {
    if (context != null) {
        context.beginPath();
        context.moveTo(x0, y0);
        context.arcTo(x1, y1, x2, y2, radius);
        context.stroke();
    }
}

function clearRect(context, fillStyle, width, height) {
    if (context != null) {
		context.fillStyle = fillStyle;
		context.fillRect(0, 0, width, height);
    }
}

function drawCircle(context, x, y, radius, angle1, angle2, counterClock, fillStyle) {
	if (context != null) {
		if (fillStyle != null) context.fillStyle = fillStyle;
		context.beginPath();
		context.moveTo(x, y);
		context.arc(x, y, radius, angle1, angle2, counterClock);
        context.closePath();
		context.fill();
	}
}
    
function drawEye(context, x, y, radius, direction, fillStyle1, fillStyle2) {
    if (context != null) {
        var fillStyle1 = fillStyle1 == null ? 'white' : fillStyle1;
        var fillStyle2 = fillStyle2 == null ? 'black' : fillStyle2;
        
        context.save();
        context.translate(x, y);
        drawCircle(context, 0, 0, radius, 0, Math.PI * 2, false, fillStyle1);
        
        var smallEyeRadius = radius * 0.5;
        var smallEyeX = direction == Direction.NONE ? 0 : smallEyeRadius
        
        context.rotate(Direction.getAngle(direction));
        drawCircle(context, smallEyeX, 0, smallEyeRadius, 0, Math.PI * 2, false, fillStyle2);
        context.restore();
    }
}

function drawLine(context, x1, y1, x2, y2) {
    if (context != null) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }
}

function drawText(context, text, x, y, color, align, baseline, font) {
	if (align != null) context.textAlign = align;
	if (baseline != null) context.textBaseline = baseline;
	if (font != null) context.font = font;
	if (color != null) context.fillStyle = color;
	context.fillText(text, x, y);
}