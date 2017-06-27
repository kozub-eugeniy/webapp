window.onload = function(){
    const can = document.getElementById('canvas');
    const ctx = can.getContext('2d');
    const clear = document.getElementById('clearbtn');
    const line = document.getElementById('brushSlider');
    document.addEventListener('mousemove', draw);
    document.addEventListener('mousedown', setPosition);
    document.addEventListener('mouseenter', setPosition);

    clear.addEventListener('click',clearFunction, false);
    line.addEventListener('change',function () {
        ctx.lineWidth = filterInt(this.value);
    });

    const pos = {x: 0, y: 0};
    function setPosition(e) {
        pos.x = e.clientX - ctx.canvas.offsetLeft;
        pos.y = e.clientY - ctx.canvas.offsetTop;
    }

    //draws lines
    function draw(e)    {
        if (e.buttons !== 1) return; 
        let color = document.getElementById('hex').value;
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.moveTo(pos.x, pos.y);
        setPosition(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }

    function clearFunction(){
        ctx.clearRect(0, 0, can.width, can.height);
    }

    const filterInt = function (value) {
        if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
            return Number(value);
        return NaN;
    };

    function changeLineWidth(brushSize) {
        ctx.lineWidth = filterInt(brushSize);
        console.log(brushSize);
    }


    const PICKER = {
        mouse_inside: false,

        to_hex: function (dec) {
            let hex = dec.toString(16);
            return hex.length == 2 ? hex : '0' + hex;
        },

        show: function () {
            let input = $(this);
            let position = input.offset();

            PICKER.$colors  = $('<canvas width="230" height="150" ></canvas>');
            PICKER.$colors.css({
                'position': 'absolute',
                'top': position.top + input.height() + 9,
                'left': position.left,
                'cursor': 'crosshair',
                'display': 'none'
            });
            $('body').append(PICKER.$colors.fadeIn());
            PICKER.colorctx = PICKER.$colors[0].getContext('2d');

            PICKER.render();

            PICKER.$colors
                .click(function (e) {
                    let new_color = PICKER.get_color(e);
                    $(input).css({'background-color': new_color}).val(new_color).trigger('change').removeClass('color-picker-binded');
                    PICKER.close();
                })
                .hover(function () {
                    PICKER.mouse_inside=true;
                }, function () {
                    PICKER.mouse_inside=false;
                });

            $("body").mouseup(function () {
                if (!PICKER.mouse_is_inside) PICKER.close();
            });
        },

        bind_inputs: function () {
            $('input[type="color-picker"]').not('.color-picker-binded').each(function () {
                $(this).click(PICKER.show);
            }).addClass('color-picker-binded');
        },

        close: function () {PICKER.$colors.fadeOut(PICKER.$colors.remove);},

        get_color: function (e) {
            let pos_x = e.pageX - PICKER.$colors.offset().left;
            let pos_y = e.pageY - PICKER.$colors.offset().top;

            let data = PICKER.colorctx.getImageData(pos_x, pos_y, 1, 1).data;
            return '#' + PICKER.to_hex(data[0]) + PICKER.to_hex(data[1]) + PICKER.to_hex(data[2]);
        },

        // Build Color palette
        render: function () {
            let gradient = PICKER.colorctx.createLinearGradient(0, 0, PICKER.$colors.width(), 0);

            // Create color gradient
            gradient.addColorStop(0,    "rgb(255,   0,   0)");
            gradient.addColorStop(0.15, "rgb(255,   0, 255)");
            gradient.addColorStop(0.33, "rgb(0,     0, 255)");
            gradient.addColorStop(0.49, "rgb(0,   255, 255)");
            gradient.addColorStop(0.67, "rgb(0,   255,   0)");
            gradient.addColorStop(0.84, "rgb(255, 255,   0)");
            gradient.addColorStop(1,    "rgb(255,   0,   0)");

            // Apply gradient to canvas
            PICKER.colorctx.fillStyle = gradient;
            PICKER.colorctx.fillRect(0, 0, PICKER.colorctx.canvas.width, PICKER.colorctx.canvas.height);

            // Create semi transparent gradient (white -> trans. -> black)
            gradient = PICKER.colorctx.createLinearGradient(0, 0, 0, PICKER.$colors.height());
            gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
            gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");

            // Apply gradient to canvas
            PICKER.colorctx.fillStyle = gradient;
            PICKER.colorctx.fillRect(0, 0, PICKER.colorctx.canvas.width, PICKER.colorctx.canvas.height);
        }
    };

    PICKER.bind_inputs();

}
