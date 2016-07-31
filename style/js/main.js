jQuery(document).ready(function($) {

    "use strict";

    // Loader
    $('#page-preloader').fadeOut('slow');
    $('#page-preloader .spinner').fadeOut('slow');

    // Start slider
    $('.slider').each(function() {
        var $this = $(this);
        var $group = $this.find('.slide_group');
        var $slides = $this.find('.slide');
        var bulletArray = [];
        var currentIndex = 0;
        var timeout;

        function move(newIndex) {
            var animateLeft, slideLeft;
            advance();

            if ($group.is(':animated') || currentIndex === newIndex) {
                return;
            }

            bulletArray[currentIndex].removeClass('active');
            bulletArray[newIndex].addClass('active');

            if (newIndex > currentIndex) {
                slideLeft = '100%';
                animateLeft = '-100%';
            } else {
                slideLeft = '-100%';
                animateLeft = '100%';
            }

            $slides.eq(newIndex).css({
                display: 'block',
                left: slideLeft
            });
            $group.animate({
                left: animateLeft
            }, function() {
                $slides.eq(currentIndex).css({
                    display: 'none'
                });
                $slides.eq(newIndex).css({
                    left: 0
                });
                $group.css({
                    left: 0
                });
                currentIndex = newIndex;
            });
        }

        function advance() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                if (currentIndex < ($slides.length - 1)) {
                    move(currentIndex + 1);
                } else {
                    move(0);
                }
            }, 4000);
        }

        $('.next_btn').on('click', function() {
            if (currentIndex < ($slides.length - 1)) {
                move(currentIndex + 1);
            } else {
                move(0);
            }
        });

        $('.previous_btn').on('click', function() {
            if (currentIndex !== 0) {
                move(currentIndex - 1);
            } else {
                move(3);
            }
        });

        $.each($slides, function(index) {
            var $button = $('<a class="slide_btn">&bull;</a>');

            if (index === currentIndex) {
                $button.addClass('active');
            }
            $button.on('click', function() {
                move(index);
            }).appendTo('.slide_buttons');
            bulletArray.push($button);
        });

        advance();
    });

    // Gender select
    function genderSelect() {
        $(".genderBox input").each(function () {
            if($(this).prop("checked")){
                $(this).parent().parent().addClass("checked");
            } else {
                $(this).parent().parent().removeClass("checked");
            }
        });
    }
    genderSelect();
    $(".genderBox input").on("click", function () {
        genderSelect();
    });

    // Custom select
    $("select").each(function(){
        var $this = $(this),
            numberOfOptions = $(this).children('option').length;

        $this.addClass('select-hidden');
        $this.wrap('<div class="select '+ $(this).attr("name") +'"></div>');
        $this.after('<div class="select-styled"></div>');

        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());

        var $list = $('<ul />', {
            'class': 'select-options'
        }).insertAfter($styledSelect);

        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                rel: $this.children('option').eq(i).val()
            }).appendTo($list);
        }

        var $listItems = $list.children('li');

        $styledSelect.click(function(e) {
            e.stopPropagation();
            $('div.select-styled.active').not(this).each(function(){
                $(this).removeClass('active').next('ul.select-options').hide();
            });
            $(this).toggleClass('active').next('ul.select-options').toggle();
        });

        $listItems.click(function(e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');
            $this.val($(this).attr('rel'));
            $list.hide();
            //console.log($this.val());
        });

        $(document).click(function() {
            $styledSelect.removeClass('active');
            $list.hide();
        });

    });

    // Custom checkbox
    $("input[type='checkbox']").each(function () {
        $(this).wrap("<div class='checkboxCustom'><div></div></div>");
        $(this).on("click", function () {
            if($(this).prop("checked")){
                $(this).parent().parent().addClass("checked");
            } else {
                $(this).parent().parent().removeClass("checked");
            }
        });
    });

    // Custom radio
    function customRadio() {
        $("input[type='radio']").each(function () {
            if($(this).prop("checked")){
                $(this).parent().parent().addClass("checked");
            } else {
                $(this).parent().parent().removeClass("checked");
            }
        });
    }
    $("input[type='radio']").each(function () {
        if(!$(this).hasClass("notCustom")){
            $(this).wrap("<div class='radioCustom'><div></div></div>");
            $(this).on("click", function () {
                customRadio();
            });
        }
    });

    // Users carousel
    var Carousel = function (elId, mode) {
        var wrapper = document.getElementById(elId);
        var innerEl = wrapper.getElementsByClassName('carousel-inner')[0];
        var leftButton = wrapper.getElementsByClassName('carousel-left')[0];
        var rightButton = wrapper.getElementsByClassName('carousel-right')[0];
        var items = wrapper.getElementsByClassName('item');

        this.carouselSize = items.length;
        this.itemWidth = null;
        this.itemOuterWidth = null;
        this.currentStep = 0;
        this.itemsAtOnce = 3;
        this.minItemWidth = 200;
        this.position = innerEl.style;
        this.mode = mode;

        this.init = function (mode) {
            this.itemsAtOnce = mode;
            this.calcWidth(wrapper, innerEl, items);
            cb_addEventListener(leftButton, 'click', this.goLeft.bind(this));
            cb_addEventListener(rightButton, 'click', this.goRight.bind(this));
            cb_addEventListener(window, 'resize', this.calcWidth.bind(this, wrapper, innerEl, items));
        };
        return this.init(mode);
    };
    Carousel.prototype = {
        goLeft: function(e) {
            e.preventDefault();
            if (this.currentStep) {
                --this.currentStep;
            } else {
                this.currentStep = this.carouselSize - this.itemsAtOnce;
            }
            this.makeStep(this.currentStep);
            return false;
        },
        goRight: function(e) {
            e.preventDefault();
            if (this.currentStep < (this.carouselSize - this.itemsAtOnce)) {
                ++this.currentStep;
            } else {
                this.currentStep = 0;
            }
            this.makeStep(this.currentStep);
            return false;
        },
        makeStep: function(step) {
            this.position.left = -(this.itemOuterWidth * step) + 'px';
        },
        calcWidth: function(wrapper, innerEl, items) {
            this.beResponsive();

            var itemStyle = window.getComputedStyle(items[0]);
            var innerElStyle = innerEl.style;
            var carouselLength = this.carouselSize;
            var wrapWidth = wrapper.offsetWidth;

            innerElStyle.display = 'none';
            this.itemWidth = wrapWidth / this.itemsAtOnce;
            this.itemOuterWidth = this.itemWidth;
            for (var i = 0; i < carouselLength; i++) {
                items[i].style.width = this.itemWidth + 'px';
            }
            innerElStyle.width = this.itemOuterWidth * this.carouselSize + 'px';
            innerElStyle.display = 'block';
        },
        beResponsive: function() {
            var winWidth = window.innerWidth;
            if (winWidth >= 650 && winWidth < 950 && this.itemsAtOnce >= 2) {
                this.itemsAtOnce = 2;
            }
            else if (winWidth < 650) {
                this.itemsAtOnce = 1;
            }
            else {
                this.itemsAtOnce = this.mode;
            }
        }
    };
    function cb_addEventListener(obj, evt, fnc) {
        if (obj && obj.addEventListener) {
            obj.addEventListener(evt, fnc, false);
            return true;
        } else if (obj && obj.attachEvent) {
            return obj.attachEvent('on' + evt, fnc);
        }
        return false;
    }
    // Initializing carousel
    if (document.getElementById('usersCarousel')) {
        var usersCarousel = new Carousel('usersCarousel', 5);
    }

    // Users tabs
    $(".users_tabs_links a").on("click", function () {
        var activeTab = $(this).attr("href");
        $(".users_tabs_links a").not(this).removeClass("active");
        $(this).addClass("active");
        $(".users_tabs_content > div").not("activeTab").removeClass("active");
        $(activeTab).addClass("active");
        if(activeTab == "#first_tab"){
            $(".users_tabs_content").addClass("firstActive");
        } else {
            $(".users_tabs_content").removeClass("firstActive");
        }
        return false;
    });

    // Progress line
    var progress_now = $("#progress_now");
    var progress_in = $("#progress_in");
    var progress_current = $("#progress_in").data("progress");
    var npr = 0;
    progress_in.innerHTML = "0%";
    var h = setInterval(function(){
        npr+= 0.2;
        progress_in.html(Math.floor(npr) + "%");
        progress_now.width(npr + "%");
        if (npr >= progress_current) {
            clearInterval(h);
        }
    }, 10);
    
    // Price range
    $( ".price-slider" ).slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 10, 500 ],
        slide: function( event, ui ) {
            $( ".price-value" ).text( "£" + ui.values[ 0 ] + " - £" + ui.values[ 1 ] );
        }
    });

    // Circular progress bar
    var el;
    var options;
    var canvas;
    var span;
    var ctx;
    var radius;
    var createCanvasVariable = function(id){  // get canvas
        el = document.getElementById(id);
    };
    var createAllVariables = function(){
        options = {
            percent:  el.getAttribute('data-percent') || 25,
            size: el.getAttribute('data-size') || 90,
            lineWidth: el.getAttribute('data-line') || 18,
            rotate: el.getAttribute('data-rotate') || 0,
            color: el.getAttribute('data-color')
        };
        canvas = document.createElement('canvas');
        span = document.createElement('span');
        span.textContent = options.percent + '%';
        if (typeof(G_vmlCanvasManager) !== 'undefined') {
            G_vmlCanvasManager.initElement(canvas);
        }
        ctx = canvas.getContext('2d');
        canvas.width = canvas.height = options.size;
        el.appendChild(span);
        el.appendChild(canvas);
        ctx.translate(options.size / 2, options.size / 2); // change center
        ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg
        radius = (options.size - options.lineWidth) / 2;
    };
    var drawCircle = function(color, lineWidth, percent) {
        percent = Math.min(Math.max(0, percent || 1), 1);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
        ctx.strokeStyle = color;
        ctx.lineCap = 'square'; // butt, round or square
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    };
    var drawNewGraph = function(id){
        el = document.getElementById(id);
        createAllVariables();
        drawCircle('#e7e8e8', options.lineWidth, 100 / 100);
        drawCircle(options.color, options.lineWidth, options.percent / 100);
    };
    drawNewGraph('graph');

    // Stars
    $("#stars ul li").hover(function () {
        var numStar = $(this).index("#stars ul li");
        for(var i=0;i<=+numStar;i++){
            $("#stars ul li").eq(i).addClass("hover");
        }
    }, function () {
        $("#stars ul li").removeClass("hover");
    });
    $("#stars ul li").on("click", function () {
        $("#stars ul li").removeClass("active");
        var numStar = $(this).index("#stars ul li");
        for(var i=0;i<=+numStar;i++){
            $("#stars ul li").eq(i).addClass("active");
        }
        $("#stars_input").val(numStar);
    });
    
    // Form validation
    var validStep1 = false,
        validStep2 = false,
        validStep3 = false
    $("#search_form .button").on("click", function () {
        if(!validStep1){
            if($("#search_name").val() == ""){
                $("#search_name").parent().addClass("notValid");
            } else {
                $("#search_name").parent().removeClass("notValid");
                $("#search_name").parent().addClass("valid");
                validStep1 = true;
            }
        }
        if(validStep1 && !validStep2){
            if($("#date").val() == "hide" || $("#month").val() == "hide" || $("#year").val() == "hide"){
                $(".select.date").parent().addClass("notValid");
            } else {
                $(".select.date").parent().removeClass("notValid");
                $(".select.date").parent().addClass("valid");
                validStep2 = true;
            }
        }
        if (validStep1 && validStep2 && !validStep3){
            if($("#city").val() == "hide"){
                $(".select.city").parent().addClass("notValid");
            } else {
                $(".select.city").parent().removeClass("notValid");
                $(".select.city").parent().addClass("valid");
                validStep3 = true;
            }
        }
        if(validStep1 && validStep2 && validStep3){
            alert("send form");
        }
    });



    // Sticky header
    var win = $(window),
        nav = $("#sticky"),
        scrollTop = win.scrollTop(),
        sticky = function(){
            var _scrollTop = win.scrollTop();
            if(_scrollTop < scrollTop){
    
                win.scrollTop() > 250 ?
                    nav.addClass('sticky')
                    : nav.removeClass('sticky')
            }
            if(_scrollTop > scrollTop){
    
                win.scrollTop() > 0 ?
                    nav.addClass('sticky')
                    : nav.removeClass('sticky')
            }
            scrollTop = _scrollTop
        };
    win.scroll(sticky);

});




