/*!
 * lightgallery | 2.8.3 | March 1st 2025
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lightGallery = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
        rotateLeft: 'lgRotateLeft',
        rotateRight: 'lgRotateRight',
        flipHorizontal: 'lgFlipHorizontal',
        flipVertical: 'lgFlipVertical',
        autoplay: 'lgAutoplay',
        autoplayStart: 'lgAutoplayStart',
        autoplayStop: 'lgAutoplayStop',
    };

    var lightGalleryCoreSettings = {
        mode: 'lg-slide',
        easing: 'ease',
        speed: 400,
        licenseKey: '0000-0000-000-0000',
        height: '100%',
        width: '100%',
        addClass: '',
        startClass: 'lg-start-zoom',
        backdropDuration: 300,
        container: '',
        startAnimationDuration: 400,
        zoomFromOrigin: true,
        hideBarsDelay: 0,
        showBarsAfter: 10000,
        slideDelay: 0,
        supportLegacyBrowser: true,
        allowMediaOverlap: false,
        videoMaxSize: '1280-720',
        loadYouTubePoster: true,
        defaultCaptionHeight: 0,
        ariaLabelledby: '',
        ariaDescribedby: '',
        resetScrollPosition: true,
        hideScrollbar: false,
        closable: true,
        swipeToClose: true,
        closeOnTap: true,
        showCloseIcon: true,
        showMaximizeIcon: false,
        loop: true,
        escKey: true,
        keyPress: true,
        trapFocus: true,
        controls: true,
        slideEndAnimation: true,
        hideControlOnEnd: false,
        mousewheel: false,
        getCaptionFromTitleOrAlt: true,
        appendSubHtmlTo: '.lg-sub-html',
        subHtmlSelectorRelative: false,
        preload: 2,
        numberOfSlideItemsInDom: 10,
        selector: '',
        selectWithin: '',
        nextHtml: '',
        prevHtml: '',
        index: 0,
        iframeWidth: '100%',
        iframeHeight: '100%',
        iframeMaxWidth: '100%',
        iframeMaxHeight: '100%',
        download: true,
        counter: true,
        appendCounterTo: '.lg-toolbar',
        swipeThreshold: 50,
        enableSwipe: true,
        enableDrag: true,
        dynamic: false,
        dynamicEl: [],
        extraProps: [],
        exThumbImage: '',
        isMobile: undefined,
        mobileSettings: {
            controls: false,
            showCloseIcon: false,
            download: false,
        },
        plugins: [],
        strings: {
            closeGallery: 'Close gallery',
            toggleMaximize: 'Toggle maximize',
            previousSlide: 'Previous slide',
            nextSlide: 'Next slide',
            download: 'Download',
            playVideo: 'Play video',
            mediaLoadingFailed: 'Oops... Failed to load content...',
        },
    };

    function initLgPolyfills() {
        (function () {
            if (typeof window.CustomEvent === 'function')
                return false;
            function CustomEvent(event, params) {
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: null,
                };
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            }
            window.CustomEvent = CustomEvent;
        })();
        (function () {
            if (!Element.prototype.matches) {
                Element.prototype.matches =
                    Element.prototype.msMatchesSelector ||
                        Element.prototype.webkitMatchesSelector;
            }
        })();
    }
    var lgQuery = /** @class */ (function () {
        function lgQuery(selector) {
            this.cssVenderPrefixes = [
                'TransitionDuration',
                'TransitionTimingFunction',
                'Transform',
                'Transition',
            ];
            this.selector = this._getSelector(selector);
            this.firstElement = this._getFirstEl();
            return this;
        }
        lgQuery.generateUUID = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        };
        lgQuery.prototype._getSelector = function (selector, context) {
            if (context === void 0) { context = document; }
            if (typeof selector !== 'string') {
                return selector;
            }
            context = context || document;
            var fl = selector.substring(0, 1);
            if (fl === '#') {
                return context.querySelector(selector);
            }
            else {
                return context.querySelectorAll(selector);
            }
        };
        lgQuery.prototype._each = function (func) {
            if (!this.selector) {
                return this;
            }
            if (this.selector.length !== undefined) {
                [].forEach.call(this.selector, func);
            }
            else {
                func(this.selector, 0);
            }
            return this;
        };
        lgQuery.prototype._setCssVendorPrefix = function (el, cssProperty, value) {
            // prettier-ignore
            var property = cssProperty.replace(/-([a-z])/gi, function (s, group1) {
                return group1.toUpperCase();
            });
            if (this.cssVenderPrefixes.indexOf(property) !== -1) {
                el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
                el.style['webkit' + property] = value;
                el.style['moz' + property] = value;
                el.style['ms' + property] = value;
                el.style['o' + property] = value;
            }
            else {
                el.style[property] = value;
            }
        };
        lgQuery.prototype._getFirstEl = function () {
            if (this.selector && this.selector.length !== undefined) {
                return this.selector[0];
            }
            else {
                return this.selector;
            }
        };
        lgQuery.prototype.isEventMatched = function (event, eventName) {
            var eventNamespace = eventName.split('.');
            return event
                .split('.')
                .filter(function (e) { return e; })
                .every(function (e) {
                return eventNamespace.indexOf(e) !== -1;
            });
        };
        lgQuery.prototype.attr = function (attr, value) {
            if (value === undefined) {
                if (!this.firstElement) {
                    return '';
                }
                return this.firstElement.getAttribute(attr);
            }
            this._each(function (el) {
                el.setAttribute(attr, value);
            });
            return this;
        };
        lgQuery.prototype.find = function (selector) {
            return $LG(this._getSelector(selector, this.selector));
        };
        lgQuery.prototype.first = function () {
            if (this.selector && this.selector.length !== undefined) {
                return $LG(this.selector[0]);
            }
            else {
                return $LG(this.selector);
            }
        };
        lgQuery.prototype.eq = function (index) {
            return $LG(this.selector[index]);
        };
        lgQuery.prototype.parent = function () {
            return $LG(this.selector.parentElement);
        };
        lgQuery.prototype.get = function () {
            return this._getFirstEl();
        };
        lgQuery.prototype.removeAttr = function (attributes) {
            var attrs = attributes.split(' ');
            this._each(function (el) {
                attrs.forEach(function (attr) { return el.removeAttribute(attr); });
            });
            return this;
        };
        lgQuery.prototype.wrap = function (className) {
            if (!this.firstElement) {
                return this;
            }
            var wrapper = document.createElement('div');
            wrapper.className = className;
            this.firstElement.parentNode.insertBefore(wrapper, this.firstElement);
            this.firstElement.parentNode.removeChild(this.firstElement);
            wrapper.appendChild(this.firstElement);
            return this;
        };
        lgQuery.prototype.addClass = function (classNames) {
            if (classNames === void 0) { classNames = ''; }
            this._each(function (el) {
                // IE doesn't support multiple arguments
                classNames.split(' ').forEach(function (className) {
                    if (className) {
                        el.classList.add(className);
                    }
                });
            });
            return this;
        };
        lgQuery.prototype.removeClass = function (classNames) {
            this._each(function (el) {
                // IE doesn't support multiple arguments
                classNames.split(' ').forEach(function (className) {
                    if (className) {
                        el.classList.remove(className);
                    }
                });
            });
            return this;
        };
        lgQuery.prototype.hasClass = function (className) {
            if (!this.firstElement) {
                return false;
            }
            return this.firstElement.classList.contains(className);
        };
        lgQuery.prototype.hasAttribute = function (attribute) {
            if (!this.firstElement) {
                return false;
            }
            return this.firstElement.hasAttribute(attribute);
        };
        lgQuery.prototype.toggleClass = function (className) {
            if (!this.firstElement) {
                return this;
            }
            if (this.hasClass(className)) {
                this.removeClass(className);
            }
            else {
                this.addClass(className);
            }
            return this;
        };
        lgQuery.prototype.css = function (property, value) {
            var _this = this;
            this._each(function (el) {
                _this._setCssVendorPrefix(el, property, value);
            });
            return this;
        };
        // Need to pass separate namespaces for separate elements
        lgQuery.prototype.on = function (events, listener) {
            var _this = this;
            if (!this.selector) {
                return this;
            }
            events.split(' ').forEach(function (event) {
                if (!Array.isArray(lgQuery.eventListeners[event])) {
                    lgQuery.eventListeners[event] = [];
                }
                lgQuery.eventListeners[event].push(listener);
                _this.selector.addEventListener(event.split('.')[0], listener);
            });
            return this;
        };
        // @todo - test this
        lgQuery.prototype.once = function (event, listener) {
            var _this = this;
            this.on(event, function () {
                _this.off(event);
                listener(event);
            });
            return this;
        };
        lgQuery.prototype.off = function (event) {
            var _this = this;
            if (!this.selector) {
                return this;
            }
            Object.keys(lgQuery.eventListeners).forEach(function (eventName) {
                if (_this.isEventMatched(event, eventName)) {
                    lgQuery.eventListeners[eventName].forEach(function (listener) {
                        _this.selector.removeEventListener(eventName.split('.')[0], listener);
                    });
                    lgQuery.eventListeners[eventName] = [];
                }
            });
            return this;
        };
        lgQuery.prototype.trigger = function (event, detail) {
            if (!this.firstElement) {
                return this;
            }
            var customEvent = new CustomEvent(event.split('.')[0], {
                detail: detail || null,
            });
            this.firstElement.dispatchEvent(customEvent);
            return this;
        };
        // Does not support IE
        lgQuery.prototype.load = function (url) {
            var _this = this;
            fetch(url)
                .then(function (res) { return res.text(); })
                .then(function (html) {
                _this.selector.innerHTML = html;
            });
            return this;
        };
        lgQuery.prototype.html = function (html) {
            if (html === undefined) {
                if (!this.firstElement) {
                    return '';
                }
                return this.firstElement.innerHTML;
            }
            this._each(function (el) {
                el.innerHTML = html;
            });
            return this;
        };
        lgQuery.prototype.append = function (html) {
            this._each(function (el) {
                if (typeof html === 'string') {
                    el.insertAdjacentHTML('beforeend', html);
                }
                else {
                    el.appendChild(html);
                }
            });
            return this;
        };
        lgQuery.prototype.prepend = function (html) {
            this._each(function (el) {
                if (typeof html === 'string') {
                    el.insertAdjacentHTML('afterbegin', html);
                }
                else if (html instanceof HTMLElement) {
                    el.insertBefore(html.cloneNode(true), el.firstChild);
                }
            });
            return this;
        };
        lgQuery.prototype.remove = function () {
            this._each(function (el) {
                el.parentNode.removeChild(el);
            });
            return this;
        };
        lgQuery.prototype.empty = function () {
            this._each(function (el) {
                el.innerHTML = '';
            });
            return this;
        };
        lgQuery.prototype.scrollTop = function (scrollTop) {
            if (scrollTop !== undefined) {
                document.body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
                return this;
            }
            else {
                return (window.pageYOffset ||
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    0);
            }
        };
        lgQuery.prototype.scrollLeft = function (scrollLeft) {
            if (scrollLeft !== undefined) {
                document.body.scrollLeft = scrollLeft;
                document.documentElement.scrollLeft = scrollLeft;
                return this;
            }
            else {
                return (window.pageXOffset ||
                    document.documentElement.scrollLeft ||
                    document.body.scrollLeft ||
                    0);
            }
        };
        lgQuery.prototype.offset = function () {
            if (!this.firstElement) {
                return {
                    left: 0,
                    top: 0,
                };
            }
            var rect = this.firstElement.getBoundingClientRect();
            var bodyMarginLeft = $LG('body').style().marginLeft;
            // Minus body margin - https://stackoverflow.com/questions/30711548/is-getboundingclientrect-left-returning-a-wrong-value
            return {
                left: rect.left - parseFloat(bodyMarginLeft) + this.scrollLeft(),
                top: rect.top + this.scrollTop(),
            };
        };
        lgQuery.prototype.style = function () {
            if (!this.firstElement) {
                return {};
            }
            return (this.firstElement.currentStyle ||
                window.getComputedStyle(this.firstElement));
        };
        // Width without padding and border even if box-sizing is used.
        lgQuery.prototype.width = function () {
            var style = this.style();
            return (this.firstElement.clientWidth -
                parseFloat(style.paddingLeft) -
                parseFloat(style.paddingRight));
        };
        // Height without padding and border even if box-sizing is used.
        lgQuery.prototype.height = function () {
            var style = this.style();
            return (this.firstElement.clientHeight -
                parseFloat(style.paddingTop) -
                parseFloat(style.paddingBottom));
        };
        lgQuery.eventListeners = {};
        return lgQuery;
    }());
    function $LG(selector) {
        initLgPolyfills();
        return new lgQuery(selector);
    }

    var defaultDynamicOptions = [
        'src',
        'sources',
        'subHtml',
        'subHtmlUrl',
        'html',
        'video',
        'poster',
        'slideName',
        'responsive',
        'srcset',
        'sizes',
        'iframe',
        'downloadUrl',
        'download',
        'width',
        'facebookShareUrl',
        'tweetText',
        'iframeTitle',
        'twitterShareUrl',
        'pinterestShareUrl',
        'pinterestText',
        'fbHtml',
        'disqusIdentifier',
        'disqusUrl',
    ];
    // Convert html data-attribute to camalcase
    function convertToData(attr) {
        // FInd a way for lgsize
        if (attr === 'href') {
            return 'src';
        }
        attr = attr.replace('data-', '');
        attr = attr.charAt(0).toLowerCase() + attr.slice(1);
        attr = attr.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
        return attr;
    }
    var utils = {
        /**
         * Fetches HTML content from a given URL and inserts it into a specified element.
         *
         * @param url - The URL to fetch the HTML content from.
         * @param element - The DOM element (jQuery object) to insert the HTML content into.
         * @param insertMethod - The method to insert the HTML ('append' or 'replace').
         */
        fetchCaptionFromUrl: function (url, element, insertMethod) {
            // Fetch content from the URL
            fetch(url)
                .then(function (response) { return response.text(); })
                .then(function (htmlContent) {
                if (insertMethod === 'append') {
                    var contentDiv = "<div class=\"lg-sub-html\">" + htmlContent + "</div>";
                    element.append(contentDiv);
                }
                else {
                    element.html(htmlContent);
                }
            });
        },
        /**
         * get possible width and height from the lgSize attribute. Used for ZoomFromOrigin option
         */
        getSize: function (el, container, spacing, defaultLgSize) {
            if (spacing === void 0) { spacing = 0; }
            var LGel = $LG(el);
            var lgSize = LGel.attr('data-lg-size') || defaultLgSize;
            if (!lgSize) {
                return;
            }
            var isResponsiveSizes = lgSize.split(',');
            // if at-least two viewport sizes are available
            if (isResponsiveSizes[1]) {
                var wWidth = window.innerWidth;
                for (var i = 0; i < isResponsiveSizes.length; i++) {
                    var size_1 = isResponsiveSizes[i];
                    var responsiveWidth = parseInt(size_1.split('-')[2], 10);
                    if (responsiveWidth > wWidth) {
                        lgSize = size_1;
                        break;
                    }
                    // take last item as last option
                    if (i === isResponsiveSizes.length - 1) {
                        lgSize = size_1;
                    }
                }
            }
            var size = lgSize.split('-');
            var width = parseInt(size[0], 10);
            var height = parseInt(size[1], 10);
            var cWidth = container.width();
            var cHeight = container.height() - spacing;
            var maxWidth = Math.min(cWidth, width);
            var maxHeight = Math.min(cHeight, height);
            var ratio = Math.min(maxWidth / width, maxHeight / height);
            return { width: width * ratio, height: height * ratio };
        },
        /**
         * @desc Get transform value based on the imageSize. Used for ZoomFromOrigin option
         * @param {jQuery Element}
         * @returns {String} Transform CSS string
         */
        getTransform: function (el, container, top, bottom, imageSize) {
            if (!imageSize) {
                return;
            }
            var LGel = $LG(el).find('img').first();
            if (!LGel.get()) {
                return;
            }
            var containerRect = container.get().getBoundingClientRect();
            var wWidth = containerRect.width;
            // using innerWidth to include mobile safari bottom bar
            var wHeight = container.height() - (top + bottom);
            var elWidth = LGel.width();
            var elHeight = LGel.height();
            var elStyle = LGel.style();
            var x = (wWidth - elWidth) / 2 -
                LGel.offset().left +
                (parseFloat(elStyle.paddingLeft) || 0) +
                (parseFloat(elStyle.borderLeft) || 0) +
                $LG(window).scrollLeft() +
                containerRect.left;
            var y = (wHeight - elHeight) / 2 -
                LGel.offset().top +
                (parseFloat(elStyle.paddingTop) || 0) +
                (parseFloat(elStyle.borderTop) || 0) +
                $LG(window).scrollTop() +
                top;
            var scX = elWidth / imageSize.width;
            var scY = elHeight / imageSize.height;
            var transform = 'translate3d(' +
                (x *= -1) +
                'px, ' +
                (y *= -1) +
                'px, 0) scale3d(' +
                scX +
                ', ' +
                scY +
                ', 1)';
            return transform;
        },
        getIframeMarkup: function (iframeWidth, iframeHeight, iframeMaxWidth, iframeMaxHeight, src, iframeTitle) {
            var title = iframeTitle ? 'title="' + iframeTitle + '"' : '';
            return "<div class=\"lg-media-cont lg-has-iframe\" style=\"width:" + iframeWidth + "; max-width:" + iframeMaxWidth + "; height: " + iframeHeight + "; max-height:" + iframeMaxHeight + "\">\n                    <iframe class=\"lg-object\" frameborder=\"0\" " + title + " src=\"" + src + "\"  allowfullscreen=\"true\"></iframe>\n                </div>";
        },
        getImgMarkup: function (index, src, altAttr, srcset, sizes, sources) {
            var srcsetAttr = srcset ? "srcset=\"" + srcset + "\"" : '';
            var sizesAttr = sizes ? "sizes=\"" + sizes + "\"" : '';
            var imgMarkup = "<img " + altAttr + " " + srcsetAttr + "  " + sizesAttr + " class=\"lg-object lg-image\" data-index=\"" + index + "\" src=\"" + src + "\" />";
            var sourceTag = '';
            if (sources) {
                var sourceObj = typeof sources === 'string' ? JSON.parse(sources) : sources;
                sourceTag = sourceObj.map(function (source) {
                    var attrs = '';
                    Object.keys(source).forEach(function (key) {
                        // Do not remove the first space as it is required to separate the attributes
                        attrs += " " + key + "=\"" + source[key] + "\"";
                    });
                    return "<source " + attrs + "></source>";
                });
            }
            return "" + sourceTag + imgMarkup;
        },
        // Get src from responsive src
        getResponsiveSrc: function (srcItms) {
            var rsWidth = [];
            var rsSrc = [];
            var src = '';
            for (var i = 0; i < srcItms.length; i++) {
                var _src = srcItms[i].split(' ');
                // Manage empty space
                if (_src[0] === '') {
                    _src.splice(0, 1);
                }
                rsSrc.push(_src[0]);
                rsWidth.push(_src[1]);
            }
            var wWidth = window.innerWidth;
            for (var j = 0; j < rsWidth.length; j++) {
                if (parseInt(rsWidth[j], 10) > wWidth) {
                    src = rsSrc[j];
                    break;
                }
            }
            return src;
        },
        isImageLoaded: function (img) {
            if (!img)
                return false;
            // During the onload event, IE correctly identifies any images that
            // weren’t downloaded as not complete. Others should too. Gecko-based
            // browsers act like NS4 in that they report this incorrectly.
            if (!img.complete) {
                return false;
            }
            // However, they do have two very useful properties: naturalWidth and
            // naturalHeight. These give the true size of the image. If it failed
            // to load, either of these should be zero.
            if (img.naturalWidth === 0) {
                return false;
            }
            // No other way of checking: assume it’s ok.
            return true;
        },
        getVideoPosterMarkup: function (_poster, dummyImg, videoContStyle, playVideoString, _isVideo) {
            var videoClass = '';
            if (_isVideo && _isVideo.youtube) {
                videoClass = 'lg-has-youtube';
            }
            else if (_isVideo && _isVideo.vimeo) {
                videoClass = 'lg-has-vimeo';
            }
            else {
                videoClass = 'lg-has-html5';
            }
            var _dummy = dummyImg;
            if (typeof dummyImg !== 'string') {
                _dummy = dummyImg.outerHTML;
            }
            return "<div class=\"lg-video-cont " + videoClass + "\" style=\"" + videoContStyle + "\">\n                <div class=\"lg-video-play-button\">\n                <svg\n                    viewBox=\"0 0 20 20\"\n                    preserveAspectRatio=\"xMidYMid\"\n                    focusable=\"false\"\n                    aria-labelledby=\"" + playVideoString + "\"\n                    role=\"img\"\n                    class=\"lg-video-play-icon\"\n                >\n                    <title>" + playVideoString + "</title>\n                    <polygon class=\"lg-video-play-icon-inner\" points=\"1,0 20,10 1,20\"></polygon>\n                </svg>\n                <svg class=\"lg-video-play-icon-bg\" viewBox=\"0 0 50 50\" focusable=\"false\">\n                    <circle cx=\"50%\" cy=\"50%\" r=\"20\"></circle></svg>\n                <svg class=\"lg-video-play-icon-circle\" viewBox=\"0 0 50 50\" focusable=\"false\">\n                    <circle cx=\"50%\" cy=\"50%\" r=\"20\"></circle>\n                </svg>\n            </div>\n            " + _dummy + "\n            <img class=\"lg-object lg-video-poster\" src=\"" + _poster + "\" />\n        </div>";
        },
        getFocusableElements: function (container) {
            var elements = container.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
            var visibleElements = [].filter.call(elements, function (element) {
                var style = window.getComputedStyle(element);
                return style.display !== 'none' && style.visibility !== 'hidden';
            });
            return visibleElements;
        },
        /**
         * @desc Create dynamic elements array from gallery items when dynamic option is false
         * It helps to avoid frequent DOM interaction
         * and avoid multiple checks for dynamic elments
         *
         * @returns {Array} dynamicEl
         */
        getDynamicOptions: function (items, extraProps, getCaptionFromTitleOrAlt, exThumbImage) {
            var dynamicElements = [];
            var availableDynamicOptions = __spreadArrays(defaultDynamicOptions, extraProps);
            [].forEach.call(items, function (item) {
                var dynamicEl = {};
                for (var i = 0; i < item.attributes.length; i++) {
                    var attr = item.attributes[i];
                    if (attr.specified) {
                        var dynamicAttr = convertToData(attr.name);
                        var label = '';
                        if (availableDynamicOptions.indexOf(dynamicAttr) > -1) {
                            label = dynamicAttr;
                        }
                        if (label) {
                            dynamicEl[label] = attr.value;
                        }
                    }
                }
                var currentItem = $LG(item);
                var alt = currentItem.find('img').first().attr('alt');
                var title = currentItem.attr('title');
                var thumb = exThumbImage
                    ? currentItem.attr(exThumbImage)
                    : currentItem.find('img').first().attr('src');
                dynamicEl.thumb = thumb;
                if (getCaptionFromTitleOrAlt && !dynamicEl.subHtml) {
                    dynamicEl.subHtml = title || alt || '';
                }
                dynamicEl.alt = alt || title || '';
                dynamicElements.push(dynamicEl);
            });
            return dynamicElements;
        },
        isMobile: function () {
            return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        },
        /**
         * @desc Check the given src is video
         * @param {String} src
         * @return {Object} video type
         * Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
         *
         * @todo - this information can be moved to dynamicEl to avoid frequent calls
         */
        isVideo: function (src, isHTML5VIdeo, index) {
            if (!src) {
                if (isHTML5VIdeo) {
                    return {
                        html5: true,
                    };
                }
                else {
                    console.error('lightGallery :- data-src is not provided on slide item ' +
                        (index + 1) +
                        '. Please make sure the selector property is properly configured. More info - https://www.lightgalleryjs.com/demos/html-markup/');
                    return;
                }
            }
            var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)([\&|?][\S]*)*/i);
            var vimeo = src.match(/\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)(.*)?/i);
            var wistia = src.match(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/);
            if (youtube) {
                return {
                    youtube: youtube,
                };
            }
            else if (vimeo) {
                return {
                    vimeo: vimeo,
                };
            }
            else if (wistia) {
                return {
                    wistia: wistia,
                };
            }
        },
    };

    // @ref - https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
    // @ref - https://2ality.com/2017/04/setting-up-multi-platform-packages.html
    // Unique id for each gallery
    var lgId = 0;
    var LightGallery = /** @class */ (function () {
        function LightGallery(element, options) {
            this.lgOpened = false;
            this.index = 0;
            // lightGallery modules
            this.plugins = [];
            // false when lightGallery load first slide content;
            this.lGalleryOn = false;
            // True when a slide animation is in progress
            this.lgBusy = false;
            this.currentItemsInDom = [];
            // Scroll top value before lightGallery is opened
            this.prevScrollTop = 0;
            this.bodyPaddingRight = 0;
            this.isDummyImageRemoved = false;
            this.dragOrSwipeEnabled = false;
            this.mediaContainerPosition = {
                top: 0,
                bottom: 0,
            };
            if (!element) {
                return this;
            }
            lgId++;
            this.lgId = lgId;
            this.el = element;
            this.LGel = $LG(element);
            this.generateSettings(options);
            this.buildModules();
            // When using dynamic mode, ensure dynamicEl is an array
            if (this.settings.dynamic &&
                this.settings.dynamicEl !== undefined &&
                !Array.isArray(this.settings.dynamicEl)) {
                throw 'When using dynamic mode, you must also define dynamicEl as an Array.';
            }
            this.galleryItems = this.getItems();
            this.normalizeSettings();
            // Gallery items
            this.init();
            this.validateLicense();
            return this;
        }
        LightGallery.prototype.generateSettings = function (options) {
            // lightGallery settings
            this.settings = __assign(__assign({}, lightGalleryCoreSettings), options);
            if (this.settings.isMobile &&
                typeof this.settings.isMobile === 'function'
                ? this.settings.isMobile()
                : utils.isMobile()) {
                var mobileSettings = __assign(__assign({}, this.settings.mobileSettings), this.settings.mobileSettings);
                this.settings = __assign(__assign({}, this.settings), mobileSettings);
            }
        };
        LightGallery.prototype.normalizeSettings = function () {
            if (this.settings.slideEndAnimation) {
                this.settings.hideControlOnEnd = false;
            }
            if (!this.settings.closable) {
                this.settings.swipeToClose = false;
            }
            // And reset it on close to get the correct value next time
            this.zoomFromOrigin = this.settings.zoomFromOrigin;
            // At the moment, Zoom from image doesn't support dynamic options
            // @todo add zoomFromOrigin support for dynamic images
            if (this.settings.dynamic) {
                this.zoomFromOrigin = false;
            }
            if (this.settings.container) {
                var container = this.settings.container;
                if (typeof container === 'function') {
                    this.settings.container = container();
                }
                else if (typeof container === 'string') {
                    var el = document.querySelector(container);
                    this.settings.container = el !== null && el !== void 0 ? el : document.body;
                }
            }
            else {
                this.settings.container = document.body;
            }
            // settings.preload should not be grater than $item.length
            this.settings.preload = Math.min(this.settings.preload, this.galleryItems.length);
        };
        LightGallery.prototype.init = function () {
            var _this = this;
            this.addSlideVideoInfo(this.galleryItems);
            this.buildStructure();
            this.LGel.trigger(lGEvents.init, {
                instance: this,
            });
            if (this.settings.keyPress) {
                this.keyPress();
            }
            setTimeout(function () {
                _this.enableDrag();
                _this.enableSwipe();
                _this.triggerPosterClick();
            }, 50);
            this.arrow();
            if (this.settings.mousewheel) {
                this.mousewheel();
            }
            if (!this.settings.dynamic) {
                this.openGalleryOnItemClick();
            }
        };
        LightGallery.prototype.openGalleryOnItemClick = function () {
            var _this = this;
            var _loop_1 = function (index) {
                var element = this_1.items[index];
                var $element = $LG(element);
                // Using different namespace for click because click event should not unbind if selector is same object('this')
                // @todo manage all event listners - should have namespace that represent element
                var uuid = lgQuery.generateUUID();
                $element
                    .attr('data-lg-id', uuid)
                    .on("click.lgcustom-item-" + uuid, function (e) {
                    e.preventDefault();
                    var currentItemIndex = _this.settings.index || index;
                    _this.openGallery(currentItemIndex, element);
                });
            };
            var this_1 = this;
            // Using for loop instead of using bubbling as the items can be any html element.
            for (var index = 0; index < this.items.length; index++) {
                _loop_1(index);
            }
        };
        /**
         * Module constructor
         * Modules are build incrementally.
         * Gallery should be opened only once all the modules are initialized.
         * use moduleBuildTimeout to make sure this
         */
        LightGallery.prototype.buildModules = function () {
            var _this = this;
            this.settings.plugins.forEach(function (plugin) {
                _this.plugins.push(new plugin(_this, $LG));
            });
        };
        LightGallery.prototype.validateLicense = function () {
            if (!this.settings.licenseKey) {
                console.error('Please provide a valid license key');
            }
            else if (this.settings.licenseKey === '0000-0000-000-0000') {
                console.warn("lightGallery: " + this.settings.licenseKey + " license key is not valid for production use");
            }
        };
        LightGallery.prototype.getSlideItem = function (index) {
            return $LG(this.getSlideItemId(index));
        };
        LightGallery.prototype.getSlideItemId = function (index) {
            return "#lg-item-" + this.lgId + "-" + index;
        };
        LightGallery.prototype.getIdName = function (id) {
            return id + "-" + this.lgId;
        };
        LightGallery.prototype.getElementById = function (id) {
            return $LG("#" + this.getIdName(id));
        };
        LightGallery.prototype.manageSingleSlideClassName = function () {
            if (this.galleryItems.length < 2) {
                this.outer.addClass('lg-single-item');
            }
            else {
                this.outer.removeClass('lg-single-item');
            }
        };
        LightGallery.prototype.buildStructure = function () {
            var _this = this;
            var container = this.$container && this.$container.get();
            if (container) {
                return;
            }
            var controls = '';
            var subHtmlCont = '';
            // Create controls
            if (this.settings.controls) {
                controls = "<button type=\"button\" id=\"" + this.getIdName('lg-prev') + "\" aria-label=\"" + this.settings.strings['previousSlide'] + "\" class=\"lg-prev lg-icon\"> " + this.settings.prevHtml + " </button>\n                <button type=\"button\" id=\"" + this.getIdName('lg-next') + "\" aria-label=\"" + this.settings.strings['nextSlide'] + "\" class=\"lg-next lg-icon\"> " + this.settings.nextHtml + " </button>";
            }
            if (this.settings.appendSubHtmlTo !== '.lg-item') {
                subHtmlCont =
                    '<div class="lg-sub-html" role="status" aria-live="polite"></div>';
            }
            var addClasses = '';
            if (this.settings.allowMediaOverlap) {
                // Do not remove space before last single quote
                addClasses += 'lg-media-overlap ';
            }
            var ariaLabelledby = this.settings.ariaLabelledby
                ? 'aria-labelledby="' + this.settings.ariaLabelledby + '"'
                : '';
            var ariaDescribedby = this.settings.ariaDescribedby
                ? 'aria-describedby="' + this.settings.ariaDescribedby + '"'
                : '';
            var containerClassName = "lg-container " + this.settings.addClass + " " + (document.body !== this.settings.container ? 'lg-inline' : '');
            var closeIcon = this.settings.closable && this.settings.showCloseIcon
                ? "<button type=\"button\" aria-label=\"" + this.settings.strings['closeGallery'] + "\" id=\"" + this.getIdName('lg-close') + "\" class=\"lg-close lg-icon\"></button>"
                : '';
            var maximizeIcon = this.settings.showMaximizeIcon
                ? "<button type=\"button\" aria-label=\"" + this.settings.strings['toggleMaximize'] + "\" id=\"" + this.getIdName('lg-maximize') + "\" class=\"lg-maximize lg-icon\"></button>"
                : '';
            var template = "\n        <div class=\"" + containerClassName + "\" id=\"" + this.getIdName('lg-container') + "\" tabindex=\"-1\" aria-modal=\"true\" " + ariaLabelledby + " " + ariaDescribedby + " role=\"dialog\"\n        >\n            <div id=\"" + this.getIdName('lg-backdrop') + "\" class=\"lg-backdrop\"></div>\n\n            <div id=\"" + this.getIdName('lg-outer') + "\" class=\"lg-outer lg-use-css3 lg-css3 lg-hide-items " + addClasses + " \">\n\n              <div id=\"" + this.getIdName('lg-content') + "\" class=\"lg-content\">\n                <div id=\"" + this.getIdName('lg-inner') + "\" class=\"lg-inner\">\n                </div>\n                " + controls + "\n              </div>\n                <div id=\"" + this.getIdName('lg-toolbar') + "\" class=\"lg-toolbar lg-group\">\n                    " + maximizeIcon + "\n                    " + closeIcon + "\n                    </div>\n                    " + (this.settings.appendSubHtmlTo === '.lg-outer'
                ? subHtmlCont
                : '') + "\n                <div id=\"" + this.getIdName('lg-components') + "\" class=\"lg-components\">\n                    " + (this.settings.appendSubHtmlTo === '.lg-sub-html'
                ? subHtmlCont
                : '') + "\n                </div>\n            </div>\n        </div>\n        ";
            $LG(this.settings.container).append(template);
            if (document.body !== this.settings.container) {
                $LG(this.settings.container).css('position', 'relative');
            }
            this.outer = this.getElementById('lg-outer');
            this.$lgComponents = this.getElementById('lg-components');
            this.$backdrop = this.getElementById('lg-backdrop');
            this.$container = this.getElementById('lg-container');
            this.$inner = this.getElementById('lg-inner');
            this.$content = this.getElementById('lg-content');
            this.$toolbar = this.getElementById('lg-toolbar');
            this.$backdrop.css('transition-duration', this.settings.backdropDuration + 'ms');
            var outerClassNames = this.settings.mode + " ";
            this.manageSingleSlideClassName();
            if (this.settings.enableDrag) {
                outerClassNames += 'lg-grab ';
            }
            this.outer.addClass(outerClassNames);
            this.$inner.css('transition-timing-function', this.settings.easing);
            this.$inner.css('transition-duration', this.settings.speed + 'ms');
            if (this.settings.download) {
                this.$toolbar.append("<a id=\"" + this.getIdName('lg-download') + "\" target=\"_blank\" rel=\"noopener\" aria-label=\"" + this.settings.strings['download'] + "\" download class=\"lg-download lg-icon\"></a>");
            }
            this.counter();
            $LG(window).on("resize.lg.global" + this.lgId + " orientationchange.lg.global" + this.lgId, function () {
                _this.refreshOnResize();
            });
            this.hideBars();
            this.manageCloseGallery();
            this.toggleMaximize();
            this.initModules();
        };
        LightGallery.prototype.refreshOnResize = function () {
            if (this.lgOpened) {
                var currentGalleryItem = this.galleryItems[this.index];
                var __slideVideoInfo = currentGalleryItem.__slideVideoInfo;
                this.mediaContainerPosition = this.getMediaContainerPosition();
                var _a = this.mediaContainerPosition, top_1 = _a.top, bottom = _a.bottom;
                this.currentImageSize = utils.getSize(this.items[this.index], this.outer, top_1 + bottom, __slideVideoInfo && this.settings.videoMaxSize);
                if (__slideVideoInfo) {
                    this.resizeVideoSlide(this.index, this.currentImageSize);
                }
                if (this.zoomFromOrigin && !this.isDummyImageRemoved) {
                    var imgStyle = this.getDummyImgStyles(this.currentImageSize);
                    this.outer
                        .find('.lg-current .lg-dummy-img')
                        .first()
                        .attr('style', imgStyle);
                }
                this.LGel.trigger(lGEvents.containerResize);
            }
        };
        LightGallery.prototype.resizeVideoSlide = function (index, imageSize) {
            var lgVideoStyle = this.getVideoContStyle(imageSize);
            var currentSlide = this.getSlideItem(index);
            currentSlide.find('.lg-video-cont').attr('style', lgVideoStyle);
        };
        /**
         * Update slides dynamically.
         * Add, edit or delete slides dynamically when lightGallery is opened.
         * Modify the current gallery items and pass it via updateSlides method
         * @note
         * - Do not mutate existing lightGallery items directly.
         * - Always pass new list of gallery items
         * - You need to take care of thumbnails outside the gallery if any
         * - user this method only if you want to update slides when the gallery is opened. Otherwise, use `refresh()` method.
         * @param items Gallery items
         * @param index After the update operation, which slide gallery should navigate to
         * @category lGPublicMethods
         * @example
         * const plugin = lightGallery();
         *
         * // Adding slides dynamically
         * let galleryItems = [
         * // Access existing lightGallery items
         * // galleryItems are automatically generated internally from the gallery HTML markup
         * // or directly from galleryItems when dynamic gallery is used
         *   ...plugin.galleryItems,
         *     ...[
         *       {
         *         src: 'img/img-1.png',
         *           thumb: 'img/thumb1.png',
         *         },
         *     ],
         *   ];
         *   plugin.updateSlides(
         *     galleryItems,
         *     plugin.index,
         *   );
         *
         *
         * // Remove slides dynamically
         * galleryItems = JSON.parse(
         *   JSON.stringify(updateSlideInstance.galleryItems),
         * );
         * galleryItems.shift();
         * updateSlideInstance.updateSlides(galleryItems, 1);
         * @see <a href="/demos/update-slides/">Demo</a>
         */
        LightGallery.prototype.updateSlides = function (items, index) {
            if (this.index > items.length - 1) {
                this.index = items.length - 1;
            }
            if (items.length === 1) {
                this.index = 0;
            }
            if (!items.length) {
                this.closeGallery();
                return;
            }
            var currentSrc = this.galleryItems[index].src;
            this.galleryItems = items;
            this.updateControls();
            this.$inner.empty();
            this.currentItemsInDom = [];
            var _index = 0;
            // Find the current index based on source value of the slide
            this.galleryItems.some(function (galleryItem, itemIndex) {
                if (galleryItem.src === currentSrc) {
                    _index = itemIndex;
                    return true;
                }
                return false;
            });
            this.currentItemsInDom = this.organizeSlideItems(_index, -1);
            this.loadContent(_index, true);
            this.getSlideItem(_index).addClass('lg-current');
            this.index = _index;
            this.updateCurrentCounter(_index);
            this.LGel.trigger(lGEvents.updateSlides);
        };
        // Get gallery items based on multiple conditions
        LightGallery.prototype.getItems = function () {
            // Gallery items
            this.items = [];
            if (!this.settings.dynamic) {
                if (this.settings.selector === 'this') {
                    this.items.push(this.el);
                }
                else if (this.settings.selector) {
                    if (typeof this.settings.selector === 'string') {
                        if (this.settings.selectWithin) {
                            var selectWithin = $LG(this.settings.selectWithin);
                            this.items = selectWithin
                                .find(this.settings.selector)
                                .get();
                        }
                        else {
                            this.items = this.el.querySelectorAll(this.settings.selector);
                        }
                    }
                    else {
                        this.items = this.settings.selector;
                    }
                }
                else {
                    this.items = this.el.children;
                }
                return utils.getDynamicOptions(this.items, this.settings.extraProps, this.settings.getCaptionFromTitleOrAlt, this.settings.exThumbImage);
            }
            else {
                return this.settings.dynamicEl || [];
            }
        };
        LightGallery.prototype.shouldHideScrollbar = function () {
            return (this.settings.hideScrollbar &&
                document.body === this.settings.container);
        };
        LightGallery.prototype.hideScrollbar = function () {
            if (!this.shouldHideScrollbar()) {
                return;
            }
            this.bodyPaddingRight = parseFloat($LG('body').style().paddingRight);
            var bodyRect = document.documentElement.getBoundingClientRect();
            var scrollbarWidth = window.innerWidth - bodyRect.width;
            $LG(document.body).css('padding-right', scrollbarWidth + this.bodyPaddingRight + 'px');
            $LG(document.body).addClass('lg-overlay-open');
        };
        LightGallery.prototype.resetScrollBar = function () {
            if (!this.shouldHideScrollbar()) {
                return;
            }
            $LG(document.body).css('padding-right', this.bodyPaddingRight + 'px');
            $LG(document.body).removeClass('lg-overlay-open');
        };
        /**
         * Open lightGallery.
         * Open gallery with specific slide by passing index of the slide as parameter.
         * @category lGPublicMethods
         * @param {Number} index  - index of the slide
         * @param {HTMLElement} element - Which image lightGallery should zoom from
         *
         * @example
         * const $dynamicGallery = document.getElementById('dynamic-gallery-demo');
         * const dynamicGallery = lightGallery($dynamicGallery, {
         *     dynamic: true,
         *     dynamicEl: [
         *         {
         *              src: 'img/1.jpg',
         *              thumb: 'img/thumb-1.jpg',
         *              subHtml: '<h4>Image 1 title</h4><p>Image 1 descriptions.</p>',
         *         },
         *         ...
         *     ],
         * });
         * $dynamicGallery.addEventListener('click', function () {
         *     // Starts with third item.(Optional).
         *     // This is useful if you want use dynamic mode with
         *     // custom thumbnails (thumbnails outside gallery),
         *     dynamicGallery.openGallery(2);
         * });
         *
         */
        LightGallery.prototype.openGallery = function (index, element) {
            var _this = this;
            if (index === void 0) { index = this.settings.index; }
            // prevent accidental double execution
            if (this.lgOpened)
                return;
            this.lgOpened = true;
            this.outer.removeClass('lg-hide-items');
            this.hideScrollbar();
            // Add display block, but still has opacity 0
            this.$container.addClass('lg-show');
            var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, index);
            this.currentItemsInDom = itemsToBeInsertedToDom;
            var items = '';
            itemsToBeInsertedToDom.forEach(function (item) {
                items = items + ("<div id=\"" + item + "\" class=\"lg-item\"></div>");
            });
            this.$inner.append(items);
            this.addHtml(index);
            var transform = '';
            this.mediaContainerPosition = this.getMediaContainerPosition();
            var _a = this.mediaContainerPosition, top = _a.top, bottom = _a.bottom;
            if (!this.settings.allowMediaOverlap) {
                this.setMediaContainerPosition(top, bottom);
            }
            var __slideVideoInfo = this.galleryItems[index].__slideVideoInfo;
            if (this.zoomFromOrigin && element) {
                this.currentImageSize = utils.getSize(element, this.outer, top + bottom, __slideVideoInfo && this.settings.videoMaxSize);
                transform = utils.getTransform(element, this.outer, top, bottom, this.currentImageSize);
            }
            if (!this.zoomFromOrigin || !transform) {
                this.outer.addClass(this.settings.startClass);
                this.getSlideItem(index).removeClass('lg-complete');
            }
            var timeout = this.settings.zoomFromOrigin
                ? 100
                : this.settings.backdropDuration;
            setTimeout(function () {
                _this.outer.addClass('lg-components-open');
            }, timeout);
            this.index = index;
            this.LGel.trigger(lGEvents.beforeOpen);
            // add class lg-current to remove initial transition
            this.getSlideItem(index).addClass('lg-current');
            this.lGalleryOn = false;
            // Store the current scroll top value to scroll back after closing the gallery..
            this.prevScrollTop = $LG(window).scrollTop();
            setTimeout(function () {
                // Need to check both zoomFromOrigin and transform values as we need to set set the
                // default opening animation if user missed to add the lg-size attribute
                if (_this.zoomFromOrigin && transform) {
                    var currentSlide_1 = _this.getSlideItem(index);
                    currentSlide_1.css('transform', transform);
                    setTimeout(function () {
                        currentSlide_1
                            .addClass('lg-start-progress lg-start-end-progress')
                            .css('transition-duration', _this.settings.startAnimationDuration + 'ms');
                        _this.outer.addClass('lg-zoom-from-image');
                    });
                    setTimeout(function () {
                        currentSlide_1.css('transform', 'translate3d(0, 0, 0)');
                    }, 100);
                }
                setTimeout(function () {
                    _this.$backdrop.addClass('in');
                    _this.$container.addClass('lg-show-in');
                }, 10);
                setTimeout(function () {
                    if (_this.settings.trapFocus &&
                        document.body === _this.settings.container) {
                        _this.trapFocus();
                    }
                }, _this.settings.backdropDuration + 50);
                // lg-visible class resets gallery opacity to 1
                if (!_this.zoomFromOrigin || !transform) {
                    setTimeout(function () {
                        _this.outer.addClass('lg-visible');
                    }, _this.settings.backdropDuration);
                }
                // initiate slide function
                _this.slide(index, false, false, false);
                _this.LGel.trigger(lGEvents.afterOpen);
            });
            if (document.body === this.settings.container) {
                $LG('html').addClass('lg-on');
            }
        };
        /**
         * Note - Changing the position of the media on every slide transition creates a flickering effect.
         * Therefore, The height of the caption is calculated dynamically, only once based on the first slide caption.
         * if you have dynamic captions for each media,
         * you can provide an appropriate height for the captions via allowMediaOverlap option
         */
        LightGallery.prototype.getMediaContainerPosition = function () {
            if (this.settings.allowMediaOverlap) {
                return {
                    top: 0,
                    bottom: 0,
                };
            }
            var top = this.$toolbar.get().clientHeight || 0;
            var subHtml = this.outer.find('.lg-components .lg-sub-html').get();
            var captionHeight = this.settings.defaultCaptionHeight ||
                (subHtml && subHtml.clientHeight) ||
                0;
            var thumbContainer = this.outer.find('.lg-thumb-outer').get();
            var thumbHeight = thumbContainer ? thumbContainer.clientHeight : 0;
            var bottom = thumbHeight + captionHeight;
            return {
                top: top,
                bottom: bottom,
            };
        };
        LightGallery.prototype.setMediaContainerPosition = function (top, bottom) {
            if (top === void 0) { top = 0; }
            if (bottom === void 0) { bottom = 0; }
            this.$content.css('top', top + 'px').css('bottom', bottom + 'px');
        };
        LightGallery.prototype.hideBars = function () {
            var _this = this;
            // Hide controllers if mouse doesn't move for some period
            setTimeout(function () {
                _this.outer.removeClass('lg-hide-items');
                if (_this.settings.hideBarsDelay > 0) {
                    _this.outer.on('mousemove.lg click.lg touchstart.lg', function () {
                        _this.outer.removeClass('lg-hide-items');
                        clearTimeout(_this.hideBarTimeout);
                        // Timeout will be cleared on each slide movement also
                        _this.hideBarTimeout = setTimeout(function () {
                            _this.outer.addClass('lg-hide-items');
                        }, _this.settings.hideBarsDelay);
                    });
                    _this.outer.trigger('mousemove.lg');
                }
            }, this.settings.showBarsAfter);
        };
        LightGallery.prototype.initPictureFill = function ($img) {
            if (this.settings.supportLegacyBrowser) {
                try {
                    picturefill({
                        elements: [$img.get()],
                    });
                }
                catch (e) {
                    console.warn('lightGallery :- If you want srcset or picture tag to be supported for older browser please include picturefil javascript library in your document.');
                }
            }
        };
        /**
         *  @desc Create image counter
         *  Ex: 1/10
         */
        LightGallery.prototype.counter = function () {
            if (this.settings.counter) {
                var counterHtml = "<div class=\"lg-counter\" role=\"status\" aria-live=\"polite\">\n                <span id=\"" + this.getIdName('lg-counter-current') + "\" class=\"lg-counter-current\">" + (this.index + 1) + " </span> /\n                <span id=\"" + this.getIdName('lg-counter-all') + "\" class=\"lg-counter-all\">" + this.galleryItems.length + " </span></div>";
                this.outer.find(this.settings.appendCounterTo).append(counterHtml);
            }
        };
        /**
         *  @desc add sub-html into the slide
         *  @param {Number} index - index of the slide
         */
        LightGallery.prototype.addHtml = function (index) {
            var subHtml;
            var subHtmlUrl;
            if (this.galleryItems[index].subHtmlUrl) {
                subHtmlUrl = this.galleryItems[index].subHtmlUrl;
            }
            else {
                subHtml = this.galleryItems[index].subHtml;
            }
            if (!subHtmlUrl) {
                if (subHtml) {
                    // get first letter of sub-html
                    // if first letter starts with . or # get the html form the jQuery object
                    var fL = subHtml.substring(0, 1);
                    if (fL === '.' || fL === '#') {
                        if (this.settings.subHtmlSelectorRelative &&
                            !this.settings.dynamic) {
                            subHtml = $LG(this.items)
                                .eq(index)
                                .find(subHtml)
                                .first()
                                .html();
                        }
                        else {
                            subHtml = $LG(subHtml).first().html();
                        }
                    }
                }
                else {
                    subHtml = '';
                }
            }
            if (this.settings.appendSubHtmlTo !== '.lg-item') {
                if (subHtmlUrl) {
                    utils.fetchCaptionFromUrl(subHtmlUrl, this.outer.find('.lg-sub-html'), 'replace');
                }
                else {
                    this.outer.find('.lg-sub-html').html(subHtml);
                }
            }
            else {
                var currentSlide = $LG(this.getSlideItemId(index));
                if (subHtmlUrl) {
                    utils.fetchCaptionFromUrl(subHtmlUrl, currentSlide, 'append');
                }
                else {
                    currentSlide.append("<div class=\"lg-sub-html\">" + subHtml + "</div>");
                }
            }
            // Add lg-empty-html class if title doesn't exist
            if (typeof subHtml !== 'undefined' && subHtml !== null) {
                if (subHtml === '') {
                    this.outer
                        .find(this.settings.appendSubHtmlTo)
                        .addClass('lg-empty-html');
                }
                else {
                    this.outer
                        .find(this.settings.appendSubHtmlTo)
                        .removeClass('lg-empty-html');
                }
            }
            this.LGel.trigger(lGEvents.afterAppendSubHtml, {
                index: index,
            });
        };
        /**
         *  @desc Preload slides
         *  @param {Number} index - index of the slide
         * @todo preload not working for the first slide, Also, should work for the first and last slide as well
         */
        LightGallery.prototype.preload = function (index) {
            for (var i = 1; i <= this.settings.preload; i++) {
                if (i >= this.galleryItems.length - index) {
                    break;
                }
                this.loadContent(index + i, false);
            }
            for (var j = 1; j <= this.settings.preload; j++) {
                if (index - j < 0) {
                    break;
                }
                this.loadContent(index - j, false);
            }
        };
        LightGallery.prototype.getDummyImgStyles = function (imageSize) {
            if (!imageSize)
                return '';
            return "width:" + imageSize.width + "px;\n                margin-left: -" + imageSize.width / 2 + "px;\n                margin-top: -" + imageSize.height / 2 + "px;\n                height:" + imageSize.height + "px";
        };
        LightGallery.prototype.getVideoContStyle = function (imageSize) {
            if (!imageSize)
                return '';
            return "width:" + imageSize.width + "px;\n                height:" + imageSize.height + "px";
        };
        LightGallery.prototype.getDummyImageContent = function ($currentSlide, index, alt) {
            var $currentItem;
            if (!this.settings.dynamic) {
                $currentItem = $LG(this.items).eq(index);
            }
            if ($currentItem) {
                var _dummyImgSrc = void 0;
                if (!this.settings.exThumbImage) {
                    _dummyImgSrc = $currentItem.find('img').first().attr('src');
                }
                else {
                    _dummyImgSrc = $currentItem.attr(this.settings.exThumbImage);
                }
                if (!_dummyImgSrc)
                    return '';
                var imgStyle = this.getDummyImgStyles(this.currentImageSize);
                var dummyImgContentImg = document.createElement('img');
                dummyImgContentImg.alt = alt || '';
                dummyImgContentImg.src = _dummyImgSrc;
                dummyImgContentImg.className = "lg-dummy-img";
                dummyImgContentImg.style.cssText = imgStyle;
                $currentSlide.addClass('lg-first-slide');
                this.outer.addClass('lg-first-slide-loading');
                return dummyImgContentImg;
            }
            return '';
        };
        LightGallery.prototype.setImgMarkup = function (src, $currentSlide, index) {
            var currentGalleryItem = this.galleryItems[index];
            var alt = currentGalleryItem.alt, srcset = currentGalleryItem.srcset, sizes = currentGalleryItem.sizes, sources = currentGalleryItem.sources;
            // Use the thumbnail as dummy image which will be resized to actual image size and
            // displayed on top of actual image
            var imgContent = '';
            var altAttr = alt ? 'alt="' + alt + '"' : '';
            if (this.isFirstSlideWithZoomAnimation()) {
                imgContent = this.getDummyImageContent($currentSlide, index, altAttr);
            }
            else {
                imgContent = utils.getImgMarkup(index, src, altAttr, srcset, sizes, sources);
            }
            var picture = document.createElement('picture');
            picture.className = 'lg-img-wrap';
            $LG(picture).append(imgContent);
            $currentSlide.prepend(picture);
        };
        LightGallery.prototype.onSlideObjectLoad = function ($slide, isHTML5VideoWithoutPoster, onLoad, onError) {
            var mediaObject = $slide.find('.lg-object').first();
            if (utils.isImageLoaded(mediaObject.get()) ||
                isHTML5VideoWithoutPoster) {
                onLoad();
            }
            else {
                mediaObject.on('load.lg error.lg', function () {
                    onLoad && onLoad();
                });
                mediaObject.on('error.lg', function () {
                    onError && onError();
                });
            }
        };
        /**
         *
         * @param $el Current slide item
         * @param index
         * @param delay Delay is 0 except first time
         * @param speed Speed is same as delay, except it is 0 if gallery is opened via hash plugin
         * @param isFirstSlide
         */
        LightGallery.prototype.onLgObjectLoad = function (currentSlide, index, delay, speed, isFirstSlide, isHTML5VideoWithoutPoster) {
            var _this = this;
            this.onSlideObjectLoad(currentSlide, isHTML5VideoWithoutPoster, function () {
                _this.triggerSlideItemLoad(currentSlide, index, delay, speed, isFirstSlide);
            }, function () {
                currentSlide.addClass('lg-complete lg-complete_');
                currentSlide.html('<span class="lg-error-msg">' +
                    _this.settings.strings['mediaLoadingFailed'] +
                    '</span>');
            });
        };
        LightGallery.prototype.triggerSlideItemLoad = function ($currentSlide, index, delay, speed, isFirstSlide) {
            var _this = this;
            var currentGalleryItem = this.galleryItems[index];
            // Adding delay for video slides without poster for better performance and user experience
            // Videos should start playing once once the gallery is completely loaded
            var _speed = isFirstSlide &&
                this.getSlideType(currentGalleryItem) === 'video' &&
                !currentGalleryItem.poster
                ? speed
                : 0;
            setTimeout(function () {
                $currentSlide.addClass('lg-complete lg-complete_');
                _this.LGel.trigger(lGEvents.slideItemLoad, {
                    index: index,
                    delay: delay || 0,
                    isFirstSlide: isFirstSlide,
                });
            }, _speed);
        };
        LightGallery.prototype.isFirstSlideWithZoomAnimation = function () {
            return !!(!this.lGalleryOn &&
                this.zoomFromOrigin &&
                this.currentImageSize);
        };
        // Add video slideInfo
        LightGallery.prototype.addSlideVideoInfo = function (items) {
            var _this = this;
            items.forEach(function (element, index) {
                element.__slideVideoInfo = utils.isVideo(element.src, !!element.video, index);
                if (element.__slideVideoInfo &&
                    _this.settings.loadYouTubePoster &&
                    !element.poster &&
                    element.__slideVideoInfo.youtube) {
                    element.poster = "//img.youtube.com/vi/" + element.__slideVideoInfo.youtube[1] + "/maxresdefault.jpg";
                }
            });
        };
        /**
         *  Load slide content into slide.
         *  This is used to load content into slides that is not visible too
         *  @param {Number} index - index of the slide.
         *  @param {Boolean} rec - if true call loadcontent() function again.
         */
        LightGallery.prototype.loadContent = function (index, rec) {
            var _this = this;
            var currentGalleryItem = this.galleryItems[index];
            var $currentSlide = $LG(this.getSlideItemId(index));
            var poster = currentGalleryItem.poster, srcset = currentGalleryItem.srcset, sizes = currentGalleryItem.sizes, sources = currentGalleryItem.sources;
            var src = currentGalleryItem.src;
            var video = currentGalleryItem.video;
            var _html5Video = video && typeof video === 'string' ? JSON.parse(video) : video;
            if (currentGalleryItem.responsive) {
                var srcDyItms = currentGalleryItem.responsive.split(',');
                src = utils.getResponsiveSrc(srcDyItms) || src;
            }
            var videoInfo = currentGalleryItem.__slideVideoInfo;
            var lgVideoStyle = '';
            var iframe = !!currentGalleryItem.iframe;
            var isFirstSlide = !this.lGalleryOn;
            // delay for adding complete class. it is 0 except first time.
            var delay = 0;
            if (isFirstSlide) {
                if (this.zoomFromOrigin && this.currentImageSize) {
                    delay = this.settings.startAnimationDuration + 10;
                }
                else {
                    delay = this.settings.backdropDuration + 10;
                }
            }
            if (!$currentSlide.hasClass('lg-loaded')) {
                if (videoInfo) {
                    var _a = this.mediaContainerPosition, top_2 = _a.top, bottom = _a.bottom;
                    var videoSize = utils.getSize(this.items[index], this.outer, top_2 + bottom, videoInfo && this.settings.videoMaxSize);
                    lgVideoStyle = this.getVideoContStyle(videoSize);
                }
                if (iframe) {
                    var markup = utils.getIframeMarkup(this.settings.iframeWidth, this.settings.iframeHeight, this.settings.iframeMaxWidth, this.settings.iframeMaxHeight, src, currentGalleryItem.iframeTitle);
                    $currentSlide.prepend(markup);
                }
                else if (poster) {
                    var dummyImg = '';
                    var hasStartAnimation = isFirstSlide &&
                        this.zoomFromOrigin &&
                        this.currentImageSize;
                    if (hasStartAnimation) {
                        dummyImg = this.getDummyImageContent($currentSlide, index, '');
                    }
                    var markup = utils.getVideoPosterMarkup(poster, dummyImg || '', lgVideoStyle, this.settings.strings['playVideo'], videoInfo);
                    $currentSlide.prepend(markup);
                }
                else if (videoInfo) {
                    var markup = "<div class=\"lg-video-cont \" style=\"" + lgVideoStyle + "\"></div>";
                    $currentSlide.prepend(markup);
                }
                else {
                    this.setImgMarkup(src, $currentSlide, index);
                    if (srcset || sources) {
                        var $img = $currentSlide.find('.lg-object');
                        this.initPictureFill($img);
                    }
                }
                if (poster || videoInfo) {
                    this.LGel.trigger(lGEvents.hasVideo, {
                        index: index,
                        src: src,
                        html5Video: _html5Video,
                        hasPoster: !!poster,
                    });
                }
                this.LGel.trigger(lGEvents.afterAppendSlide, { index: index });
                if (this.lGalleryOn &&
                    this.settings.appendSubHtmlTo === '.lg-item') {
                    this.addHtml(index);
                }
            }
            // For first time add some delay for displaying the start animation.
            var _speed = 0;
            // Do not change the delay value because it is required for zoom plugin.
            // If gallery opened from direct url (hash) speed value should be 0
            if (delay && !$LG(document.body).hasClass('lg-from-hash')) {
                _speed = delay;
            }
            // Only for first slide and zoomFromOrigin is enabled
            if (this.isFirstSlideWithZoomAnimation()) {
                setTimeout(function () {
                    $currentSlide
                        .removeClass('lg-start-end-progress lg-start-progress')
                        .removeAttr('style');
                }, this.settings.startAnimationDuration + 100);
                if (!$currentSlide.hasClass('lg-loaded')) {
                    setTimeout(function () {
                        if (_this.getSlideType(currentGalleryItem) === 'image') {
                            var alt = currentGalleryItem.alt;
                            var altAttr = alt ? 'alt="' + alt + '"' : '';
                            $currentSlide
                                .find('.lg-img-wrap')
                                .append(utils.getImgMarkup(index, src, altAttr, srcset, sizes, currentGalleryItem.sources));
                            if (srcset || sources) {
                                var $img = $currentSlide.find('.lg-object');
                                _this.initPictureFill($img);
                            }
                        }
                        if (_this.getSlideType(currentGalleryItem) === 'image' ||
                            (_this.getSlideType(currentGalleryItem) === 'video' &&
                                poster)) {
                            _this.onLgObjectLoad($currentSlide, index, delay, _speed, true, false);
                            // load remaining slides once the slide is completely loaded
                            _this.onSlideObjectLoad($currentSlide, !!(videoInfo && videoInfo.html5 && !poster), function () {
                                _this.loadContentOnFirstSlideLoad(index, $currentSlide, _speed);
                            }, function () {
                                _this.loadContentOnFirstSlideLoad(index, $currentSlide, _speed);
                            });
                        }
                    }, this.settings.startAnimationDuration + 100);
                }
            }
            // SLide content has been added to dom
            $currentSlide.addClass('lg-loaded');
            if (!this.isFirstSlideWithZoomAnimation() ||
                (this.getSlideType(currentGalleryItem) === 'video' && !poster)) {
                this.onLgObjectLoad($currentSlide, index, delay, _speed, isFirstSlide, !!(videoInfo && videoInfo.html5 && !poster));
            }
            // When gallery is opened once content is loaded (second time) need to add lg-complete class for css styling
            if ((!this.zoomFromOrigin || !this.currentImageSize) &&
                $currentSlide.hasClass('lg-complete_') &&
                !this.lGalleryOn) {
                setTimeout(function () {
                    $currentSlide.addClass('lg-complete');
                }, this.settings.backdropDuration);
            }
            // Content loaded
            // Need to set lGalleryOn before calling preload function
            this.lGalleryOn = true;
            if (rec === true) {
                if (!$currentSlide.hasClass('lg-complete_')) {
                    $currentSlide
                        .find('.lg-object')
                        .first()
                        .on('load.lg error.lg', function () {
                        _this.preload(index);
                    });
                }
                else {
                    this.preload(index);
                }
            }
        };
        /**
         * @desc Remove dummy image content and load next slides
         * Called only for the first time if zoomFromOrigin animation is enabled
         * @param index
         * @param $currentSlide
         * @param speed
         */
        LightGallery.prototype.loadContentOnFirstSlideLoad = function (index, $currentSlide, speed) {
            var _this = this;
            setTimeout(function () {
                $currentSlide.find('.lg-dummy-img').remove();
                $currentSlide.removeClass('lg-first-slide');
                _this.outer.removeClass('lg-first-slide-loading');
                _this.isDummyImageRemoved = true;
                _this.preload(index);
            }, speed + 300);
        };
        LightGallery.prototype.getItemsToBeInsertedToDom = function (index, prevIndex, numberOfItems) {
            var _this = this;
            if (numberOfItems === void 0) { numberOfItems = 0; }
            var itemsToBeInsertedToDom = [];
            // Minimum 2 items should be there
            var possibleNumberOfItems = Math.max(numberOfItems, 3);
            possibleNumberOfItems = Math.min(possibleNumberOfItems, this.galleryItems.length);
            var prevIndexItem = "lg-item-" + this.lgId + "-" + prevIndex;
            if (this.galleryItems.length <= 3) {
                this.galleryItems.forEach(function (_element, index) {
                    itemsToBeInsertedToDom.push("lg-item-" + _this.lgId + "-" + index);
                });
                return itemsToBeInsertedToDom;
            }
            if (index < (this.galleryItems.length - 1) / 2) {
                for (var idx = index; idx > index - possibleNumberOfItems / 2 && idx >= 0; idx--) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
                }
                var numberOfExistingItems = itemsToBeInsertedToDom.length;
                for (var idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index + idx + 1));
                }
            }
            else {
                for (var idx = index; idx <= this.galleryItems.length - 1 &&
                    idx < index + possibleNumberOfItems / 2; idx++) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
                }
                var numberOfExistingItems = itemsToBeInsertedToDom.length;
                for (var idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index - idx - 1));
                }
            }
            if (this.settings.loop) {
                if (index === this.galleryItems.length - 1) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + 0);
                }
                else if (index === 0) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (this.galleryItems.length - 1));
                }
            }
            if (itemsToBeInsertedToDom.indexOf(prevIndexItem) === -1) {
                itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + prevIndex);
            }
            return itemsToBeInsertedToDom;
        };
        LightGallery.prototype.organizeSlideItems = function (index, prevIndex) {
            var _this = this;
            var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, prevIndex, this.settings.numberOfSlideItemsInDom);
            itemsToBeInsertedToDom.forEach(function (item) {
                if (_this.currentItemsInDom.indexOf(item) === -1) {
                    _this.$inner.append("<div id=\"" + item + "\" class=\"lg-item\"></div>");
                }
            });
            this.currentItemsInDom.forEach(function (item) {
                if (itemsToBeInsertedToDom.indexOf(item) === -1) {
                    $LG("#" + item).remove();
                }
            });
            return itemsToBeInsertedToDom;
        };
        /**
         * Get previous index of the slide
         */
        LightGallery.prototype.getPreviousSlideIndex = function () {
            var prevIndex = 0;
            try {
                var currentItemId = this.outer
                    .find('.lg-current')
                    .first()
                    .attr('id');
                prevIndex = parseInt(currentItemId.split('-')[3]) || 0;
            }
            catch (error) {
                prevIndex = 0;
            }
            return prevIndex;
        };
        LightGallery.prototype.setDownloadValue = function (index) {
            if (this.settings.download) {
                var currentGalleryItem = this.galleryItems[index];
                var hideDownloadBtn = currentGalleryItem.downloadUrl === false ||
                    currentGalleryItem.downloadUrl === 'false';
                if (hideDownloadBtn) {
                    this.outer.addClass('lg-hide-download');
                }
                else {
                    var $download = this.getElementById('lg-download');
                    this.outer.removeClass('lg-hide-download');
                    $download.attr('href', currentGalleryItem.downloadUrl ||
                        currentGalleryItem.src);
                    if (currentGalleryItem.download) {
                        $download.attr('download', currentGalleryItem.download);
                    }
                }
            }
        };
        LightGallery.prototype.makeSlideAnimation = function (direction, currentSlideItem, previousSlideItem) {
            var _this = this;
            if (this.lGalleryOn) {
                previousSlideItem.addClass('lg-slide-progress');
            }
            setTimeout(function () {
                // remove all transitions
                _this.outer.addClass('lg-no-trans');
                _this.outer
                    .find('.lg-item')
                    .removeClass('lg-prev-slide lg-next-slide');
                if (direction === 'prev') {
                    //prevslide
                    currentSlideItem.addClass('lg-prev-slide');
                    previousSlideItem.addClass('lg-next-slide');
                }
                else {
                    // next slide
                    currentSlideItem.addClass('lg-next-slide');
                    previousSlideItem.addClass('lg-prev-slide');
                }
                // give 50 ms for browser to add/remove class
                setTimeout(function () {
                    _this.outer.find('.lg-item').removeClass('lg-current');
                    currentSlideItem.addClass('lg-current');
                    // reset all transitions
                    _this.outer.removeClass('lg-no-trans');
                }, 50);
            }, this.lGalleryOn ? this.settings.slideDelay : 0);
        };
        /**
         * Goto a specific slide.
         * @param {Number} index - index of the slide
         * @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
         * @param {Boolean} fromThumb - true if slide function called via thumbnail click
         * @param {String} direction - Direction of the slide(next/prev)
         * @category lGPublicMethods
         * @example
         *  const plugin = lightGallery();
         *  // to go to 3rd slide
         *  plugin.slide(2);
         *
         */
        LightGallery.prototype.slide = function (index, fromTouch, fromThumb, direction) {
            var _this = this;
            var prevIndex = this.getPreviousSlideIndex();
            this.currentItemsInDom = this.organizeSlideItems(index, prevIndex);
            // Prevent multiple call, Required for hsh plugin
            if (this.lGalleryOn && prevIndex === index) {
                return;
            }
            var numberOfGalleryItems = this.galleryItems.length;
            if (!this.lgBusy) {
                if (this.settings.counter) {
                    this.updateCurrentCounter(index);
                }
                var currentSlideItem = this.getSlideItem(index);
                var previousSlideItem_1 = this.getSlideItem(prevIndex);
                var currentGalleryItem = this.galleryItems[index];
                var videoInfo = currentGalleryItem.__slideVideoInfo;
                this.outer.attr('data-lg-slide-type', this.getSlideType(currentGalleryItem));
                this.setDownloadValue(index);
                if (videoInfo) {
                    var _a = this.mediaContainerPosition, top_3 = _a.top, bottom = _a.bottom;
                    var videoSize = utils.getSize(this.items[index], this.outer, top_3 + bottom, videoInfo && this.settings.videoMaxSize);
                    this.resizeVideoSlide(index, videoSize);
                }
                this.LGel.trigger(lGEvents.beforeSlide, {
                    prevIndex: prevIndex,
                    index: index,
                    fromTouch: !!fromTouch,
                    fromThumb: !!fromThumb,
                });
                this.lgBusy = true;
                clearTimeout(this.hideBarTimeout);
                this.arrowDisable(index);
                if (!direction) {
                    if (index < prevIndex) {
                        direction = 'prev';
                    }
                    else if (index > prevIndex) {
                        direction = 'next';
                    }
                }
                if (!fromTouch) {
                    this.makeSlideAnimation(direction, currentSlideItem, previousSlideItem_1);
                }
                else {
                    this.outer
                        .find('.lg-item')
                        .removeClass('lg-prev-slide lg-current lg-next-slide');
                    var touchPrev = void 0;
                    var touchNext = void 0;
                    if (numberOfGalleryItems > 2) {
                        touchPrev = index - 1;
                        touchNext = index + 1;
                        if (index === 0 && prevIndex === numberOfGalleryItems - 1) {
                            // next slide
                            touchNext = 0;
                            touchPrev = numberOfGalleryItems - 1;
                        }
                        else if (index === numberOfGalleryItems - 1 &&
                            prevIndex === 0) {
                            // prev slide
                            touchNext = 0;
                            touchPrev = numberOfGalleryItems - 1;
                        }
                    }
                    else {
                        touchPrev = 0;
                        touchNext = 1;
                    }
                    if (direction === 'prev') {
                        this.getSlideItem(touchNext).addClass('lg-next-slide');
                    }
                    else {
                        this.getSlideItem(touchPrev).addClass('lg-prev-slide');
                    }
                    currentSlideItem.addClass('lg-current');
                }
                // Do not put load content in set timeout as it needs to load immediately when the gallery is opened
                if (!this.lGalleryOn) {
                    this.loadContent(index, true);
                }
                else {
                    setTimeout(function () {
                        _this.loadContent(index, true);
                        // Add title if this.settings.appendSubHtmlTo === lg-sub-html
                        if (_this.settings.appendSubHtmlTo !== '.lg-item') {
                            _this.addHtml(index);
                        }
                    }, this.settings.speed + 50 + (fromTouch ? 0 : this.settings.slideDelay));
                }
                setTimeout(function () {
                    _this.lgBusy = false;
                    previousSlideItem_1.removeClass('lg-slide-progress');
                    _this.LGel.trigger(lGEvents.afterSlide, {
                        prevIndex: prevIndex,
                        index: index,
                        fromTouch: fromTouch,
                        fromThumb: fromThumb,
                    });
                }, (this.lGalleryOn ? this.settings.speed + 100 : 100) + (fromTouch ? 0 : this.settings.slideDelay));
            }
            this.index = index;
        };
        LightGallery.prototype.updateCurrentCounter = function (index) {
            this.getElementById('lg-counter-current').html(index + 1 + '');
        };
        LightGallery.prototype.updateCounterTotal = function () {
            this.getElementById('lg-counter-all').html(this.galleryItems.length + '');
        };
        LightGallery.prototype.getSlideType = function (item) {
            if (item.__slideVideoInfo) {
                return 'video';
            }
            else if (item.iframe) {
                return 'iframe';
            }
            else {
                return 'image';
            }
        };
        LightGallery.prototype.touchMove = function (startCoords, endCoords, e) {
            var distanceX = endCoords.pageX - startCoords.pageX;
            var distanceY = endCoords.pageY - startCoords.pageY;
            var allowSwipe = false;
            if (this.swipeDirection) {
                allowSwipe = true;
            }
            else {
                if (Math.abs(distanceX) > 15) {
                    this.swipeDirection = 'horizontal';
                    allowSwipe = true;
                }
                else if (Math.abs(distanceY) > 15) {
                    this.swipeDirection = 'vertical';
                    allowSwipe = true;
                }
            }
            if (!allowSwipe) {
                return;
            }
            var $currentSlide = this.getSlideItem(this.index);
            if (this.swipeDirection === 'horizontal') {
                e === null || e === void 0 ? void 0 : e.preventDefault();
                // reset opacity and transition duration
                this.outer.addClass('lg-dragging');
                // move current slide
                this.setTranslate($currentSlide, distanceX, 0);
                // move next and prev slide with current slide
                var width = $currentSlide.get().offsetWidth;
                var slideWidthAmount = (width * 15) / 100;
                var gutter = slideWidthAmount - Math.abs((distanceX * 10) / 100);
                this.setTranslate(this.outer.find('.lg-prev-slide').first(), -width + distanceX - gutter, 0);
                this.setTranslate(this.outer.find('.lg-next-slide').first(), width + distanceX + gutter, 0);
            }
            else if (this.swipeDirection === 'vertical') {
                if (this.settings.swipeToClose) {
                    e === null || e === void 0 ? void 0 : e.preventDefault();
                    this.$container.addClass('lg-dragging-vertical');
                    var opacity = 1 - Math.abs(distanceY) / window.innerHeight;
                    this.$backdrop.css('opacity', opacity);
                    var scale = 1 - Math.abs(distanceY) / (window.innerWidth * 2);
                    this.setTranslate($currentSlide, 0, distanceY, scale, scale);
                    if (Math.abs(distanceY) > 100) {
                        this.outer
                            .addClass('lg-hide-items')
                            .removeClass('lg-components-open');
                    }
                }
            }
        };
        LightGallery.prototype.touchEnd = function (endCoords, startCoords, event) {
            var _this = this;
            var distance;
            // keep slide animation for any mode while dragg/swipe
            if (this.settings.mode !== 'lg-slide') {
                this.outer.addClass('lg-slide');
            }
            // set transition duration
            setTimeout(function () {
                _this.$container.removeClass('lg-dragging-vertical');
                _this.outer
                    .removeClass('lg-dragging lg-hide-items')
                    .addClass('lg-components-open');
                var triggerClick = true;
                if (_this.swipeDirection === 'horizontal') {
                    distance = endCoords.pageX - startCoords.pageX;
                    var distanceAbs = Math.abs(endCoords.pageX - startCoords.pageX);
                    if (distance < 0 &&
                        distanceAbs > _this.settings.swipeThreshold) {
                        _this.goToNextSlide(true);
                        triggerClick = false;
                    }
                    else if (distance > 0 &&
                        distanceAbs > _this.settings.swipeThreshold) {
                        _this.goToPrevSlide(true);
                        triggerClick = false;
                    }
                }
                else if (_this.swipeDirection === 'vertical') {
                    distance = Math.abs(endCoords.pageY - startCoords.pageY);
                    if (_this.settings.closable &&
                        _this.settings.swipeToClose &&
                        distance > 100) {
                        _this.closeGallery();
                        return;
                    }
                    else {
                        _this.$backdrop.css('opacity', 1);
                    }
                }
                _this.outer.find('.lg-item').removeAttr('style');
                if (triggerClick &&
                    Math.abs(endCoords.pageX - startCoords.pageX) < 5) {
                    // Trigger click if distance is less than 5 pix
                    var target = $LG(event.target);
                    if (_this.isPosterElement(target)) {
                        _this.LGel.trigger(lGEvents.posterClick);
                    }
                }
                _this.swipeDirection = undefined;
            });
            // remove slide class once drag/swipe is completed if mode is not slide
            setTimeout(function () {
                if (!_this.outer.hasClass('lg-dragging') &&
                    _this.settings.mode !== 'lg-slide') {
                    _this.outer.removeClass('lg-slide');
                }
            }, this.settings.speed + 100);
        };
        LightGallery.prototype.enableSwipe = function () {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isMoved = false;
            var isSwiping = false;
            if (this.settings.enableSwipe) {
                this.$inner.on('touchstart.lg', function (e) {
                    _this.dragOrSwipeEnabled = true;
                    var $item = _this.getSlideItem(_this.index);
                    if (($LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target)) &&
                        !_this.outer.hasClass('lg-zoomed') &&
                        !_this.lgBusy &&
                        e.touches.length === 1) {
                        isSwiping = true;
                        _this.touchAction = 'swipe';
                        _this.manageSwipeClass();
                        startCoords = {
                            pageX: e.touches[0].pageX,
                            pageY: e.touches[0].pageY,
                        };
                    }
                });
                this.$inner.on('touchmove.lg', function (e) {
                    if (isSwiping &&
                        _this.touchAction === 'swipe' &&
                        e.touches.length === 1) {
                        endCoords = {
                            pageX: e.touches[0].pageX,
                            pageY: e.touches[0].pageY,
                        };
                        _this.touchMove(startCoords, endCoords, e);
                        isMoved = true;
                    }
                });
                this.$inner.on('touchend.lg', function (event) {
                    if (_this.touchAction === 'swipe') {
                        if (isMoved) {
                            isMoved = false;
                            _this.touchEnd(endCoords, startCoords, event);
                        }
                        else if (isSwiping) {
                            var target = $LG(event.target);
                            if (_this.isPosterElement(target)) {
                                _this.LGel.trigger(lGEvents.posterClick);
                            }
                        }
                        _this.touchAction = undefined;
                        isSwiping = false;
                    }
                });
            }
        };
        LightGallery.prototype.enableDrag = function () {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isDraging = false;
            var isMoved = false;
            if (this.settings.enableDrag) {
                this.outer.on('mousedown.lg', function (e) {
                    _this.dragOrSwipeEnabled = true;
                    var $item = _this.getSlideItem(_this.index);
                    if ($LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target)) {
                        if (!_this.outer.hasClass('lg-zoomed') && !_this.lgBusy) {
                            e.preventDefault();
                            if (!_this.lgBusy) {
                                _this.manageSwipeClass();
                                startCoords = {
                                    pageX: e.pageX,
                                    pageY: e.pageY,
                                };
                                isDraging = true;
                                // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                                _this.outer.get().scrollLeft += 1;
                                _this.outer.get().scrollLeft -= 1;
                                // *
                                _this.outer
                                    .removeClass('lg-grab')
                                    .addClass('lg-grabbing');
                                _this.LGel.trigger(lGEvents.dragStart);
                            }
                        }
                    }
                });
                $LG(window).on("mousemove.lg.global" + this.lgId, function (e) {
                    if (isDraging && _this.lgOpened) {
                        isMoved = true;
                        endCoords = {
                            pageX: e.pageX,
                            pageY: e.pageY,
                        };
                        _this.touchMove(startCoords, endCoords);
                        _this.LGel.trigger(lGEvents.dragMove);
                    }
                });
                $LG(window).on("mouseup.lg.global" + this.lgId, function (event) {
                    if (!_this.lgOpened) {
                        return;
                    }
                    var target = $LG(event.target);
                    if (isMoved) {
                        isMoved = false;
                        _this.touchEnd(endCoords, startCoords, event);
                        _this.LGel.trigger(lGEvents.dragEnd);
                    }
                    else if (_this.isPosterElement(target)) {
                        _this.LGel.trigger(lGEvents.posterClick);
                    }
                    // Prevent execution on click
                    if (isDraging) {
                        isDraging = false;
                        _this.outer.removeClass('lg-grabbing').addClass('lg-grab');
                    }
                });
            }
        };
        LightGallery.prototype.triggerPosterClick = function () {
            var _this = this;
            this.$inner.on('click.lg', function (event) {
                if (!_this.dragOrSwipeEnabled &&
                    _this.isPosterElement($LG(event.target))) {
                    _this.LGel.trigger(lGEvents.posterClick);
                }
            });
        };
        LightGallery.prototype.manageSwipeClass = function () {
            var _touchNext = this.index + 1;
            var _touchPrev = this.index - 1;
            if (this.settings.loop && this.galleryItems.length > 2) {
                if (this.index === 0) {
                    _touchPrev = this.galleryItems.length - 1;
                }
                else if (this.index === this.galleryItems.length - 1) {
                    _touchNext = 0;
                }
            }
            this.outer.find('.lg-item').removeClass('lg-next-slide lg-prev-slide');
            if (_touchPrev > -1) {
                this.getSlideItem(_touchPrev).addClass('lg-prev-slide');
            }
            this.getSlideItem(_touchNext).addClass('lg-next-slide');
        };
        /**
         * Go to next slide
         * @param {Boolean} fromTouch - true if slide function called via touch event
         * @category lGPublicMethods
         * @example
         *  const plugin = lightGallery();
         *  plugin.goToNextSlide();
         * @see <a href="/demos/methods/">Demo</a>
         */
        LightGallery.prototype.goToNextSlide = function (fromTouch) {
            var _this = this;
            var _loop = this.settings.loop;
            if (fromTouch && this.galleryItems.length < 3) {
                _loop = false;
            }
            if (!this.lgBusy) {
                if (this.index + 1 < this.galleryItems.length) {
                    this.index++;
                    this.LGel.trigger(lGEvents.beforeNextSlide, {
                        index: this.index,
                    });
                    this.slide(this.index, !!fromTouch, false, 'next');
                }
                else {
                    if (_loop) {
                        this.index = 0;
                        this.LGel.trigger(lGEvents.beforeNextSlide, {
                            index: this.index,
                        });
                        this.slide(this.index, !!fromTouch, false, 'next');
                    }
                    else if (this.settings.slideEndAnimation && !fromTouch) {
                        this.outer.addClass('lg-right-end');
                        setTimeout(function () {
                            _this.outer.removeClass('lg-right-end');
                        }, 400);
                    }
                }
            }
        };
        /**
         * Go to previous slides
         * @param {Boolean} fromTouch - true if slide function called via touch event
         * @category lGPublicMethods
         * @example
         *  const plugin = lightGallery({});
         *  plugin.goToPrevSlide();
         * @see <a href="/demos/methods/">Demo</a>
         *
         */
        LightGallery.prototype.goToPrevSlide = function (fromTouch) {
            var _this = this;
            var _loop = this.settings.loop;
            if (fromTouch && this.galleryItems.length < 3) {
                _loop = false;
            }
            if (!this.lgBusy) {
                if (this.index > 0) {
                    this.index--;
                    this.LGel.trigger(lGEvents.beforePrevSlide, {
                        index: this.index,
                        fromTouch: fromTouch,
                    });
                    this.slide(this.index, !!fromTouch, false, 'prev');
                }
                else {
                    if (_loop) {
                        this.index = this.galleryItems.length - 1;
                        this.LGel.trigger(lGEvents.beforePrevSlide, {
                            index: this.index,
                            fromTouch: fromTouch,
                        });
                        this.slide(this.index, !!fromTouch, false, 'prev');
                    }
                    else if (this.settings.slideEndAnimation && !fromTouch) {
                        this.outer.addClass('lg-left-end');
                        setTimeout(function () {
                            _this.outer.removeClass('lg-left-end');
                        }, 400);
                    }
                }
            }
        };
        LightGallery.prototype.keyPress = function () {
            var _this = this;
            $LG(window).on("keydown.lg.global" + this.lgId, function (e) {
                if (_this.lgOpened &&
                    _this.settings.escKey === true &&
                    e.keyCode === 27) {
                    e.preventDefault();
                    if (_this.settings.allowMediaOverlap &&
                        _this.outer.hasClass('lg-can-toggle') &&
                        _this.outer.hasClass('lg-components-open')) {
                        _this.outer.removeClass('lg-components-open');
                    }
                    else {
                        _this.closeGallery();
                    }
                }
                if (_this.lgOpened && _this.galleryItems.length > 1) {
                    if (e.keyCode === 37) {
                        e.preventDefault();
                        _this.goToPrevSlide();
                    }
                    if (e.keyCode === 39) {
                        e.preventDefault();
                        _this.goToNextSlide();
                    }
                }
            });
        };
        LightGallery.prototype.arrow = function () {
            var _this = this;
            this.getElementById('lg-prev').on('click.lg', function () {
                _this.goToPrevSlide();
            });
            this.getElementById('lg-next').on('click.lg', function () {
                _this.goToNextSlide();
            });
        };
        LightGallery.prototype.arrowDisable = function (index) {
            // Disable arrows if settings.hideControlOnEnd is true
            if (!this.settings.loop && this.settings.hideControlOnEnd) {
                var $prev = this.getElementById('lg-prev');
                var $next = this.getElementById('lg-next');
                if (index + 1 === this.galleryItems.length) {
                    $next.attr('disabled', 'disabled').addClass('disabled');
                }
                else {
                    $next.removeAttr('disabled').removeClass('disabled');
                }
                if (index === 0) {
                    $prev.attr('disabled', 'disabled').addClass('disabled');
                }
                else {
                    $prev.removeAttr('disabled').removeClass('disabled');
                }
            }
        };
        LightGallery.prototype.setTranslate = function ($el, xValue, yValue, scaleX, scaleY) {
            if (scaleX === void 0) { scaleX = 1; }
            if (scaleY === void 0) { scaleY = 1; }
            $el.css('transform', 'translate3d(' +
                xValue +
                'px, ' +
                yValue +
                'px, 0px) scale3d(' +
                scaleX +
                ', ' +
                scaleY +
                ', 1)');
        };
        LightGallery.prototype.mousewheel = function () {
            var _this = this;
            /*var lastCall = 0;*/
            this.outer.on('wheel.lg', function (e) {
                if (!e.deltaY || _this.galleryItems.length < 2) {
                    return;
                }
                e.preventDefault();
                /*var now = new Date().getTime();
                if (now - lastCall < 1000) {
                    return;
                }
                lastCall = now;*/
                if (e.deltaY > 0) {
                    _this.goToNextSlide();
                }
                else if (e.deltaY < 0) {
                    _this.goToPrevSlide();
                }
            });
        };
        LightGallery.prototype.isSlideElement = function (target) {
            return (target.hasClass('lg-outer') ||
                target.hasClass('lg-item') ||
                target.hasClass('lg-img-wrap') ||
                target.hasClass('lg-img-rotate'));
        };
        LightGallery.prototype.isPosterElement = function (target) {
            var playButton = this.getSlideItem(this.index)
                .find('.lg-video-play-button')
                .get();
            return (target.hasClass('lg-video-poster') ||
                target.hasClass('lg-video-play-button') ||
                (playButton && playButton.contains(target.get())));
        };
        /**
         * Maximize minimize inline gallery.
         * @category lGPublicMethods
         */
        LightGallery.prototype.toggleMaximize = function () {
            var _this = this;
            this.getElementById('lg-maximize').on('click.lg', function () {
                _this.$container.toggleClass('lg-inline');
                _this.refreshOnResize();
            });
        };
        LightGallery.prototype.invalidateItems = function () {
            for (var index = 0; index < this.items.length; index++) {
                var element = this.items[index];
                var $element = $LG(element);
                $element.off("click.lgcustom-item-" + $element.attr('data-lg-id'));
            }
        };
        LightGallery.prototype.trapFocus = function () {
            var _this = this;
            this.$container.get().focus({
                preventScroll: true,
            });
            $LG(window).on("keydown.lg.global" + this.lgId, function (e) {
                if (!_this.lgOpened) {
                    return;
                }
                var isTabPressed = e.key === 'Tab' || e.keyCode === 9;
                if (!isTabPressed) {
                    return;
                }
                var focusableEls = utils.getFocusableElements(_this.$container.get());
                var firstFocusableEl = focusableEls[0];
                var lastFocusableEl = focusableEls[focusableEls.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                        e.preventDefault();
                    }
                }
                else {
                    if (document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus();
                        e.preventDefault();
                    }
                }
            });
        };
        LightGallery.prototype.manageCloseGallery = function () {
            var _this = this;
            if (!this.settings.closable)
                return;
            var mousedown = false;
            this.getElementById('lg-close').on('click.lg', function () {
                _this.closeGallery();
            });
            if (this.settings.closeOnTap) {
                // If you drag the slide and release outside gallery gets close on chrome
                // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
                this.outer.on('mousedown.lg', function (e) {
                    var target = $LG(e.target);
                    if (_this.isSlideElement(target)) {
                        mousedown = true;
                    }
                    else {
                        mousedown = false;
                    }
                });
                this.outer.on('mousemove.lg', function () {
                    mousedown = false;
                });
                this.outer.on('mouseup.lg', function (e) {
                    var target = $LG(e.target);
                    if (_this.isSlideElement(target) && mousedown) {
                        if (!_this.outer.hasClass('lg-dragging')) {
                            _this.closeGallery();
                        }
                    }
                });
            }
        };
        /**
         * Close lightGallery if it is opened.
         *
         * @description If closable is false in the settings, you need to pass true via closeGallery method to force close gallery
         * @return returns the estimated time to close gallery completely including the close animation duration
         * @category lGPublicMethods
         * @example
         *  const plugin = lightGallery();
         *  plugin.closeGallery();
         *
         */
        LightGallery.prototype.closeGallery = function (force) {
            var _this = this;
            if (!this.lgOpened || (!this.settings.closable && !force)) {
                return 0;
            }
            this.LGel.trigger(lGEvents.beforeClose);
            if (this.settings.resetScrollPosition && !this.settings.hideScrollbar) {
                $LG(window).scrollTop(this.prevScrollTop);
            }
            var currentItem = this.items[this.index];
            var transform;
            if (this.zoomFromOrigin && currentItem) {
                var _a = this.mediaContainerPosition, top_4 = _a.top, bottom = _a.bottom;
                var _b = this.galleryItems[this.index], __slideVideoInfo = _b.__slideVideoInfo, poster = _b.poster;
                var imageSize = utils.getSize(currentItem, this.outer, top_4 + bottom, __slideVideoInfo && poster && this.settings.videoMaxSize);
                transform = utils.getTransform(currentItem, this.outer, top_4, bottom, imageSize);
            }
            if (this.zoomFromOrigin && transform) {
                this.outer.addClass('lg-closing lg-zoom-from-image');
                this.getSlideItem(this.index)
                    .addClass('lg-start-end-progress')
                    .css('transition-duration', this.settings.startAnimationDuration + 'ms')
                    .css('transform', transform);
            }
            else {
                this.outer.addClass('lg-hide-items');
                // lg-zoom-from-image is used for setting the opacity to 1 if zoomFromOrigin is true
                // If the closing item doesn't have the lg-size attribute, remove this class to avoid the closing css conflicts
                this.outer.removeClass('lg-zoom-from-image');
            }
            // Unbind all events added by lightGallery
            // @todo
            //this.$el.off('.lg.tm');
            this.destroyModules();
            this.lGalleryOn = false;
            this.isDummyImageRemoved = false;
            this.zoomFromOrigin = this.settings.zoomFromOrigin;
            clearTimeout(this.hideBarTimeout);
            this.hideBarTimeout = false;
            $LG('html').removeClass('lg-on');
            this.outer.removeClass('lg-visible lg-components-open');
            // Resetting opacity to 0 isd required as  vertical swipe to close function adds inline opacity.
            this.$backdrop.removeClass('in').css('opacity', 0);
            var removeTimeout = this.zoomFromOrigin && transform
                ? Math.max(this.settings.startAnimationDuration, this.settings.backdropDuration)
                : this.settings.backdropDuration;
            this.$container.removeClass('lg-show-in');
            // Once the closign animation is completed and gallery is invisible
            setTimeout(function () {
                if (_this.zoomFromOrigin && transform) {
                    _this.outer.removeClass('lg-zoom-from-image');
                }
                _this.$container.removeClass('lg-show');
                // Reset scrollbar
                _this.resetScrollBar();
                // Need to remove inline opacity as it is used in the stylesheet as well
                _this.$backdrop
                    .removeAttr('style')
                    .css('transition-duration', _this.settings.backdropDuration + 'ms');
                _this.outer.removeClass("lg-closing " + _this.settings.startClass);
                _this.getSlideItem(_this.index).removeClass('lg-start-end-progress');
                _this.$inner.empty();
                if (_this.lgOpened) {
                    _this.LGel.trigger(lGEvents.afterClose, {
                        instance: _this,
                    });
                }
                if (_this.$container.get()) {
                    _this.$container.get().blur();
                }
                _this.lgOpened = false;
            }, removeTimeout + 100);
            return removeTimeout + 100;
        };
        LightGallery.prototype.initModules = function () {
            this.plugins.forEach(function (module) {
                try {
                    module.init();
                }
                catch (err) {
                    console.warn("lightGallery:- make sure lightGallery module is properly initiated");
                }
            });
        };
        LightGallery.prototype.destroyModules = function (destroy) {
            this.plugins.forEach(function (module) {
                try {
                    if (destroy) {
                        module.destroy();
                    }
                    else {
                        module.closeGallery && module.closeGallery();
                    }
                }
                catch (err) {
                    console.warn("lightGallery:- make sure lightGallery module is properly destroyed");
                }
            });
        };
        /**
         * Refresh lightGallery with new set of children.
         *
         * @description This is useful to update the gallery when the child elements are changed without calling destroy method.
         *
         * If you are using dynamic mode, you can pass the modified array of dynamicEl as the first parameter to refresh the dynamic gallery
         * @see <a href="/demos/dynamic-mode/">Demo</a>
         * @category lGPublicMethods
         * @example
         *  const plugin = lightGallery();
         *  // Delete or add children, then call
         *  plugin.refresh();
         *
         */
        LightGallery.prototype.refresh = function (galleryItems) {
            if (!this.settings.dynamic) {
                this.invalidateItems();
            }
            if (galleryItems) {
                this.galleryItems = galleryItems;
            }
            else {
                this.galleryItems = this.getItems();
            }
            this.updateControls();
            this.openGalleryOnItemClick();
            this.LGel.trigger(lGEvents.updateSlides);
        };
        LightGallery.prototype.updateControls = function () {
            this.addSlideVideoInfo(this.galleryItems);
            this.updateCounterTotal();
            this.manageSingleSlideClassName();
        };
        LightGallery.prototype.destroyGallery = function () {
            this.destroyModules(true);
            if (!this.settings.dynamic) {
                this.invalidateItems();
            }
            $LG(window).off(".lg.global" + this.lgId);
            this.LGel.off('.lg');
            this.$container.remove();
        };
        /**
         * Destroy lightGallery.
         * Destroy lightGallery and its plugin instances completely
         *
         * @description This method also calls CloseGallery function internally. Returns the time takes to completely close and destroy the instance.
         * In case if you want to re-initialize lightGallery right after destroying it, initialize it only once the destroy process is completed.
         * You can use refresh method most of the times.
         * @category lGPublicMethods
         * @example
         *  const plugin = lightGallery();
         *  plugin.destroy();
         *
         */
        LightGallery.prototype.destroy = function () {
            var closeTimeout = this.closeGallery(true);
            if (closeTimeout) {
                setTimeout(this.destroyGallery.bind(this), closeTimeout);
            }
            else {
                this.destroyGallery();
            }
            return closeTimeout;
        };
        return LightGallery;
    }());

    function lightGallery(el, options) {
        return new LightGallery(el, options);
    }

    return lightGallery;

})));
//# sourceMappingURL=lightgallery.umd.js.map

/*!
 * lightgallery | 2.8.3 | March 1st 2025
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lgZoom = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var zoomSettings = {
        scale: 1,
        zoom: true,
        infiniteZoom: true,
        actualSize: true,
        showZoomInOutIcons: false,
        actualSizeIcons: {
            zoomIn: 'lg-zoom-in',
            zoomOut: 'lg-zoom-out',
        },
        enableZoomAfter: 300,
        zoomPluginStrings: {
            zoomIn: 'Zoom in',
            zoomOut: 'Zoom out',
            viewActualSize: 'View actual size',
        },
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
        rotateLeft: 'lgRotateLeft',
        rotateRight: 'lgRotateRight',
        flipHorizontal: 'lgFlipHorizontal',
        flipVertical: 'lgFlipVertical',
        autoplay: 'lgAutoplay',
        autoplayStart: 'lgAutoplayStart',
        autoplayStop: 'lgAutoplayStop',
    };

    var ZOOM_TRANSITION_DURATION = 500;
    var Zoom = /** @class */ (function () {
        function Zoom(instance, $LG) {
            // get lightGallery core plugin instance
            this.core = instance;
            this.$LG = $LG;
            this.settings = __assign(__assign({}, zoomSettings), this.core.settings);
            return this;
        }
        // Append Zoom controls. Actual size, Zoom-in, Zoom-out
        Zoom.prototype.buildTemplates = function () {
            var zoomIcons = this.settings.showZoomInOutIcons
                ? "<button id=\"" + this.core.getIdName('lg-zoom-in') + "\" type=\"button\" aria-label=\"" + this.settings.zoomPluginStrings['zoomIn'] + "\" class=\"lg-zoom-in lg-icon\"></button><button id=\"" + this.core.getIdName('lg-zoom-out') + "\" type=\"button\" aria-label=\"" + this.settings.zoomPluginStrings['zoomOut'] + "\" class=\"lg-zoom-out lg-icon\"></button>"
                : '';
            if (this.settings.actualSize) {
                zoomIcons += "<button id=\"" + this.core.getIdName('lg-actual-size') + "\" type=\"button\" aria-label=\"" + this.settings.zoomPluginStrings['viewActualSize'] + "\" class=\"" + this.settings.actualSizeIcons.zoomIn + " lg-icon\"></button>";
            }
            this.core.outer.addClass('lg-use-transition-for-zoom');
            this.core.$toolbar.first().append(zoomIcons);
        };
        /**
         * @desc Enable zoom option only once the image is completely loaded
         * If zoomFromOrigin is true, Zoom is enabled once the dummy image has been inserted
         *
         * Zoom styles are defined under lg-zoomable CSS class.
         */
        Zoom.prototype.enableZoom = function (event) {
            var _this = this;
            // delay will be 0 except first time
            var _speed = this.settings.enableZoomAfter + event.detail.delay;
            // set _speed value 0 if gallery opened from direct url and if it is first slide
            if (this.$LG('body').first().hasClass('lg-from-hash') &&
                event.detail.delay) {
                // will execute only once
                _speed = 0;
            }
            else {
                // Remove lg-from-hash to enable starting animation.
                this.$LG('body').first().removeClass('lg-from-hash');
            }
            this.zoomableTimeout = setTimeout(function () {
                if (!_this.isImageSlide(_this.core.index)) {
                    return;
                }
                _this.core.getSlideItem(event.detail.index).addClass('lg-zoomable');
                if (event.detail.index === _this.core.index) {
                    _this.setZoomEssentials();
                }
            }, _speed + 30);
        };
        Zoom.prototype.enableZoomOnSlideItemLoad = function () {
            // Add zoomable class
            this.core.LGel.on(lGEvents.slideItemLoad + ".zoom", this.enableZoom.bind(this));
        };
        Zoom.prototype.getDragCords = function (e) {
            return {
                x: e.pageX,
                y: e.pageY,
            };
        };
        Zoom.prototype.getSwipeCords = function (e) {
            var x = e.touches[0].pageX;
            var y = e.touches[0].pageY;
            return {
                x: x,
                y: y,
            };
        };
        Zoom.prototype.getDragAllowedAxises = function (scale, scaleDiff) {
            if (!this.containerRect) {
                return {
                    allowX: false,
                    allowY: false,
                };
            }
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-image')
                .first()
                .get();
            var height = 0;
            var width = 0;
            var rect = $image.getBoundingClientRect();
            if (scale) {
                height = $image.offsetHeight * scale;
                width = $image.offsetWidth * scale;
            }
            else if (scaleDiff) {
                height = rect.height + scaleDiff * rect.height;
                width = rect.width + scaleDiff * rect.width;
            }
            else {
                height = rect.height;
                width = rect.width;
            }
            var allowY = height > this.containerRect.height;
            var allowX = width > this.containerRect.width;
            return {
                allowX: allowX,
                allowY: allowY,
            };
        };
        Zoom.prototype.setZoomEssentials = function () {
            this.containerRect = this.core.$content.get().getBoundingClientRect();
        };
        /**
         * @desc Image zoom
         * Translate the wrap and scale the image to get better user experience
         *
         * @param {String} scale - Zoom decrement/increment value
         */
        Zoom.prototype.zoomImage = function (scale, scaleDiff, reposition, resetToMax) {
            if (Math.abs(scaleDiff) <= 0)
                return;
            var offsetX = this.containerRect.width / 2 + this.containerRect.left;
            var offsetY = this.containerRect.height / 2 +
                this.containerRect.top +
                this.scrollTop;
            var originalX;
            var originalY;
            if (scale === 1) {
                this.positionChanged = false;
            }
            var dragAllowedAxises = this.getDragAllowedAxises(0, scaleDiff);
            var allowY = dragAllowedAxises.allowY, allowX = dragAllowedAxises.allowX;
            if (this.positionChanged) {
                originalX = this.left / (this.scale - scaleDiff);
                originalY = this.top / (this.scale - scaleDiff);
                this.pageX = offsetX - originalX;
                this.pageY = offsetY - originalY;
                this.positionChanged = false;
            }
            var possibleSwipeCords = this.getPossibleSwipeDragCords(scaleDiff);
            var x;
            var y;
            var _x = offsetX - this.pageX;
            var _y = offsetY - this.pageY;
            if (scale - scaleDiff > 1) {
                var scaleVal = (scale - scaleDiff) / Math.abs(scaleDiff);
                _x =
                    (scaleDiff < 0 ? -_x : _x) +
                        this.left * (scaleVal + (scaleDiff < 0 ? -1 : 1));
                _y =
                    (scaleDiff < 0 ? -_y : _y) +
                        this.top * (scaleVal + (scaleDiff < 0 ? -1 : 1));
                x = _x / scaleVal;
                y = _y / scaleVal;
            }
            else {
                var scaleVal = (scale - scaleDiff) * scaleDiff;
                x = _x * scaleVal;
                y = _y * scaleVal;
            }
            if (reposition) {
                if (allowX) {
                    if (this.isBeyondPossibleLeft(x, possibleSwipeCords.minX)) {
                        x = possibleSwipeCords.minX;
                    }
                    else if (this.isBeyondPossibleRight(x, possibleSwipeCords.maxX)) {
                        x = possibleSwipeCords.maxX;
                    }
                }
                else {
                    if (scale > 1) {
                        if (x < possibleSwipeCords.minX) {
                            x = possibleSwipeCords.minX;
                        }
                        else if (x > possibleSwipeCords.maxX) {
                            x = possibleSwipeCords.maxX;
                        }
                    }
                }
                // @todo fix this
                if (allowY) {
                    if (this.isBeyondPossibleTop(y, possibleSwipeCords.minY)) {
                        y = possibleSwipeCords.minY;
                    }
                    else if (this.isBeyondPossibleBottom(y, possibleSwipeCords.maxY)) {
                        y = possibleSwipeCords.maxY;
                    }
                }
                else {
                    // If the translate value based on index of beyond the viewport, utilize the available space to prevent image being cut out
                    if (scale > 1) {
                        //If image goes beyond viewport top, use the minim possible translate value
                        if (y < possibleSwipeCords.minY) {
                            y = possibleSwipeCords.minY;
                        }
                        else if (y > possibleSwipeCords.maxY) {
                            y = possibleSwipeCords.maxY;
                        }
                    }
                }
            }
            this.setZoomStyles({
                x: x,
                y: y,
                scale: scale,
            });
            this.left = x;
            this.top = y;
            if (resetToMax) {
                this.setZoomImageSize();
            }
        };
        Zoom.prototype.resetImageTranslate = function (index) {
            if (!this.isImageSlide(index)) {
                return;
            }
            var $image = this.core.getSlideItem(index).find('.lg-image').first();
            this.imageReset = false;
            $image.removeClass('reset-transition reset-transition-y reset-transition-x');
            this.core.outer.removeClass('lg-actual-size');
            $image.css('width', 'auto').css('height', 'auto');
            setTimeout(function () {
                $image.removeClass('no-transition');
            }, 10);
        };
        Zoom.prototype.setZoomImageSize = function () {
            var _this = this;
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-image')
                .first();
            setTimeout(function () {
                var actualSizeScale = _this.getCurrentImageActualSizeScale();
                if (_this.scale >= actualSizeScale) {
                    $image.addClass('no-transition');
                    _this.imageReset = true;
                }
            }, ZOOM_TRANSITION_DURATION);
            setTimeout(function () {
                var actualSizeScale = _this.getCurrentImageActualSizeScale();
                if (_this.scale >= actualSizeScale) {
                    var dragAllowedAxises = _this.getDragAllowedAxises(_this.scale);
                    $image
                        .css('width', $image.get().naturalWidth + 'px')
                        .css('height', $image.get().naturalHeight + 'px');
                    _this.core.outer.addClass('lg-actual-size');
                    if (dragAllowedAxises.allowX && dragAllowedAxises.allowY) {
                        $image.addClass('reset-transition');
                    }
                    else if (dragAllowedAxises.allowX &&
                        !dragAllowedAxises.allowY) {
                        $image.addClass('reset-transition-x');
                    }
                    else if (!dragAllowedAxises.allowX &&
                        dragAllowedAxises.allowY) {
                        $image.addClass('reset-transition-y');
                    }
                }
            }, ZOOM_TRANSITION_DURATION + 50);
        };
        /**
         * @desc apply scale3d to image and translate to image wrap
         * @param {style} X,Y and scale
         */
        Zoom.prototype.setZoomStyles = function (style) {
            var $imageWrap = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-wrap')
                .first();
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-image')
                .first();
            var $dummyImage = this.core.outer
                .find('.lg-current .lg-dummy-img')
                .first();
            this.scale = style.scale;
            $image.css('transform', 'scale3d(' + style.scale + ', ' + style.scale + ', 1)');
            $dummyImage.css('transform', 'scale3d(' + style.scale + ', ' + style.scale + ', 1)');
            var transform = 'translate3d(' + style.x + 'px, ' + style.y + 'px, 0)';
            $imageWrap.css('transform', transform);
        };
        /**
         * @param index - Index of the current slide
         * @param event - event will be available only if the function is called on clicking/taping the imags
         */
        Zoom.prototype.setActualSize = function (index, event) {
            var _this = this;
            if (this.zoomInProgress) {
                return;
            }
            this.zoomInProgress = true;
            var currentItem = this.core.galleryItems[this.core.index];
            this.resetImageTranslate(index);
            setTimeout(function () {
                // Allow zoom only on image
                if (!currentItem.src ||
                    _this.core.outer.hasClass('lg-first-slide-loading')) {
                    return;
                }
                var scale = _this.getCurrentImageActualSizeScale();
                var prevScale = _this.scale;
                if (_this.core.outer.hasClass('lg-zoomed')) {
                    _this.scale = 1;
                }
                else {
                    _this.scale = _this.getScale(scale);
                }
                _this.setPageCords(event);
                _this.beginZoom(_this.scale);
                _this.zoomImage(_this.scale, _this.scale - prevScale, true, true);
            }, 50);
            setTimeout(function () {
                _this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
            }, 60);
            setTimeout(function () {
                _this.zoomInProgress = false;
            }, ZOOM_TRANSITION_DURATION + 110);
        };
        Zoom.prototype.getNaturalWidth = function (index) {
            var $image = this.core.getSlideItem(index).find('.lg-image').first();
            var naturalWidth = this.core.galleryItems[index].width;
            return naturalWidth
                ? parseFloat(naturalWidth)
                : $image.get().naturalWidth;
        };
        Zoom.prototype.getActualSizeScale = function (naturalWidth, width) {
            var _scale;
            var scale;
            if (naturalWidth >= width) {
                _scale = naturalWidth / width;
                scale = _scale || 2;
            }
            else {
                scale = 1;
            }
            return scale;
        };
        Zoom.prototype.getCurrentImageActualSizeScale = function () {
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-image')
                .first();
            var width = $image.get().offsetWidth;
            var naturalWidth = this.getNaturalWidth(this.core.index) || width;
            return this.getActualSizeScale(naturalWidth, width);
        };
        Zoom.prototype.getPageCords = function (event) {
            var cords = {};
            if (event) {
                cords.x = event.pageX || event.touches[0].pageX;
                cords.y = event.pageY || event.touches[0].pageY;
            }
            else {
                var containerRect = this.core.$content
                    .get()
                    .getBoundingClientRect();
                cords.x = containerRect.width / 2 + containerRect.left;
                cords.y =
                    containerRect.height / 2 + this.scrollTop + containerRect.top;
            }
            return cords;
        };
        Zoom.prototype.setPageCords = function (event) {
            var pageCords = this.getPageCords(event);
            this.pageX = pageCords.x;
            this.pageY = pageCords.y;
        };
        Zoom.prototype.manageActualPixelClassNames = function () {
            var $actualSize = this.core.getElementById('lg-actual-size');
            $actualSize
                .removeClass(this.settings.actualSizeIcons.zoomIn)
                .addClass(this.settings.actualSizeIcons.zoomOut);
        };
        // If true, zoomed - in else zoomed out
        Zoom.prototype.beginZoom = function (scale) {
            this.core.outer.removeClass('lg-zoom-drag-transition lg-zoom-dragging');
            if (scale > 1) {
                this.core.outer.addClass('lg-zoomed');
                this.manageActualPixelClassNames();
            }
            else {
                this.resetZoom();
            }
            return scale > 1;
        };
        Zoom.prototype.getScale = function (scale) {
            var actualSizeScale = this.getCurrentImageActualSizeScale();
            if (scale < 1) {
                scale = 1;
            }
            else if (scale > actualSizeScale) {
                scale = actualSizeScale;
            }
            return scale;
        };
        Zoom.prototype.init = function () {
            var _this = this;
            if (!this.settings.zoom) {
                return;
            }
            this.buildTemplates();
            this.enableZoomOnSlideItemLoad();
            var tapped = null;
            this.core.outer.on('dblclick.lg', function (event) {
                if (!_this.$LG(event.target).hasClass('lg-image')) {
                    return;
                }
                _this.setActualSize(_this.core.index, event);
            });
            this.core.outer.on('touchstart.lg', function (event) {
                var $target = _this.$LG(event.target);
                if (event.touches.length === 1 && $target.hasClass('lg-image')) {
                    if (!tapped) {
                        tapped = setTimeout(function () {
                            tapped = null;
                        }, 300);
                    }
                    else {
                        clearTimeout(tapped);
                        tapped = null;
                        event.preventDefault();
                        _this.setActualSize(_this.core.index, event);
                    }
                }
            });
            this.core.LGel.on(lGEvents.containerResize + ".zoom " + lGEvents.rotateRight + ".zoom " + lGEvents.rotateLeft + ".zoom " + lGEvents.flipHorizontal + ".zoom " + lGEvents.flipVertical + ".zoom", function () {
                if (!_this.core.lgOpened ||
                    !_this.isImageSlide(_this.core.index) ||
                    _this.core.touchAction) {
                    return;
                }
                var _LGel = _this.core
                    .getSlideItem(_this.core.index)
                    .find('.lg-img-wrap')
                    .first();
                _this.top = 0;
                _this.left = 0;
                _this.setZoomEssentials();
                _this.setZoomSwipeStyles(_LGel, { x: 0, y: 0 });
                _this.positionChanged = true;
            });
            // Update zoom on resize and orientationchange
            this.$LG(window).on("scroll.lg.zoom.global" + this.core.lgId, function () {
                if (!_this.core.lgOpened)
                    return;
                _this.scrollTop = _this.$LG(window).scrollTop();
            });
            this.core.getElementById('lg-zoom-out').on('click.lg', function () {
                // Allow zoom only on image
                if (!_this.isImageSlide(_this.core.index)) {
                    return;
                }
                var timeout = 0;
                if (_this.imageReset) {
                    _this.resetImageTranslate(_this.core.index);
                    timeout = 50;
                }
                setTimeout(function () {
                    var scale = _this.scale - _this.settings.scale;
                    if (scale < 1) {
                        scale = 1;
                    }
                    _this.beginZoom(scale);
                    _this.zoomImage(scale, -_this.settings.scale, true, !_this.settings.infiniteZoom);
                }, timeout);
            });
            this.core.getElementById('lg-zoom-in').on('click.lg', function () {
                _this.zoomIn();
            });
            this.core.getElementById('lg-actual-size').on('click.lg', function () {
                _this.setActualSize(_this.core.index);
            });
            this.core.LGel.on(lGEvents.beforeOpen + ".zoom", function () {
                _this.core.outer.find('.lg-item').removeClass('lg-zoomable');
            });
            this.core.LGel.on(lGEvents.afterOpen + ".zoom", function () {
                _this.scrollTop = _this.$LG(window).scrollTop();
                // Set the initial value center
                _this.pageX = _this.core.outer.width() / 2;
                _this.pageY = _this.core.outer.height() / 2 + _this.scrollTop;
                _this.scale = 1;
            });
            // Reset zoom on slide change
            this.core.LGel.on(lGEvents.afterSlide + ".zoom", function (event) {
                var prevIndex = event.detail.prevIndex;
                _this.scale = 1;
                _this.positionChanged = false;
                _this.zoomInProgress = false;
                _this.resetZoom(prevIndex);
                _this.resetImageTranslate(prevIndex);
                if (_this.isImageSlide(_this.core.index)) {
                    _this.setZoomEssentials();
                }
            });
            // Drag option after zoom
            this.zoomDrag();
            this.pinchZoom();
            this.zoomSwipe();
            // Store the zoomable timeout value just to clear it while closing
            this.zoomableTimeout = false;
            this.positionChanged = false;
            this.zoomInProgress = false;
        };
        Zoom.prototype.zoomIn = function () {
            // Allow zoom only on image
            if (!this.isImageSlide(this.core.index)) {
                return;
            }
            var scale = this.scale + this.settings.scale;
            if (!this.settings.infiniteZoom) {
                scale = this.getScale(scale);
            }
            this.beginZoom(scale);
            this.zoomImage(scale, Math.min(this.settings.scale, scale - this.scale), true, !this.settings.infiniteZoom);
        };
        // Reset zoom effect
        Zoom.prototype.resetZoom = function (index) {
            this.core.outer.removeClass('lg-zoomed lg-zoom-drag-transition');
            var $actualSize = this.core.getElementById('lg-actual-size');
            var $item = this.core.getSlideItem(index !== undefined ? index : this.core.index);
            $actualSize
                .removeClass(this.settings.actualSizeIcons.zoomOut)
                .addClass(this.settings.actualSizeIcons.zoomIn);
            $item.find('.lg-img-wrap').first().removeAttr('style');
            $item.find('.lg-image').first().removeAttr('style');
            this.scale = 1;
            this.left = 0;
            this.top = 0;
            // Reset pagx pagy values to center
            this.setPageCords();
        };
        Zoom.prototype.getTouchDistance = function (e) {
            return Math.sqrt((e.touches[0].pageX - e.touches[1].pageX) *
                (e.touches[0].pageX - e.touches[1].pageX) +
                (e.touches[0].pageY - e.touches[1].pageY) *
                    (e.touches[0].pageY - e.touches[1].pageY));
        };
        Zoom.prototype.pinchZoom = function () {
            var _this = this;
            var startDist = 0;
            var pinchStarted = false;
            var initScale = 1;
            var prevScale = 0;
            var $item = this.core.getSlideItem(this.core.index);
            this.core.outer.on('touchstart.lg', function (e) {
                $item = _this.core.getSlideItem(_this.core.index);
                if (!_this.isImageSlide(_this.core.index)) {
                    return;
                }
                if (e.touches.length === 2) {
                    e.preventDefault();
                    if (_this.core.outer.hasClass('lg-first-slide-loading')) {
                        return;
                    }
                    initScale = _this.scale || 1;
                    _this.core.outer.removeClass('lg-zoom-drag-transition lg-zoom-dragging');
                    _this.setPageCords(e);
                    _this.resetImageTranslate(_this.core.index);
                    _this.core.touchAction = 'pinch';
                    startDist = _this.getTouchDistance(e);
                }
            });
            this.core.$inner.on('touchmove.lg', function (e) {
                if (e.touches.length === 2 &&
                    _this.core.touchAction === 'pinch' &&
                    (_this.$LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target))) {
                    e.preventDefault();
                    var endDist = _this.getTouchDistance(e);
                    var distance = startDist - endDist;
                    if (!pinchStarted && Math.abs(distance) > 5) {
                        pinchStarted = true;
                    }
                    if (pinchStarted) {
                        prevScale = _this.scale;
                        var _scale = Math.max(1, initScale + -distance * 0.02);
                        _this.scale =
                            Math.round((_scale + Number.EPSILON) * 100) / 100;
                        var diff = _this.scale - prevScale;
                        _this.zoomImage(_this.scale, Math.round((diff + Number.EPSILON) * 100) / 100, false, false);
                    }
                }
            });
            this.core.$inner.on('touchend.lg', function (e) {
                if (_this.core.touchAction === 'pinch' &&
                    (_this.$LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target))) {
                    pinchStarted = false;
                    startDist = 0;
                    if (_this.scale <= 1) {
                        _this.resetZoom();
                    }
                    else {
                        var actualSizeScale = _this.getCurrentImageActualSizeScale();
                        if (_this.scale >= actualSizeScale) {
                            var scaleDiff = actualSizeScale - _this.scale;
                            if (scaleDiff === 0) {
                                scaleDiff = 0.01;
                            }
                            _this.zoomImage(actualSizeScale, scaleDiff, false, true);
                        }
                        _this.manageActualPixelClassNames();
                        _this.core.outer.addClass('lg-zoomed');
                    }
                    _this.core.touchAction = undefined;
                }
            });
        };
        Zoom.prototype.touchendZoom = function (startCoords, endCoords, allowX, allowY, touchDuration) {
            var distanceXnew = endCoords.x - startCoords.x;
            var distanceYnew = endCoords.y - startCoords.y;
            var speedX = Math.abs(distanceXnew) / touchDuration + 1;
            var speedY = Math.abs(distanceYnew) / touchDuration + 1;
            if (speedX > 2) {
                speedX += 1;
            }
            if (speedY > 2) {
                speedY += 1;
            }
            distanceXnew = distanceXnew * speedX;
            distanceYnew = distanceYnew * speedY;
            var _LGel = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-wrap')
                .first();
            var distance = {};
            distance.x = this.left + distanceXnew;
            distance.y = this.top + distanceYnew;
            var possibleSwipeCords = this.getPossibleSwipeDragCords();
            if (Math.abs(distanceXnew) > 15 || Math.abs(distanceYnew) > 15) {
                if (allowY) {
                    if (this.isBeyondPossibleTop(distance.y, possibleSwipeCords.minY)) {
                        distance.y = possibleSwipeCords.minY;
                    }
                    else if (this.isBeyondPossibleBottom(distance.y, possibleSwipeCords.maxY)) {
                        distance.y = possibleSwipeCords.maxY;
                    }
                }
                if (allowX) {
                    if (this.isBeyondPossibleLeft(distance.x, possibleSwipeCords.minX)) {
                        distance.x = possibleSwipeCords.minX;
                    }
                    else if (this.isBeyondPossibleRight(distance.x, possibleSwipeCords.maxX)) {
                        distance.x = possibleSwipeCords.maxX;
                    }
                }
                if (allowY) {
                    this.top = distance.y;
                }
                else {
                    distance.y = this.top;
                }
                if (allowX) {
                    this.left = distance.x;
                }
                else {
                    distance.x = this.left;
                }
                this.setZoomSwipeStyles(_LGel, distance);
                this.positionChanged = true;
            }
        };
        Zoom.prototype.getZoomSwipeCords = function (startCoords, endCoords, allowX, allowY, possibleSwipeCords) {
            var distance = {};
            if (allowY) {
                distance.y = this.top + (endCoords.y - startCoords.y);
                if (this.isBeyondPossibleTop(distance.y, possibleSwipeCords.minY)) {
                    var diffMinY = possibleSwipeCords.minY - distance.y;
                    distance.y = possibleSwipeCords.minY - diffMinY / 6;
                }
                else if (this.isBeyondPossibleBottom(distance.y, possibleSwipeCords.maxY)) {
                    var diffMaxY = distance.y - possibleSwipeCords.maxY;
                    distance.y = possibleSwipeCords.maxY + diffMaxY / 6;
                }
            }
            else {
                distance.y = this.top;
            }
            if (allowX) {
                distance.x = this.left + (endCoords.x - startCoords.x);
                if (this.isBeyondPossibleLeft(distance.x, possibleSwipeCords.minX)) {
                    var diffMinX = possibleSwipeCords.minX - distance.x;
                    distance.x = possibleSwipeCords.minX - diffMinX / 6;
                }
                else if (this.isBeyondPossibleRight(distance.x, possibleSwipeCords.maxX)) {
                    var difMaxX = distance.x - possibleSwipeCords.maxX;
                    distance.x = possibleSwipeCords.maxX + difMaxX / 6;
                }
            }
            else {
                distance.x = this.left;
            }
            return distance;
        };
        Zoom.prototype.isBeyondPossibleLeft = function (x, minX) {
            return x >= minX;
        };
        Zoom.prototype.isBeyondPossibleRight = function (x, maxX) {
            return x <= maxX;
        };
        Zoom.prototype.isBeyondPossibleTop = function (y, minY) {
            return y >= minY;
        };
        Zoom.prototype.isBeyondPossibleBottom = function (y, maxY) {
            return y <= maxY;
        };
        Zoom.prototype.isImageSlide = function (index) {
            var currentItem = this.core.galleryItems[index];
            return this.core.getSlideType(currentItem) === 'image';
        };
        Zoom.prototype.getPossibleSwipeDragCords = function (scale) {
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-image')
                .first();
            var bottom = this.core.mediaContainerPosition.bottom;
            var imgRect = $image.get().getBoundingClientRect();
            var imageHeight = imgRect.height;
            var imageWidth = imgRect.width;
            if (scale) {
                imageHeight = imageHeight + scale * imageHeight;
                imageWidth = imageWidth + scale * imageWidth;
            }
            var minY = (imageHeight - this.containerRect.height) / 2;
            var maxY = (this.containerRect.height - imageHeight) / 2 + bottom;
            var minX = (imageWidth - this.containerRect.width) / 2;
            var maxX = (this.containerRect.width - imageWidth) / 2;
            var possibleSwipeCords = {
                minY: minY,
                maxY: maxY,
                minX: minX,
                maxX: maxX,
            };
            return possibleSwipeCords;
        };
        Zoom.prototype.setZoomSwipeStyles = function (LGel, distance) {
            LGel.css('transform', 'translate3d(' + distance.x + 'px, ' + distance.y + 'px, 0)');
        };
        Zoom.prototype.zoomSwipe = function () {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isMoved = false;
            // Allow x direction drag
            var allowX = false;
            // Allow Y direction drag
            var allowY = false;
            var startTime = new Date();
            var endTime = new Date();
            var possibleSwipeCords;
            var _LGel;
            var $item = this.core.getSlideItem(this.core.index);
            this.core.$inner.on('touchstart.lg', function (e) {
                // Allow zoom only on image
                if (!_this.isImageSlide(_this.core.index)) {
                    return;
                }
                $item = _this.core.getSlideItem(_this.core.index);
                if ((_this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target)) &&
                    e.touches.length === 1 &&
                    _this.core.outer.hasClass('lg-zoomed')) {
                    e.preventDefault();
                    startTime = new Date();
                    _this.core.touchAction = 'zoomSwipe';
                    _LGel = _this.core
                        .getSlideItem(_this.core.index)
                        .find('.lg-img-wrap')
                        .first();
                    var dragAllowedAxises = _this.getDragAllowedAxises(0);
                    allowY = dragAllowedAxises.allowY;
                    allowX = dragAllowedAxises.allowX;
                    if (allowX || allowY) {
                        startCoords = _this.getSwipeCords(e);
                    }
                    possibleSwipeCords = _this.getPossibleSwipeDragCords();
                    // reset opacity and transition duration
                    _this.core.outer.addClass('lg-zoom-dragging lg-zoom-drag-transition');
                }
            });
            this.core.$inner.on('touchmove.lg', function (e) {
                if (e.touches.length === 1 &&
                    _this.core.touchAction === 'zoomSwipe' &&
                    (_this.$LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target))) {
                    e.preventDefault();
                    _this.core.touchAction = 'zoomSwipe';
                    endCoords = _this.getSwipeCords(e);
                    var distance = _this.getZoomSwipeCords(startCoords, endCoords, allowX, allowY, possibleSwipeCords);
                    if (Math.abs(endCoords.x - startCoords.x) > 15 ||
                        Math.abs(endCoords.y - startCoords.y) > 15) {
                        isMoved = true;
                        _this.setZoomSwipeStyles(_LGel, distance);
                    }
                }
            });
            this.core.$inner.on('touchend.lg', function (e) {
                if (_this.core.touchAction === 'zoomSwipe' &&
                    (_this.$LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target))) {
                    e.preventDefault();
                    _this.core.touchAction = undefined;
                    _this.core.outer.removeClass('lg-zoom-dragging');
                    if (!isMoved) {
                        return;
                    }
                    isMoved = false;
                    endTime = new Date();
                    var touchDuration = endTime.valueOf() - startTime.valueOf();
                    _this.touchendZoom(startCoords, endCoords, allowX, allowY, touchDuration);
                }
            });
        };
        Zoom.prototype.zoomDrag = function () {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isDragging = false;
            var isMoved = false;
            // Allow x direction drag
            var allowX = false;
            // Allow Y direction drag
            var allowY = false;
            var startTime;
            var endTime;
            var possibleSwipeCords;
            var _LGel;
            this.core.outer.on('mousedown.lg.zoom', function (e) {
                // Allow zoom only on image
                if (!_this.isImageSlide(_this.core.index)) {
                    return;
                }
                var $item = _this.core.getSlideItem(_this.core.index);
                if (_this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target)) {
                    startTime = new Date();
                    _LGel = _this.core
                        .getSlideItem(_this.core.index)
                        .find('.lg-img-wrap')
                        .first();
                    var dragAllowedAxises = _this.getDragAllowedAxises(0);
                    allowY = dragAllowedAxises.allowY;
                    allowX = dragAllowedAxises.allowX;
                    if (_this.core.outer.hasClass('lg-zoomed')) {
                        if (_this.$LG(e.target).hasClass('lg-object') &&
                            (allowX || allowY)) {
                            e.preventDefault();
                            startCoords = _this.getDragCords(e);
                            possibleSwipeCords = _this.getPossibleSwipeDragCords();
                            isDragging = true;
                            _this.core.outer
                                .removeClass('lg-grab')
                                .addClass('lg-grabbing lg-zoom-drag-transition lg-zoom-dragging');
                            // reset opacity and transition duration
                        }
                    }
                }
            });
            this.$LG(window).on("mousemove.lg.zoom.global" + this.core.lgId, function (e) {
                if (isDragging) {
                    isMoved = true;
                    endCoords = _this.getDragCords(e);
                    var distance = _this.getZoomSwipeCords(startCoords, endCoords, allowX, allowY, possibleSwipeCords);
                    _this.setZoomSwipeStyles(_LGel, distance);
                }
            });
            this.$LG(window).on("mouseup.lg.zoom.global" + this.core.lgId, function (e) {
                if (isDragging) {
                    endTime = new Date();
                    isDragging = false;
                    _this.core.outer.removeClass('lg-zoom-dragging');
                    // Fix for chrome mouse move on click
                    if (isMoved &&
                        (startCoords.x !== endCoords.x ||
                            startCoords.y !== endCoords.y)) {
                        endCoords = _this.getDragCords(e);
                        var touchDuration = endTime.valueOf() - startTime.valueOf();
                        _this.touchendZoom(startCoords, endCoords, allowX, allowY, touchDuration);
                    }
                    isMoved = false;
                }
                _this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
            });
        };
        Zoom.prototype.closeGallery = function () {
            this.resetZoom();
            this.zoomInProgress = false;
        };
        Zoom.prototype.destroy = function () {
            // Unbind all events added by lightGallery zoom plugin
            this.$LG(window).off(".lg.zoom.global" + this.core.lgId);
            this.core.LGel.off('.lg.zoom');
            this.core.LGel.off('.zoom');
            clearTimeout(this.zoomableTimeout);
            this.zoomableTimeout = false;
        };
        return Zoom;
    }());

    return Zoom;

})));
//# sourceMappingURL=lg-zoom.umd.js.map

/*!
 * lightgallery | 2.8.3 | March 1st 2025
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lgVideo = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var videoSettings = {
        autoplayFirstVideo: true,
        youTubePlayerParams: false,
        vimeoPlayerParams: false,
        wistiaPlayerParams: false,
        gotoNextSlideOnVideoEnd: true,
        autoplayVideoOnSlide: false,
        videojs: false,
        videojsTheme: '',
        videojsOptions: {},
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
        rotateLeft: 'lgRotateLeft',
        rotateRight: 'lgRotateRight',
        flipHorizontal: 'lgFlipHorizontal',
        flipVertical: 'lgFlipVertical',
        autoplay: 'lgAutoplay',
        autoplayStart: 'lgAutoplayStart',
        autoplayStop: 'lgAutoplayStop',
    };

    var param = function (obj) {
        return Object.keys(obj)
            .map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        })
            .join('&');
    };
    var paramsToObject = function (url) {
        var paramas = url
            .slice(1)
            .split('&')
            .map(function (p) { return p.split('='); })
            .reduce(function (obj, pair) {
            var _a = pair.map(decodeURIComponent), key = _a[0], value = _a[1];
            obj[key] = value;
            return obj;
        }, {});
        return paramas;
    };
    var getYouTubeParams = function (videoInfo, youTubePlayerParamsSettings) {
        if (!videoInfo.youtube)
            return '';
        var slideUrlParams = videoInfo.youtube[2]
            ? paramsToObject(videoInfo.youtube[2])
            : '';
        // For youtube first params gets priority if duplicates found
        var defaultYouTubePlayerParams = {
            wmode: 'opaque',
            autoplay: 0,
            mute: 1,
            enablejsapi: 1,
        };
        var playerParamsSettings = youTubePlayerParamsSettings || {};
        var youTubePlayerParams = __assign(__assign(__assign({}, defaultYouTubePlayerParams), playerParamsSettings), slideUrlParams);
        var youTubeParams = "?" + param(youTubePlayerParams);
        return youTubeParams;
    };
    var isYouTubeNoCookie = function (url) {
        return url.includes('youtube-nocookie.com');
    };
    var getVimeoURLParams = function (defaultParams, videoInfo) {
        if (!videoInfo || !videoInfo.vimeo)
            return '';
        var urlParams = videoInfo.vimeo[2] || '';
        var defaultVimeoPlayerParams = Object.assign({}, {
            autoplay: 0,
            muted: 1,
        }, defaultParams);
        var defaultPlayerParams = defaultVimeoPlayerParams &&
            Object.keys(defaultVimeoPlayerParams).length !== 0
            ? param(defaultVimeoPlayerParams)
            : '';
        // Support private video
        var urlWithHash = videoInfo.vimeo[0].split('/').pop() || '';
        var urlWithHashWithParams = urlWithHash.split('?')[0] || '';
        var hash = urlWithHashWithParams.split('#')[0];
        var isPrivate = videoInfo.vimeo[1] !== hash;
        if (isPrivate) {
            urlParams = urlParams.replace("/" + hash, '');
        }
        urlParams =
            urlParams[0] == '?' ? '&' + urlParams.slice(1) : urlParams || '';
        var privateUrlParams = isPrivate ? "h=" + hash : '';
        defaultPlayerParams = privateUrlParams
            ? "&" + defaultPlayerParams
            : defaultPlayerParams;
        var vimeoPlayerParams = "?" + privateUrlParams + defaultPlayerParams + urlParams;
        return vimeoPlayerParams;
    };

    /**
     * Video module for lightGallery
     * Supports HTML5, YouTube, Vimeo, wistia videos
     *
     *
     * @ref Wistia
     * https://wistia.com/support/integrations/wordpress(How to get url)
     * https://wistia.com/support/developers/embed-options#using-embed-options
     * https://wistia.com/support/developers/player-api
     * https://wistia.com/support/developers/construct-an-embed-code
     * http://jsfiddle.net/xvnm7xLm/
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
     * https://wistia.com/support/embed-and-share/sharing-videos
     * https://private-sharing.wistia.com/medias/mwhrulrucj
     *
     * @ref Youtube
     * https://developers.google.com/youtube/player_parameters#enablejsapi
     * https://developers.google.com/youtube/iframe_api_reference
     * https://developer.chrome.com/blog/autoplay/#iframe-delegation
     *
     * @ref Vimeo
     * https://stackoverflow.com/questions/10488943/easy-way-to-get-vimeo-id-from-a-vimeo-url
     * https://vimeo.zendesk.com/hc/en-us/articles/360000121668-Starting-playback-at-a-specific-timecode
     * https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters
     */
    var Video = /** @class */ (function () {
        function Video(instance) {
            // get lightGallery core plugin instance
            this.core = instance;
            this.settings = __assign(__assign({}, videoSettings), this.core.settings);
            return this;
        }
        Video.prototype.init = function () {
            var _this = this;
            /**
             * Event triggered when video url found without poster
             * Append video HTML
             * Play if autoplayFirstVideo is true
             */
            this.core.LGel.on(lGEvents.hasVideo + ".video", this.onHasVideo.bind(this));
            this.core.LGel.on(lGEvents.posterClick + ".video", function () {
                var $el = _this.core.getSlideItem(_this.core.index);
                _this.loadVideoOnPosterClick($el);
            });
            this.core.LGel.on(lGEvents.slideItemLoad + ".video", this.onSlideItemLoad.bind(this));
            // @desc fired immediately before each slide transition.
            this.core.LGel.on(lGEvents.beforeSlide + ".video", this.onBeforeSlide.bind(this));
            // @desc fired immediately after each slide transition.
            this.core.LGel.on(lGEvents.afterSlide + ".video", this.onAfterSlide.bind(this));
        };
        /**
         * @desc Event triggered when a slide is completely loaded
         *
         * @param {Event} event - lightGalley custom event
         */
        Video.prototype.onSlideItemLoad = function (event) {
            var _this = this;
            var _a = event.detail, isFirstSlide = _a.isFirstSlide, index = _a.index;
            // Should check the active slide as well as user may have moved to different slide before the first slide is loaded
            if (this.settings.autoplayFirstVideo &&
                isFirstSlide &&
                index === this.core.index) {
                // Delay is just for the transition effect on video load
                setTimeout(function () {
                    _this.loadAndPlayVideo(index);
                }, 200);
            }
            // Should not call on first slide. should check only if the slide is active
            if (!isFirstSlide &&
                this.settings.autoplayVideoOnSlide &&
                index === this.core.index) {
                this.loadAndPlayVideo(index);
            }
        };
        /**
         * @desc Event triggered when video url or poster found
         * Append video HTML is poster is not given
         * Play if autoplayFirstVideo is true
         *
         * @param {Event} event - Javascript Event object.
         */
        Video.prototype.onHasVideo = function (event) {
            var _a = event.detail, index = _a.index, src = _a.src, html5Video = _a.html5Video, hasPoster = _a.hasPoster;
            if (!hasPoster) {
                // All functions are called separately if poster exist in loadVideoOnPosterClick function
                this.appendVideos(this.core.getSlideItem(index), {
                    src: src,
                    addClass: 'lg-object',
                    index: index,
                    html5Video: html5Video,
                });
                // Automatically navigate to next slide once video reaches the end.
                this.gotoNextSlideOnVideoEnd(src, index);
            }
        };
        /**
         * @desc fired immediately before each slide transition.
         * Pause the previous video
         * Hide the download button if the slide contains YouTube, Vimeo, or Wistia videos.
         *
         * @param {Event} event - Javascript Event object.
         * @param {number} prevIndex - Previous index of the slide.
         * @param {number} index - Current index of the slide
         */
        Video.prototype.onBeforeSlide = function (event) {
            if (this.core.lGalleryOn) {
                var prevIndex = event.detail.prevIndex;
                this.pauseVideo(prevIndex);
            }
        };
        /**
         * @desc fired immediately after each slide transition.
         * Play video if autoplayVideoOnSlide option is enabled.
         *
         * @param {Event} event - Javascript Event object.
         * @param {number} prevIndex - Previous index of the slide.
         * @param {number} index - Current index of the slide
         * @todo should check on onSlideLoad as well if video is not loaded on after slide
         */
        Video.prototype.onAfterSlide = function (event) {
            var _this = this;
            var _a = event.detail, index = _a.index, prevIndex = _a.prevIndex;
            // Do not call on first slide
            var $slide = this.core.getSlideItem(index);
            if (this.settings.autoplayVideoOnSlide && index !== prevIndex) {
                if ($slide.hasClass('lg-complete')) {
                    setTimeout(function () {
                        _this.loadAndPlayVideo(index);
                    }, 100);
                }
            }
        };
        Video.prototype.loadAndPlayVideo = function (index) {
            var $slide = this.core.getSlideItem(index);
            var currentGalleryItem = this.core.galleryItems[index];
            if (currentGalleryItem.poster) {
                this.loadVideoOnPosterClick($slide, true);
            }
            else {
                this.playVideo(index);
            }
        };
        /**
         * Play HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
         * @param {number} index - Index of the slide
         */
        Video.prototype.playVideo = function (index) {
            this.controlVideo(index, 'play');
        };
        /**
         * Pause HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
         * @param {number} index - Index of the slide
         */
        Video.prototype.pauseVideo = function (index) {
            this.controlVideo(index, 'pause');
        };
        Video.prototype.getVideoHtml = function (src, addClass, index, html5Video) {
            var video = '';
            var videoInfo = this.core.galleryItems[index]
                .__slideVideoInfo || {};
            var currentGalleryItem = this.core.galleryItems[index];
            var videoTitle = currentGalleryItem.title || currentGalleryItem.alt;
            videoTitle = videoTitle ? 'title="' + videoTitle + '"' : '';
            var commonIframeProps = "allowtransparency=\"true\"\n            frameborder=\"0\"\n            scrolling=\"no\"\n            allowfullscreen\n            mozallowfullscreen\n            webkitallowfullscreen\n            oallowfullscreen\n            msallowfullscreen";
            if (videoInfo.youtube) {
                var videoId = 'lg-youtube' + index;
                var youTubeParams = getYouTubeParams(videoInfo, this.settings.youTubePlayerParams);
                var isYouTubeNoCookieURL = isYouTubeNoCookie(src);
                var youtubeURL = isYouTubeNoCookieURL
                    ? '//www.youtube-nocookie.com/'
                    : '//www.youtube.com/';
                video = "<iframe allow=\"autoplay\" id=" + videoId + " class=\"lg-video-object lg-youtube " + addClass + "\" " + videoTitle + " src=\"" + youtubeURL + "embed/" + (videoInfo.youtube[1] + youTubeParams) + "\" " + commonIframeProps + "></iframe>";
            }
            else if (videoInfo.vimeo) {
                var videoId = 'lg-vimeo' + index;
                var playerParams = getVimeoURLParams(this.settings.vimeoPlayerParams, videoInfo);
                video = "<iframe allow=\"autoplay\" id=" + videoId + " class=\"lg-video-object lg-vimeo " + addClass + "\" " + videoTitle + " src=\"//player.vimeo.com/video/" + (videoInfo.vimeo[1] + playerParams) + "\" " + commonIframeProps + "></iframe>";
            }
            else if (videoInfo.wistia) {
                var wistiaId = 'lg-wistia' + index;
                var playerParams = param(this.settings.wistiaPlayerParams);
                playerParams = playerParams ? '?' + playerParams : '';
                video = "<iframe allow=\"autoplay\" id=\"" + wistiaId + "\" src=\"//fast.wistia.net/embed/iframe/" + (videoInfo.wistia[4] + playerParams) + "\" " + videoTitle + " class=\"wistia_embed lg-video-object lg-wistia " + addClass + "\" name=\"wistia_embed\" " + commonIframeProps + "></iframe>";
            }
            else if (videoInfo.html5) {
                var html5VideoMarkup = '';
                for (var i = 0; i < html5Video.source.length; i++) {
                    var type = html5Video.source[i].type;
                    var typeAttr = type ? "type=\"" + type + "\"" : '';
                    html5VideoMarkup += "<source src=\"" + html5Video.source[i].src + "\" " + typeAttr + ">";
                }
                if (html5Video.tracks) {
                    var _loop_1 = function (i) {
                        var trackAttributes = '';
                        var track = html5Video.tracks[i];
                        Object.keys(track || {}).forEach(function (key) {
                            trackAttributes += key + "=\"" + track[key] + "\" ";
                        });
                        html5VideoMarkup += "<track " + trackAttributes + ">";
                    };
                    for (var i = 0; i < html5Video.tracks.length; i++) {
                        _loop_1(i);
                    }
                }
                var html5VideoAttrs_1 = '';
                var videoAttributes_1 = html5Video.attributes || {};
                Object.keys(videoAttributes_1 || {}).forEach(function (key) {
                    html5VideoAttrs_1 += key + "=\"" + videoAttributes_1[key] + "\" ";
                });
                video = "<video class=\"lg-video-object lg-html5 " + (this.settings.videojs && this.settings.videojsTheme
                    ? this.settings.videojsTheme + ' '
                    : '') + " " + (this.settings.videojs ? ' video-js' : '') + "\" " + html5VideoAttrs_1 + ">\n                " + html5VideoMarkup + "\n                Your browser does not support HTML5 video.\n            </video>";
            }
            return video;
        };
        /**
         * @desc - Append videos to the slide
         *
         * @param {HTMLElement} el - slide element
         * @param {Object} videoParams - Video parameters, Contains src, class, index, htmlVideo
         */
        Video.prototype.appendVideos = function (el, videoParams) {
            var _a;
            var videoHtml = this.getVideoHtml(videoParams.src, videoParams.addClass, videoParams.index, videoParams.html5Video);
            el.find('.lg-video-cont').append(videoHtml);
            var $videoElement = el.find('.lg-video-object').first();
            if (videoParams.html5Video) {
                $videoElement.on('mousedown.lg.video', function (e) {
                    e.stopPropagation();
                });
            }
            if (this.settings.videojs && ((_a = this.core.galleryItems[videoParams.index].__slideVideoInfo) === null || _a === void 0 ? void 0 : _a.html5)) {
                try {
                    return videojs($videoElement.get(), this.settings.videojsOptions);
                }
                catch (e) {
                    console.error('lightGallery:- Make sure you have included videojs');
                }
            }
        };
        Video.prototype.gotoNextSlideOnVideoEnd = function (src, index) {
            var _this = this;
            var $videoElement = this.core
                .getSlideItem(index)
                .find('.lg-video-object')
                .first();
            var videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
            if (this.settings.gotoNextSlideOnVideoEnd) {
                if (videoInfo.html5) {
                    $videoElement.on('ended', function () {
                        _this.core.goToNextSlide();
                    });
                }
                else if (videoInfo.vimeo) {
                    try {
                        // https://github.com/vimeo/player.js/#ended
                        new Vimeo.Player($videoElement.get()).on('ended', function () {
                            _this.core.goToNextSlide();
                        });
                    }
                    catch (e) {
                        console.error('lightGallery:- Make sure you have included //github.com/vimeo/player.js');
                    }
                }
                else if (videoInfo.wistia) {
                    try {
                        window._wq = window._wq || [];
                        // @todo Event is gettign triggered multiple times
                        window._wq.push({
                            id: $videoElement.attr('id'),
                            onReady: function (video) {
                                video.bind('end', function () {
                                    _this.core.goToNextSlide();
                                });
                            },
                        });
                    }
                    catch (e) {
                        console.error('lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js');
                    }
                }
            }
        };
        Video.prototype.controlVideo = function (index, action) {
            var $videoElement = this.core
                .getSlideItem(index)
                .find('.lg-video-object')
                .first();
            var videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
            if (!$videoElement.get())
                return;
            if (videoInfo.youtube) {
                try {
                    $videoElement.get().contentWindow.postMessage("{\"event\":\"command\",\"func\":\"" + action + "Video\",\"args\":\"\"}", '*');
                }
                catch (e) {
                    console.error("lightGallery:- " + e);
                }
            }
            else if (videoInfo.vimeo) {
                try {
                    new Vimeo.Player($videoElement.get())[action]();
                }
                catch (e) {
                    console.error('lightGallery:- Make sure you have included //github.com/vimeo/player.js');
                }
            }
            else if (videoInfo.html5) {
                if (this.settings.videojs) {
                    try {
                        videojs($videoElement.get())[action]();
                    }
                    catch (e) {
                        console.error('lightGallery:- Make sure you have included videojs');
                    }
                }
                else {
                    $videoElement.get()[action]();
                }
            }
            else if (videoInfo.wistia) {
                try {
                    window._wq = window._wq || [];
                    // @todo Find a way to destroy wistia player instance
                    window._wq.push({
                        id: $videoElement.attr('id'),
                        onReady: function (video) {
                            video[action]();
                        },
                    });
                }
                catch (e) {
                    console.error('lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js');
                }
            }
        };
        Video.prototype.loadVideoOnPosterClick = function ($el, forcePlay) {
            var _this = this;
            // check slide has poster
            if (!$el.hasClass('lg-video-loaded')) {
                // check already video element present
                if (!$el.hasClass('lg-has-video')) {
                    $el.addClass('lg-has-video');
                    var _html = void 0;
                    var _src = this.core.galleryItems[this.core.index].src;
                    var video = this.core.galleryItems[this.core.index].video;
                    if (video) {
                        _html =
                            typeof video === 'string' ? JSON.parse(video) : video;
                    }
                    var videoJsPlayer_1 = this.appendVideos($el, {
                        src: _src,
                        addClass: '',
                        index: this.core.index,
                        html5Video: _html,
                    });
                    this.gotoNextSlideOnVideoEnd(_src, this.core.index);
                    var $tempImg = $el.find('.lg-object').first().get();
                    // @todo make sure it is working
                    $el.find('.lg-video-cont').first().append($tempImg);
                    $el.addClass('lg-video-loading');
                    videoJsPlayer_1 &&
                        videoJsPlayer_1.ready(function () {
                            videoJsPlayer_1.on('loadedmetadata', function () {
                                _this.onVideoLoadAfterPosterClick($el, _this.core.index);
                            });
                        });
                    $el.find('.lg-video-object')
                        .first()
                        .on('load.lg error.lg loadedmetadata.lg', function () {
                        setTimeout(function () {
                            _this.onVideoLoadAfterPosterClick($el, _this.core.index);
                        }, 50);
                    });
                }
                else {
                    this.playVideo(this.core.index);
                }
            }
            else if (forcePlay) {
                this.playVideo(this.core.index);
            }
        };
        Video.prototype.onVideoLoadAfterPosterClick = function ($el, index) {
            $el.addClass('lg-video-loaded');
            this.playVideo(index);
        };
        Video.prototype.destroy = function () {
            this.core.LGel.off('.lg.video');
            this.core.LGel.off('.video');
        };
        return Video;
    }());

    return Video;

})));
//# sourceMappingURL=lg-video.umd.js.map

/*!
 * lightgallery | 2.8.3 | March 1st 2025
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lgThumbnail = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var thumbnailsSettings = {
        thumbnail: true,
        animateThumb: true,
        currentPagerPosition: 'middle',
        alignThumbnails: 'middle',
        thumbWidth: 100,
        thumbHeight: '80px',
        thumbMargin: 5,
        appendThumbnailsTo: '.lg-components',
        toggleThumb: false,
        enableThumbDrag: true,
        enableThumbSwipe: true,
        thumbnailSwipeThreshold: 10,
        loadYouTubeThumbnail: true,
        youTubeThumbSize: 1,
        thumbnailPluginStrings: {
            toggleThumbnails: 'Toggle thumbnails',
        },
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
        rotateLeft: 'lgRotateLeft',
        rotateRight: 'lgRotateRight',
        flipHorizontal: 'lgFlipHorizontal',
        flipVertical: 'lgFlipVertical',
        autoplay: 'lgAutoplay',
        autoplayStart: 'lgAutoplayStart',
        autoplayStop: 'lgAutoplayStop',
    };

    var Thumbnail = /** @class */ (function () {
        function Thumbnail(instance, $LG) {
            this.thumbOuterWidth = 0;
            this.thumbTotalWidth = 0;
            this.translateX = 0;
            this.thumbClickable = false;
            // get lightGallery core plugin instance
            this.core = instance;
            this.$LG = $LG;
            return this;
        }
        Thumbnail.prototype.init = function () {
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign({}, thumbnailsSettings), this.core.settings);
            this.thumbOuterWidth = 0;
            this.thumbTotalWidth =
                this.core.galleryItems.length *
                    (this.settings.thumbWidth + this.settings.thumbMargin);
            // Thumbnail animation value
            this.translateX = 0;
            this.setAnimateThumbStyles();
            if (!this.core.settings.allowMediaOverlap) {
                this.settings.toggleThumb = false;
            }
            if (this.settings.thumbnail) {
                this.build();
                if (this.settings.animateThumb) {
                    if (this.settings.enableThumbDrag) {
                        this.enableThumbDrag();
                    }
                    if (this.settings.enableThumbSwipe) {
                        this.enableThumbSwipe();
                    }
                    this.thumbClickable = false;
                }
                else {
                    this.thumbClickable = true;
                }
                this.toggleThumbBar();
                this.thumbKeyPress();
            }
        };
        Thumbnail.prototype.build = function () {
            var _this = this;
            this.setThumbMarkup();
            this.manageActiveClassOnSlideChange();
            this.$lgThumb.first().on('click.lg touchend.lg', function (e) {
                var $target = _this.$LG(e.target);
                if (!$target.hasAttribute('data-lg-item-id')) {
                    return;
                }
                setTimeout(function () {
                    // In IE9 and bellow touch does not support
                    // Go to slide if browser does not support css transitions
                    if (_this.thumbClickable && !_this.core.lgBusy) {
                        var index = parseInt($target.attr('data-lg-item-id'));
                        _this.core.slide(index, false, true, false);
                    }
                }, 50);
            });
            this.core.LGel.on(lGEvents.beforeSlide + ".thumb", function (event) {
                var index = event.detail.index;
                _this.animateThumb(index);
            });
            this.core.LGel.on(lGEvents.beforeOpen + ".thumb", function () {
                _this.thumbOuterWidth = _this.core.outer.get().offsetWidth;
            });
            this.core.LGel.on(lGEvents.updateSlides + ".thumb", function () {
                _this.rebuildThumbnails();
            });
            this.core.LGel.on(lGEvents.containerResize + ".thumb", function () {
                if (!_this.core.lgOpened)
                    return;
                setTimeout(function () {
                    _this.thumbOuterWidth = _this.core.outer.get().offsetWidth;
                    _this.animateThumb(_this.core.index);
                    _this.thumbOuterWidth = _this.core.outer.get().offsetWidth;
                }, 50);
            });
        };
        Thumbnail.prototype.setThumbMarkup = function () {
            var thumbOuterClassNames = 'lg-thumb-outer ';
            if (this.settings.alignThumbnails) {
                thumbOuterClassNames += "lg-thumb-align-" + this.settings.alignThumbnails;
            }
            var html = "<div class=\"" + thumbOuterClassNames + "\">\n        <div class=\"lg-thumb lg-group\">\n        </div>\n        </div>";
            this.core.outer.addClass('lg-has-thumb');
            if (this.settings.appendThumbnailsTo === '.lg-components') {
                this.core.$lgComponents.append(html);
            }
            else {
                this.core.outer.append(html);
            }
            this.$thumbOuter = this.core.outer.find('.lg-thumb-outer').first();
            this.$lgThumb = this.core.outer.find('.lg-thumb').first();
            if (this.settings.animateThumb) {
                this.core.outer
                    .find('.lg-thumb')
                    .css('transition-duration', this.core.settings.speed + 'ms')
                    .css('width', this.thumbTotalWidth + 'px')
                    .css('position', 'relative');
            }
            this.setThumbItemHtml(this.core.galleryItems);
        };
        Thumbnail.prototype.enableThumbDrag = function () {
            var _this = this;
            var thumbDragUtils = {
                cords: {
                    startX: 0,
                    endX: 0,
                },
                isMoved: false,
                newTranslateX: 0,
                startTime: new Date(),
                endTime: new Date(),
                touchMoveTime: 0,
            };
            var isDragging = false;
            this.$thumbOuter.addClass('lg-grab');
            this.core.outer
                .find('.lg-thumb')
                .first()
                .on('mousedown.lg.thumb', function (e) {
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                    // execute only on .lg-object
                    e.preventDefault();
                    thumbDragUtils.cords.startX = e.pageX;
                    thumbDragUtils.startTime = new Date();
                    _this.thumbClickable = false;
                    isDragging = true;
                    // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                    _this.core.outer.get().scrollLeft += 1;
                    _this.core.outer.get().scrollLeft -= 1;
                    // *
                    _this.$thumbOuter
                        .removeClass('lg-grab')
                        .addClass('lg-grabbing');
                }
            });
            this.$LG(window).on("mousemove.lg.thumb.global" + this.core.lgId, function (e) {
                if (!_this.core.lgOpened)
                    return;
                if (isDragging) {
                    thumbDragUtils.cords.endX = e.pageX;
                    thumbDragUtils = _this.onThumbTouchMove(thumbDragUtils);
                }
            });
            this.$LG(window).on("mouseup.lg.thumb.global" + this.core.lgId, function () {
                if (!_this.core.lgOpened)
                    return;
                if (thumbDragUtils.isMoved) {
                    thumbDragUtils = _this.onThumbTouchEnd(thumbDragUtils);
                }
                else {
                    _this.thumbClickable = true;
                }
                if (isDragging) {
                    isDragging = false;
                    _this.$thumbOuter.removeClass('lg-grabbing').addClass('lg-grab');
                }
            });
        };
        Thumbnail.prototype.enableThumbSwipe = function () {
            var _this = this;
            var thumbDragUtils = {
                cords: {
                    startX: 0,
                    endX: 0,
                },
                isMoved: false,
                newTranslateX: 0,
                startTime: new Date(),
                endTime: new Date(),
                touchMoveTime: 0,
            };
            this.$lgThumb.on('touchstart.lg', function (e) {
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                    e.preventDefault();
                    thumbDragUtils.cords.startX = e.targetTouches[0].pageX;
                    _this.thumbClickable = false;
                    thumbDragUtils.startTime = new Date();
                }
            });
            this.$lgThumb.on('touchmove.lg', function (e) {
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                    e.preventDefault();
                    thumbDragUtils.cords.endX = e.targetTouches[0].pageX;
                    thumbDragUtils = _this.onThumbTouchMove(thumbDragUtils);
                }
            });
            this.$lgThumb.on('touchend.lg', function () {
                if (thumbDragUtils.isMoved) {
                    thumbDragUtils = _this.onThumbTouchEnd(thumbDragUtils);
                }
                else {
                    _this.thumbClickable = true;
                }
            });
        };
        // Rebuild thumbnails
        Thumbnail.prototype.rebuildThumbnails = function () {
            var _this = this;
            // Remove transitions
            this.$thumbOuter.addClass('lg-rebuilding-thumbnails');
            setTimeout(function () {
                _this.thumbTotalWidth =
                    _this.core.galleryItems.length *
                        (_this.settings.thumbWidth + _this.settings.thumbMargin);
                _this.$lgThumb.css('width', _this.thumbTotalWidth + 'px');
                _this.$lgThumb.empty();
                _this.setThumbItemHtml(_this.core.galleryItems);
                _this.animateThumb(_this.core.index);
            }, 50);
            setTimeout(function () {
                _this.$thumbOuter.removeClass('lg-rebuilding-thumbnails');
            }, 200);
        };
        // @ts-check
        Thumbnail.prototype.setTranslate = function (value) {
            this.$lgThumb.css('transform', 'translate3d(-' + value + 'px, 0px, 0px)');
        };
        Thumbnail.prototype.getPossibleTransformX = function (left) {
            if (left > this.thumbTotalWidth - this.thumbOuterWidth) {
                left = this.thumbTotalWidth - this.thumbOuterWidth;
            }
            if (left < 0) {
                left = 0;
            }
            return left;
        };
        Thumbnail.prototype.animateThumb = function (index) {
            this.$lgThumb.css('transition-duration', this.core.settings.speed + 'ms');
            if (this.settings.animateThumb) {
                var position = 0;
                switch (this.settings.currentPagerPosition) {
                    case 'left':
                        position = 0;
                        break;
                    case 'middle':
                        position =
                            this.thumbOuterWidth / 2 - this.settings.thumbWidth / 2;
                        break;
                    case 'right':
                        position = this.thumbOuterWidth - this.settings.thumbWidth;
                }
                this.translateX =
                    (this.settings.thumbWidth + this.settings.thumbMargin) * index -
                        1 -
                        position;
                if (this.translateX > this.thumbTotalWidth - this.thumbOuterWidth) {
                    this.translateX = this.thumbTotalWidth - this.thumbOuterWidth;
                }
                if (this.translateX < 0) {
                    this.translateX = 0;
                }
                this.setTranslate(this.translateX);
            }
        };
        Thumbnail.prototype.onThumbTouchMove = function (thumbDragUtils) {
            thumbDragUtils.newTranslateX = this.translateX;
            thumbDragUtils.isMoved = true;
            thumbDragUtils.touchMoveTime = new Date().valueOf();
            thumbDragUtils.newTranslateX -=
                thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
            thumbDragUtils.newTranslateX = this.getPossibleTransformX(thumbDragUtils.newTranslateX);
            // move current slide
            this.setTranslate(thumbDragUtils.newTranslateX);
            this.$thumbOuter.addClass('lg-dragging');
            return thumbDragUtils;
        };
        Thumbnail.prototype.onThumbTouchEnd = function (thumbDragUtils) {
            thumbDragUtils.isMoved = false;
            thumbDragUtils.endTime = new Date();
            this.$thumbOuter.removeClass('lg-dragging');
            var touchDuration = thumbDragUtils.endTime.valueOf() -
                thumbDragUtils.startTime.valueOf();
            var distanceXnew = thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
            var speedX = Math.abs(distanceXnew) / touchDuration;
            // Some magical numbers
            // Can be improved
            if (speedX > 0.15 &&
                thumbDragUtils.endTime.valueOf() - thumbDragUtils.touchMoveTime < 30) {
                speedX += 1;
                if (speedX > 2) {
                    speedX += 1;
                }
                speedX =
                    speedX +
                        speedX * (Math.abs(distanceXnew) / this.thumbOuterWidth);
                this.$lgThumb.css('transition-duration', Math.min(speedX - 1, 2) + 'settings');
                distanceXnew = distanceXnew * speedX;
                this.translateX = this.getPossibleTransformX(this.translateX - distanceXnew);
                this.setTranslate(this.translateX);
            }
            else {
                this.translateX = thumbDragUtils.newTranslateX;
            }
            if (Math.abs(thumbDragUtils.cords.endX - thumbDragUtils.cords.startX) <
                this.settings.thumbnailSwipeThreshold) {
                this.thumbClickable = true;
            }
            return thumbDragUtils;
        };
        Thumbnail.prototype.getThumbHtml = function (thumb, index, alt) {
            var slideVideoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
            var thumbImg;
            if (slideVideoInfo.youtube) {
                if (this.settings.loadYouTubeThumbnail) {
                    thumbImg =
                        '//img.youtube.com/vi/' +
                            slideVideoInfo.youtube[1] +
                            '/' +
                            this.settings.youTubeThumbSize +
                            '.jpg';
                }
                else {
                    thumbImg = thumb;
                }
            }
            else {
                thumbImg = thumb;
            }
            var div = document.createElement('div');
            div.setAttribute('data-lg-item-id', index + '');
            div.className = "lg-thumb-item " + (index === this.core.index ? 'active' : '');
            div.style.cssText = "width: " + this.settings.thumbWidth + "px; height: " + this.settings.thumbHeight + "; margin-right: " + this.settings.thumbMargin + "px;";
            var img = document.createElement('img');
            img.alt = alt || '';
            img.setAttribute('data-lg-item-id', index + '');
            img.src = thumbImg;
            div.appendChild(img);
            return div;
        };
        Thumbnail.prototype.setThumbItemHtml = function (items) {
            for (var i = 0; i < items.length; i++) {
                var thumb = this.getThumbHtml(items[i].thumb, i, items[i].alt);
                this.$lgThumb.append(thumb);
            }
        };
        Thumbnail.prototype.setAnimateThumbStyles = function () {
            if (this.settings.animateThumb) {
                this.core.outer.addClass('lg-animate-thumb');
            }
        };
        // Manage thumbnail active calss
        Thumbnail.prototype.manageActiveClassOnSlideChange = function () {
            var _this = this;
            // manage active class for thumbnail
            this.core.LGel.on(lGEvents.beforeSlide + ".thumb", function (event) {
                var $thumb = _this.core.outer.find('.lg-thumb-item');
                var index = event.detail.index;
                $thumb.removeClass('active');
                $thumb.eq(index).addClass('active');
            });
        };
        // Toggle thumbnail bar
        Thumbnail.prototype.toggleThumbBar = function () {
            var _this = this;
            if (this.settings.toggleThumb) {
                this.core.outer.addClass('lg-can-toggle');
                this.core.$toolbar.append('<button type="button" aria-label="' +
                    this.settings.thumbnailPluginStrings['toggleThumbnails'] +
                    '" class="lg-toggle-thumb lg-icon"></button>');
                this.core.outer
                    .find('.lg-toggle-thumb')
                    .first()
                    .on('click.lg', function () {
                    _this.core.outer.toggleClass('lg-components-open');
                });
            }
        };
        Thumbnail.prototype.thumbKeyPress = function () {
            var _this = this;
            this.$LG(window).on("keydown.lg.thumb.global" + this.core.lgId, function (e) {
                if (!_this.core.lgOpened || !_this.settings.toggleThumb)
                    return;
                if (e.keyCode === 38) {
                    e.preventDefault();
                    _this.core.outer.addClass('lg-components-open');
                }
                else if (e.keyCode === 40) {
                    e.preventDefault();
                    _this.core.outer.removeClass('lg-components-open');
                }
            });
        };
        Thumbnail.prototype.destroy = function () {
            if (this.settings.thumbnail) {
                this.$LG(window).off(".lg.thumb.global" + this.core.lgId);
                this.core.LGel.off('.lg.thumb');
                this.core.LGel.off('.thumb');
                this.$thumbOuter.remove();
                this.core.outer.removeClass('lg-has-thumb');
            }
        };
        return Thumbnail;
    }());

    return Thumbnail;

})));
//# sourceMappingURL=lg-thumbnail.umd.js.map

/*!
 * lightgallery | 2.8.3 | March 1st 2025
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lgRelativeCaption = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
        rotateLeft: 'lgRotateLeft',
        rotateRight: 'lgRotateRight',
        flipHorizontal: 'lgFlipHorizontal',
        flipVertical: 'lgFlipVertical',
        autoplay: 'lgAutoplay',
        autoplayStart: 'lgAutoplayStart',
        autoplayStop: 'lgAutoplayStop',
    };

    var relativeCaptionSettings = {
        relativeCaption: false,
    };

    /**
     * lightGallery caption for placing captions relative to the image
     */
    var RelativeCaption = /** @class */ (function () {
        function RelativeCaption(instance) {
            // get lightGallery core plugin instance
            this.core = instance;
            // Override some of lightGallery default settings
            var defaultSettings = {
                addClass: this.core.settings.addClass + ' lg-relative-caption',
            };
            this.core.settings = __assign(__assign({}, this.core.settings), defaultSettings);
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign(__assign({}, relativeCaptionSettings), this.core.settings), defaultSettings);
            return this;
        }
        RelativeCaption.prototype.init = function () {
            var _this = this;
            if (!this.settings.relativeCaption) {
                return;
            }
            this.core.LGel.on(lGEvents.slideItemLoad + ".caption", function (event) {
                var _a = event.detail, index = _a.index, delay = _a.delay;
                setTimeout(function () {
                    if (index === _this.core.index) {
                        _this.setRelativeCaption(index);
                    }
                }, delay);
            });
            this.core.LGel.on(lGEvents.afterSlide + ".caption", function (event) {
                var index = event.detail.index;
                setTimeout(function () {
                    var slide = _this.core.getSlideItem(index);
                    if (slide.hasClass('lg-complete')) {
                        _this.setRelativeCaption(index);
                    }
                });
            });
            this.core.LGel.on(lGEvents.beforeSlide + ".caption", function (event) {
                var index = event.detail.index;
                setTimeout(function () {
                    var slide = _this.core.getSlideItem(index);
                    slide.removeClass('lg-show-caption');
                });
            });
            this.core.LGel.on(lGEvents.containerResize + ".caption", function (event) {
                _this.setRelativeCaption(_this.core.index);
            });
        };
        RelativeCaption.prototype.setCaptionStyle = function (index, rect, slideWrapRect) {
            var $subHtmlInner = this.core
                .getSlideItem(index)
                .find('.lg-relative-caption-item');
            var $subHtml = this.core.getSlideItem(index).find('.lg-sub-html');
            $subHtml.css('width', rect.width + "px").css('left', rect.left + "px");
            var subHtmlRect = $subHtmlInner.get().getBoundingClientRect();
            var bottom = slideWrapRect.bottom - rect.bottom - subHtmlRect.height;
            $subHtml.css('top', "auto").css('bottom', Math.max(bottom, 0) + "px");
        };
        RelativeCaption.prototype.setRelativeCaption = function (index) {
            var slide = this.core.getSlideItem(index);
            if (slide.hasClass('lg-current')) {
                var rect = this.core
                    .getSlideItem(index)
                    .find('.lg-object')
                    .get()
                    .getBoundingClientRect();
                var slideWrapRect = this.core
                    .getSlideItem(index)
                    .get()
                    .getBoundingClientRect();
                this.setCaptionStyle(index, rect, slideWrapRect);
                slide.addClass('lg-show-caption');
            }
        };
        RelativeCaption.prototype.destroy = function () {
            this.core.LGel.off('.caption');
        };
        return RelativeCaption;
    }());

    return RelativeCaption;

})));
//# sourceMappingURL=lg-relative-caption.umd.js.map

/*!
 * lightgallery | 2.8.3 | March 1st 2025
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lgAutoplay = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
        rotateLeft: 'lgRotateLeft',
        rotateRight: 'lgRotateRight',
        flipHorizontal: 'lgFlipHorizontal',
        flipVertical: 'lgFlipVertical',
        autoplay: 'lgAutoplay',
        autoplayStart: 'lgAutoplayStart',
        autoplayStop: 'lgAutoplayStop',
    };

    var autoplaySettings = {
        autoplay: true,
        slideShowAutoplay: false,
        slideShowInterval: 5000,
        progressBar: true,
        forceSlideShowAutoplay: false,
        autoplayControls: true,
        appendAutoplayControlsTo: '.lg-toolbar',
        autoplayPluginStrings: {
            toggleAutoplay: 'Toggle Autoplay',
        },
    };

    /**
     * Creates the autoplay plugin.
     * @param {object} element - lightGallery element
     */
    var Autoplay = /** @class */ (function () {
        function Autoplay(instance) {
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign({}, autoplaySettings), this.core.settings);
            return this;
        }
        Autoplay.prototype.init = function () {
            var _this = this;
            if (!this.settings.autoplay) {
                return;
            }
            this.interval = false;
            // Identify if slide happened from autoplay
            this.fromAuto = true;
            // Identify if autoplay canceled from touch/drag
            this.pausedOnTouchDrag = false;
            this.pausedOnSlideChange = false;
            // append autoplay controls
            if (this.settings.autoplayControls) {
                this.controls();
            }
            // Create progress bar
            if (this.settings.progressBar) {
                this.core.outer.append('<div class="lg-progress-bar"><div class="lg-progress"></div></div>');
            }
            // Start autoplay
            if (this.settings.slideShowAutoplay) {
                this.core.LGel.once(lGEvents.slideItemLoad + ".autoplay", function () {
                    _this.startAutoPlay();
                });
            }
            // cancel interval on touchstart and dragstart
            this.core.LGel.on(lGEvents.dragStart + ".autoplay touchstart.lg.autoplay", function () {
                if (_this.interval) {
                    _this.stopAutoPlay();
                    _this.pausedOnTouchDrag = true;
                }
            });
            // restore autoplay if autoplay canceled from touchstart / dragstart
            this.core.LGel.on(lGEvents.dragEnd + ".autoplay touchend.lg.autoplay", function () {
                if (!_this.interval && _this.pausedOnTouchDrag) {
                    _this.startAutoPlay();
                    _this.pausedOnTouchDrag = false;
                }
            });
            this.core.LGel.on(lGEvents.beforeSlide + ".autoplay", function () {
                _this.showProgressBar();
                if (!_this.fromAuto && _this.interval) {
                    _this.stopAutoPlay();
                    _this.pausedOnSlideChange = true;
                }
                else {
                    _this.pausedOnSlideChange = false;
                }
                _this.fromAuto = false;
            });
            // restore autoplay if autoplay canceled from touchstart / dragstart
            this.core.LGel.on(lGEvents.afterSlide + ".autoplay", function () {
                if (_this.pausedOnSlideChange &&
                    !_this.interval &&
                    _this.settings.forceSlideShowAutoplay) {
                    _this.startAutoPlay();
                    _this.pausedOnSlideChange = false;
                }
            });
            // set progress
            this.showProgressBar();
        };
        Autoplay.prototype.showProgressBar = function () {
            var _this = this;
            if (this.settings.progressBar && this.fromAuto) {
                var _$progressBar_1 = this.core.outer.find('.lg-progress-bar');
                var _$progress_1 = this.core.outer.find('.lg-progress');
                if (this.interval) {
                    _$progress_1.removeAttr('style');
                    _$progressBar_1.removeClass('lg-start');
                    setTimeout(function () {
                        _$progress_1.css('transition', 'width ' +
                            (_this.core.settings.speed +
                                _this.settings.slideShowInterval) +
                            'ms ease 0s');
                        _$progressBar_1.addClass('lg-start');
                    }, 20);
                }
            }
        };
        // Manage autoplay via play/stop buttons
        Autoplay.prototype.controls = function () {
            var _this = this;
            var _html = "<button aria-label=\"" + this.settings.autoplayPluginStrings['toggleAutoplay'] + "\" type=\"button\" class=\"lg-autoplay-button lg-icon\"></button>";
            // Append autoplay controls
            this.core.outer
                .find(this.settings.appendAutoplayControlsTo)
                .append(_html);
            this.core.outer
                .find('.lg-autoplay-button')
                .first()
                .on('click.lg.autoplay', function () {
                if (_this.core.outer.hasClass('lg-show-autoplay')) {
                    _this.stopAutoPlay();
                }
                else {
                    if (!_this.interval) {
                        _this.startAutoPlay();
                    }
                }
            });
        };
        // Autostart gallery
        Autoplay.prototype.startAutoPlay = function () {
            var _this = this;
            this.core.outer
                .find('.lg-progress')
                .css('transition', 'width ' +
                (this.core.settings.speed +
                    this.settings.slideShowInterval) +
                'ms ease 0s');
            this.core.outer.addClass('lg-show-autoplay');
            this.core.outer.find('.lg-progress-bar').addClass('lg-start');
            this.core.LGel.trigger(lGEvents.autoplayStart, {
                index: this.core.index,
            });
            this.interval = setInterval(function () {
                if (_this.core.index + 1 < _this.core.galleryItems.length) {
                    _this.core.index++;
                }
                else {
                    _this.core.index = 0;
                }
                _this.core.LGel.trigger(lGEvents.autoplay, {
                    index: _this.core.index,
                });
                _this.fromAuto = true;
                _this.core.slide(_this.core.index, false, false, 'next');
            }, this.core.settings.speed + this.settings.slideShowInterval);
        };
        // cancel Autostart
        Autoplay.prototype.stopAutoPlay = function () {
            if (this.interval) {
                this.core.LGel.trigger(lGEvents.autoplayStop, {
                    index: this.core.index,
                });
                this.core.outer.find('.lg-progress').removeAttr('style');
                this.core.outer.removeClass('lg-show-autoplay');
                this.core.outer.find('.lg-progress-bar').removeClass('lg-start');
            }
            clearInterval(this.interval);
            this.interval = false;
        };
        Autoplay.prototype.closeGallery = function () {
            this.stopAutoPlay();
        };
        Autoplay.prototype.destroy = function () {
            if (this.settings.autoplay) {
                this.core.outer.find('.lg-progress-bar').remove();
            }
            // Remove all event listeners added by autoplay plugin
            this.core.LGel.off('.lg.autoplay');
            this.core.LGel.off('.autoplay');
        };
        return Autoplay;
    }());

    return Autoplay;

})));
//# sourceMappingURL=lg-autoplay.umd.js.map

/*!
 * Masonry PACKAGED v4.2.2
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

!function(t,e){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,r,a){function h(t,e,n){var o,r="$()."+i+'("'+e+'")';return t.each(function(t,h){var u=a.data(h,i);if(!u)return void s(i+" not initialized. Cannot call methods, i.e. "+r);var d=u[e];if(!d||"_"==e.charAt(0))return void s(r+" is not a valid method");var l=d.apply(u,n);o=void 0===o?l:o}),void 0!==o?o:t}function u(t,e){t.each(function(t,n){var o=a.data(n,i);o?(o.option(e),o._init()):(o=new r(n,e),a.data(n,i,o))})}a=a||e||t.jQuery,a&&(r.prototype.option||(r.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=o.call(arguments,1);return h(this,t,e)}return u(this,t),this},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var o=Array.prototype.slice,r=t.console,s="undefined"==typeof r?function(){}:function(t){r.error(t)};return n(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){i=i.slice(0),e=e||[];for(var n=this._onceEvents&&this._onceEvents[t],o=0;o<i.length;o++){var r=i[o],s=n&&n[r];s&&(this.off(t,r),delete n[r]),r.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t}),function(t,e){"function"==typeof define&&define.amd?define("get-size/get-size",e):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=-1==t.indexOf("%")&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;u>e;e++){var i=h[e];t[i]=0}return t}function n(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),e}function o(){if(!d){d=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var o=n(e);s=200==Math.round(t(o.width)),r.isBoxSizeOuter=s,i.removeChild(e)}}function r(e){if(o(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var r=n(e);if("none"==r.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var d=a.isBorderBox="border-box"==r.boxSizing,l=0;u>l;l++){var c=h[l],f=r[c],m=parseFloat(f);a[c]=isNaN(m)?0:m}var p=a.paddingLeft+a.paddingRight,g=a.paddingTop+a.paddingBottom,y=a.marginLeft+a.marginRight,v=a.marginTop+a.marginBottom,_=a.borderLeftWidth+a.borderRightWidth,z=a.borderTopWidth+a.borderBottomWidth,E=d&&s,b=t(r.width);b!==!1&&(a.width=b+(E?0:p+_));var x=t(r.height);return x!==!1&&(a.height=x+(E?0:g+z)),a.innerWidth=a.width-(p+_),a.innerHeight=a.height-(g+z),a.outerWidth=a.width+y,a.outerHeight=a.height+v,a}}var s,a="undefined"==typeof console?e:function(t){console.error(t)},h=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],u=h.length,d=!1;return r}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=window.Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i],o=n+"MatchesSelector";if(t[o])return o}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e};var n=Array.prototype.slice;i.makeArray=function(t){if(Array.isArray(t))return t;if(null===t||void 0===t)return[];var e="object"==typeof t&&"number"==typeof t.length;return e?n.call(t):[t]},i.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},i.getParent=function(t,i){for(;t.parentNode&&t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var o=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void o.push(t);e(t,n)&&o.push(t);for(var i=t.querySelectorAll(n),r=0;r<i.length;r++)o.push(i[r])}}),o},i.debounceMethod=function(t,e,i){i=i||100;var n=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];clearTimeout(t);var e=arguments,r=this;this[o]=setTimeout(function(){n.apply(r,e),delete r[o]},i)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var o=t.console;return i.htmlInit=function(e,n){i.docReady(function(){var r=i.toDashed(n),s="data-"+r,a=document.querySelectorAll("["+s+"]"),h=document.querySelectorAll(".js-"+r),u=i.makeArray(a).concat(i.makeArray(h)),d=s+"-options",l=t.jQuery;u.forEach(function(t){var i,r=t.getAttribute(s)||t.getAttribute(d);try{i=r&&JSON.parse(r)}catch(a){return void(o&&o.error("Error parsing "+s+" on "+t.className+": "+a))}var h=new e(t,i);l&&l.data(t,n,h)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";function i(t){for(var e in t)return!1;return e=null,!0}function n(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function o(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var r=document.documentElement.style,s="string"==typeof r.transition?"transition":"WebkitTransition",a="string"==typeof r.transform?"transform":"WebkitTransform",h={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[s],u={transform:a,transition:s,transitionDuration:s+"Duration",transitionProperty:s+"Property",transitionDelay:s+"Delay"},d=n.prototype=Object.create(t.prototype);d.constructor=n,d._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},d.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},d.getSize=function(){this.size=e(this.element)},d.css=function(t){var e=this.element.style;for(var i in t){var n=u[i]||i;e[n]=t[i]}},d.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),n=t[e?"left":"right"],o=t[i?"top":"bottom"],r=parseFloat(n),s=parseFloat(o),a=this.layout.size;-1!=n.indexOf("%")&&(r=r/100*a.width),-1!=o.indexOf("%")&&(s=s/100*a.height),r=isNaN(r)?0:r,s=isNaN(s)?0:s,r-=e?a.paddingLeft:a.paddingRight,s-=i?a.paddingTop:a.paddingBottom,this.position.x=r,this.position.y=s},d.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop"),o=i?"paddingLeft":"paddingRight",r=i?"left":"right",s=i?"right":"left",a=this.position.x+t[o];e[r]=this.getXValue(a),e[s]="";var h=n?"paddingTop":"paddingBottom",u=n?"top":"bottom",d=n?"bottom":"top",l=this.position.y+t[h];e[u]=this.getYValue(l),e[d]="",this.css(e),this.emitEvent("layout",[this])},d.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},d.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},d._transitionTo=function(t,e){this.getPosition();var i=this.position.x,n=this.position.y,o=t==this.position.x&&e==this.position.y;if(this.setPosition(t,e),o&&!this.isTransitioning)return void this.layoutPosition();var r=t-i,s=e-n,a={};a.transform=this.getTranslate(r,s),this.transition({to:a,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},d.getTranslate=function(t,e){var i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop");return t=i?t:-t,e=n?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},d.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},d.moveTo=d._transitionTo,d.setPosition=function(t,e){this.position.x=parseFloat(t),this.position.y=parseFloat(e)},d._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},d.transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var n=this.element.offsetHeight;n=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var l="opacity,"+o(a);d.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:l,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(h,this,!1)}},d.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},d.onotransitionend=function(t){this.ontransitionend(t)};var c={"-webkit-transform":"transform"};d.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,n=c[t.propertyName]||t.propertyName;if(delete e.ingProperties[n],i(e.ingProperties)&&this.disableTransition(),n in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[n]),n in e.onEnd){var o=e.onEnd[n];o.call(this),delete e.onEnd[n]}this.emitEvent("transitionEnd",[this])}},d.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(h,this,!1),this.isTransitioning=!1},d._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var f={transitionProperty:"",transitionDuration:"",transitionDelay:""};return d.removeTransitionStyles=function(){this.css(f)},d.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},d.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},d.remove=function(){return s&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},d.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},d.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},d.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},d.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},d.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},d.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},n}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,n,o){"use strict";function r(t,e){var i=n.getQueryElement(t);if(!i)return void(h&&h.error("Bad element for "+this.constructor.namespace+": "+(i||t)));this.element=i,u&&(this.$element=u(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e);var o=++l;this.element.outlayerGUID=o,c[o]=this,this._create();var r=this._getOption("initLayout");r&&this.layout()}function s(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}function a(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),i=e&&e[1],n=e&&e[2];if(!i.length)return 0;i=parseFloat(i);var o=m[n]||1;return i*o}var h=t.console,u=t.jQuery,d=function(){},l=0,c={};r.namespace="outlayer",r.Item=o,r.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var f=r.prototype;n.extend(f,e.prototype),f.option=function(t){n.extend(this.options,t)},f._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},r.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},f._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),n.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},f.reloadItems=function(){this.items=this._itemize(this.element.children)},f._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,n=[],o=0;o<e.length;o++){var r=e[o],s=new i(r,this);n.push(s)}return n},f._filterFindItemElements=function(t){return n.filterFindElements(t,this.options.itemSelector)},f.getItemElements=function(){return this.items.map(function(t){return t.element})},f.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},f._init=f.layout,f._resetLayout=function(){this.getSize()},f.getSize=function(){this.size=i(this.element)},f._getMeasurement=function(t,e){var n,o=this.options[t];o?("string"==typeof o?n=this.element.querySelector(o):o instanceof HTMLElement&&(n=o),this[t]=n?i(n)[e]:o):this[t]=0},f.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},f._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},f._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var n=this._getItemLayoutPosition(t);n.item=t,n.isInstant=e||t.isLayoutInstant,i.push(n)},this),this._processLayoutQueue(i)}},f._getItemLayoutPosition=function(){return{x:0,y:0}},f._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},f.updateStagger=function(){var t=this.options.stagger;return null===t||void 0===t?void(this.stagger=0):(this.stagger=a(t),this.stagger)},f._positionItem=function(t,e,i,n,o){n?t.goTo(e,i):(t.stagger(o*this.stagger),t.moveTo(e,i))},f._postLayout=function(){this.resizeContainer()},f.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},f._getContainerSize=d,f._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},f._emitCompleteOnItems=function(t,e){function i(){o.dispatchEvent(t+"Complete",null,[e])}function n(){s++,s==r&&i()}var o=this,r=e.length;if(!e||!r)return void i();var s=0;e.forEach(function(e){e.once(t,n)})},f.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),u)if(this.$element=this.$element||u(this.element),e){var o=u.Event(e);o.type=t,this.$element.trigger(o,i)}else this.$element.trigger(t,i)},f.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},f.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},f.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},f.unstamp=function(t){t=this._find(t),t&&t.forEach(function(t){n.removeFrom(this.stamps,t),this.unignore(t)},this)},f._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=n.makeArray(t)):void 0},f._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},f._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},f._manageStamp=d,f._getElementOffset=function(t){var e=t.getBoundingClientRect(),n=this._boundingRect,o=i(t),r={left:e.left-n.left-o.marginLeft,top:e.top-n.top-o.marginTop,right:n.right-e.right-o.marginRight,bottom:n.bottom-e.bottom-o.marginBottom};return r},f.handleEvent=n.handleEvent,f.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},f.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},f.onresize=function(){this.resize()},n.debounceMethod(r,"onresize",100),f.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},f.needsResizeLayout=function(){var t=i(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},f.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},f.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},f.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},f.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.reveal()})}},f.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.hide()})}},f.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},f.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},f.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},f.getItems=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},f.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),n.removeFrom(this.items,t)},this)},f.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete c[e],delete this.element.outlayerGUID,u&&u.removeData(this.element,this.constructor.namespace)},r.data=function(t){t=n.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&c[e]},r.create=function(t,e){var i=s(r);return i.defaults=n.extend({},r.defaults),n.extend(i.defaults,e),i.compatOptions=n.extend({},r.compatOptions),i.namespace=t,i.data=r.data,i.Item=s(o),n.htmlInit(i,t),u&&u.bridget&&u.bridget(t,i),i};var m={ms:1,s:1e3};return r.Item=o,r}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");i.compatOptions.fitWidth="isFitWidth";var n=i.prototype;return n._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},n.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var n=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,r=o/n,s=n-o%n,a=s&&1>s?"round":"floor";r=Math[a](r),this.cols=Math.max(r,1)},n.getContainerWidth=function(){var t=this._getOption("fitWidth"),i=t?this.element.parentNode:this.element,n=e(i);this.containerWidth=n&&n.innerWidth},n._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=e&&1>e?"round":"ceil",n=Math[i](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var o=this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition",r=this[o](n,t),s={x:this.columnWidth*r.col,y:r.y},a=r.y+t.size.outerHeight,h=n+r.col,u=r.col;h>u;u++)this.colYs[u]=a;return s},n._getTopColPosition=function(t){var e=this._getTopColGroup(t),i=Math.min.apply(Math,e);return{col:e.indexOf(i),y:i}},n._getTopColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,n=0;i>n;n++)e[n]=this._getColGroupY(n,t);return e},n._getColGroupY=function(t,e){if(2>e)return this.colYs[t];var i=this.colYs.slice(t,t+e);return Math.max.apply(Math,i)},n._getHorizontalColPosition=function(t,e){var i=this.horizontalColIndex%this.cols,n=t>1&&i+t>this.cols;i=n?0:i;var o=e.size.outerWidth&&e.size.outerHeight;return this.horizontalColIndex=o?i+t:this.horizontalColIndex,{col:i,y:this._getColGroupY(i,t)}},n._manageStamp=function(t){var i=e(t),n=this._getElementOffset(t),o=this._getOption("originLeft"),r=o?n.left:n.right,s=r+i.outerWidth,a=Math.floor(r/this.columnWidth);a=Math.max(0,a);var h=Math.floor(s/this.columnWidth);h-=s%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var u=this._getOption("originTop"),d=(u?n.top:n.bottom)+i.outerHeight,l=a;h>=l;l++)this.colYs[l]=Math.max(d,this.colYs[l])},n._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},n._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},n.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i});
/*!
 * PhotoAlbum v 3.00;
 * https://github.com/YuriMyakotin
 * Copyright (c) 2022-2025 Yuri Myakotin;
 * @license GPLv3
 */

let colors = [];
let CurrentFolderID = 0;
const Folders = new Map();

let ThumbSize = 0;
let ImgLightGallery;
let SiteName = "";
let SiteDescription = "";
let isPrivate = false;
let Version = 0;
let RootFolders = [];
const L = atob("RkEyMzEzQkItQ0UzMTQ5Q0YtQUJDOUUxNEYtMTVCRkU2RkI=");

document.addEventListener("DOMContentLoaded",
	async function () {

		const response = await fetch("Site.json");
		const SiteData = await response.json();

		colors = SiteData.FolderColors;
		document.body.style.backgroundColor = SiteData.BgColor;

		const rules = {};

		for (let i = 0; i < document.styleSheets.length; ++i) {
			const cssRules = document.styleSheets[i].cssRules;
			for (let j = 0; j < cssRules.length; ++j)
				rules[cssRules[j].selectorText] = cssRules[j];

		}

		rules[".folder-name"].style.color = SiteData.FolderNameColor;
		rules[".video-name"].style.color = SiteData.VideoNameColor;
		rules[".cmnt"].style.color = SiteData.ImageDescriptionColor;
		rules[".ImgName"].style.color = SiteData.ImageNameColor;
		rules[".top_navigation"].style.color = SiteData.NavBarCurrentFolderColor;
		rules[".FolderLink"].style.color = SiteData.NavBarLinkColor;
		rules[".bottom-info-bar"].style.color = SiteData.InfoBarColor;
		rules[".folder-desc"].style.color = SiteData.FolderDescriptionColor;
		rules[".ExifInfo"].style.color = SiteData.ExifInfoColor;
		rules[".GpsInfo"].style.color = SiteData.GPSInfoColor;

		if (SiteData.D != null) SiteDescription = SiteData.D;
		if (SiteData.P != null) isPrivate = SiteData.P;
		if (SiteData.V != null) Version = SiteData.V;
		ThumbSize = SiteData.TS;
		SiteName = SiteData.N;

		window.sitestats.innerHTML = SiteData.TIC.toString() + " images, "
			+ SiteData.TVC.toString() + " videos, last updated " + SiteData.LC;

		window.siteversion.innerHTML = (Version/100).toFixed(2).toString();

		const JsonFoldersArray = SiteData.F;

		JsonFoldersArray.forEach((value) => {
			value.SubFolders = [];
			Folders.set(value.I, value);

		});

		Folders.forEach((value) => {
			if (value.PI === 0)
				RootFolders.push(value.I);
			else
				Folders.get(value.PI).SubFolders.push(value.I);
		});



		LoadAlbum(0);

	});


function MakeNavStr() {
	var FolderID = CurrentFolderID;
	if (FolderID === 0) { window.NavStr.innerHTML =SiteName; return; };

	var F = Folders.get(FolderID);

	window.NavStr.innerHTML = F.N;
	while (true) {
		FolderID = F.PI;
		if (FolderID === 0) {
			window.NavStr.innerHTML = `<a class='NoDecorationLink' href="#" onclick="LoadAlbum(0)"><span class='FolderLink'>${SiteName}</span></a>&nbsp;>> ${window.NavStr.innerHTML}`;
			return;
		}
		F = Folders.get(FolderID);
		window.NavStr.innerHTML = `<a class='NoDecorationLink' href="#" onclick="LoadAlbum(${FolderID})"><span class='FolderLink'>${F.N}</span></a>&nbsp;>> ${window.NavStr.innerHTML}`;
	}
}
function LoadAlbum(FolderID) {

	CurrentFolderID = FolderID; MakeNavStr();
	var DescText="";
	if (FolderID === 0) {
		document.title = SiteName;
		DescText = SiteDescription;
	} else {
		const F = Folders.get(FolderID);
		document.title = `${SiteName}: ${F.N}`;
		if (F.C != null) DescText= F.C;
	}

	window.FolderDesc.innerText = DescText;
	if (DescText.length > 0) window.FolderDesc.style.display = "block";
	else window.FolderDesc.style.display = "none";
	LoadSubfolders();

	if (isPrivate) window.addEventListener("contextmenu", e => e.preventDefault());
}




function LoadSubfolders() {

	while (window.VideosLst.lastChild) { window.VideosLst.removeChild(window.VideosLst.lastChild); }
	while (window.ImgLst.lastChild) { window.ImgLst.removeChild(window.ImgLst.lastChild); }
	while (window.FoldersLst.lastChild) { window.FoldersLst.removeChild(window.FoldersLst.lastChild); }


	let SubFolders = (CurrentFolderID === 0) ? RootFolders : Folders.get(CurrentFolderID).SubFolders;

	let cnt = SubFolders.length;
	let i = CurrentFolderID;
	let grid = document.getElementById("FoldersLst");

	if (cnt > 0) {
		window.FoldersLst.style.display = "block";

		SubFolders.forEach((SubFolderID) => {


			const F = Folders.get(SubFolderID);
			const ThumbName = `./${F.TF.toString()}/thumbs/${F.TN}`;
			const AFol = document.createElement('a');
			const bgColor = colors[i % colors.length];
			i++;
			AFol.style.width = (ThumbSize * 2).toString() + "px";
			AFol.style.height = (ThumbSize + 8).toString() + "px";
			AFol.style.backgroundColor = bgColor;
			AFol.className = "Fol";
			AFol.onclick = function() { LoadAlbum(F.I); };
			AFol.id = `f${F.I.toString()}`;
			AFol.title = (F.D != null) ? F.D : "";
			AFol.href = "#";

			const AImg = document.createElement("img");
			AImg.className = "F";
			AImg.src = ThumbName;
			AFol.appendChild(AImg);

			const ASpan = document.createElement("span");
			ASpan.className = "folder-name";
			ASpan.textContent = F.N;
			AFol.appendChild(ASpan);

			grid.appendChild(AFol);
		});
		let msnry = new window.Masonry(grid,
		{
			itemSelector: ".Fol",
			"isFitWidth": true,
			transitionDuration: 0
		});
	}
	else window.FoldersLst.style.display = "none";

	if (CurrentFolderID === 0)
	{
		window.VideosLst.style.display = "none";
		window.ImgLst.style.display = "none";
		return;
	}

	let CurrentFolder = Folders.get(CurrentFolderID);

	cnt = CurrentFolder.V.length;


	grid = document.getElementById("VideosLst");
	if (cnt > 0)
	{
		window.VideosLst.style.display = "block";
		for (let j = 0; j < cnt; j++)
		{
			let V = CurrentFolder.V[j];
			let AVid = document.createElement("a");
			let bgColor = colors[i % colors.length];
			i++;



			AVid.className = "Vid";
			AVid.title = V.D;
			AVid.id = `Vid${V.N}`;

			AVid.href = "#";

			AVid.style.width = (ThumbSize * 2.2).toString() + "px";
			AVid.style.height = (ThumbSize*0.8 + 4).toString() + "px";
			AVid.style.backgroundColor = bgColor;
			AVid.style.wordBreak ="break-word";

			AVid.onclick = function () { ShowVideo(V.N,V.D); };


			let AImg = document.createElement("img");
			AImg.className = "V";
			AImg.src = `./Videos/thumb_${V.N}.jpg`;
			AImg.style.height = (ThumbSize*0.8).toString() + "px";
			AImg.onerror = function() { this.src = "./Content/Video.png"; };

			AVid.appendChild(AImg);

			let ASpan = document.createElement("span");
			ASpan.className = "video-name";
			ASpan.textContent = V.D;


			AVid.appendChild(ASpan);


			grid.appendChild(AVid);

		}



		let msnry = new window.Masonry(grid,
			{
				itemSelector: '.Vid', "isFitWidth": true, transitionDuration: 0
			});


	} else window.VideosLst.style.display = "none";

	grid = document.getElementById("ImgLst");
	cnt = CurrentFolder.Im.length;
	if (cnt > 0) {
		window.ImgLst.style.display = "block";
		for (let j = 0; j < cnt; j++) {
			var IM = CurrentFolder.Im[j];

			let AImg = document.createElement("A");
			AImg.className = "Img";
			AImg.href = CurrentFolderID.toString() + "/slides/" + IM.N;
			AImg.rel = "group";
			AImg.title = IM.N;
			AImg.style.width = ThumbSize.toString() + "px";
			AImg.style.height = ThumbSize.toString() + "px";

			let AThumb = document.createElement("Img");
			AThumb.className = "I";
			AThumb.src = CurrentFolderID.toString() + "/thumbs/" + IM.N;


			let InfoStr = "<div>";
			if (IM.C != null) InfoStr += `<span class='cmnt'>${IM.C}</span><br />`;
			InfoStr +=
				`<a class='NoDecorationLink' id='OrigImg' href='#' title='Original image' onclick="ShowOriginalImage(${
				CurrentFolderID},'${IM.N
				}');return false;"><span class='ImgName'>${IM.N}</span></a><br />`;
			InfoStr +=`<span class='ExifInfo'>${ExifInfoToStr(IM)}</span><br />${GPSInfoToStr(IM)}`;
			InfoStr += "<br /></div>";

			AImg.setAttribute("data-sub-html", InfoStr);

			AImg.appendChild(AThumb);
			grid.appendChild(AImg);


		}


		let msnry = new window.Masonry(grid,
			{
				itemSelector: '.Img',
				"isFitWidth": true,
				transitionDuration: 0
			});


		ImgLightGallery = window.lightGallery(grid,
			{
				licenseKey: L,
				mode: "lg-fade",
				mousewheel: true,
				download: false,
				speed: 0,
				backdropDuration: 0,
				thumbnail: true,
				slideEndAnimation: false,
				startAnimationDuration: 0,
				getCaptionFromTitleOrAlt: false,
				subHtmlSelectorRelative: true,
				startClass: '',
				toogleThumb: false,
				plugins: [lgThumbnail, lgAutoplay, lgRelativeCaption]

			});


	} else window.ImgLst.style.display = "none";

}

function ShowOriginalImage(FolderID, ImageName) {

	var CurrentIdx = ImgLightGallery.index;
	ImgLightGallery.closeGallery();

	const OrigImageLG = window.lightGallery(document.getElementById("OrigImg"),
		{
			licenseKey: L,
			startAnimationDuration: 0,
			backdropDuration: 0,
			counter: false,
			download: !isPrivate,
			speed: 0,
			dynamic: true,
			dynamicEl: [{ src: FolderID.toString() + "/" + ImageName }],
			plugins:[lgZoom]
		});

	OrigImageLG.openGallery(0);
	document.getElementById("OrigImg").addEventListener('lgAfterClose', () => { ImgLightGallery.openGallery(CurrentIdx); });

}




function ShowVideo(VideoName,VideoDescription) {
	const ctrlList=(isPrivate)?"nodownload":"";

	const VideoLG = window.lightGallery(document.getElementById(`Vid${VideoName}`),
		{
			licenseKey: L,
			autoplayVideoOnSlide: true,
			startAnimationDuration: 0,
			backdropDuration: 0,
			counter: false,
			download: false,
			speed: 0,
			dynamic: true,
			dynamicEl: [
				{

					video: {
						source: [
							{
								src: `./videos/${VideoName}`,
								type: "video/mp4"
							}
						],
						attributes: { preload: false, controls: true, controlsList:ctrlList }
					},
					subHtml: `<h2>${VideoDescription}</h2>`
				}
			],
			plugins: [lgVideo]
		});

	VideoLG.openGallery(0);
}


function ConvertDEGToDMS(degstr, lat) {
	const deg = parseFloat(degstr);
	const absolute = Math.abs(deg);

	const degrees = Math.floor(absolute);
	const minutesNotTruncated = (absolute - degrees) * 60;
	const minutes = Math.floor(minutesNotTruncated);
	const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
	var direction;
	if (lat) {
		direction = deg >= 0 ? "N" : "S";
	} else {
		direction = deg >= 0 ? "E" : "W";
	}

	return degrees + "°" + minutes + "'" + seconds + "\"" + direction;
}

function ExifInfoToStr(IM) {
	var retval = "";
	if (IM.D != null) retval += IM.D + "&nbsp; ";
	if (IM.Cn != null) retval += IM.Cn + "&nbsp; ";
	if (IM.F != null) retval += IM.F + "mm&nbsp; ";
	if (IM.I != null) retval += `ISO:${IM.I}&nbsp; `;
	if (IM.E != null) retval += IM.E + "s&nbsp; ";
	if (IM.A != null) retval += `f/${IM.A}&nbsp; `;
	return retval;

}

function GPSInfoToStr(IM) {

	var retval = "";
	if ((IM.La != null) && (IM.Lo != null))
	{
		const gmapscoords = IM.La + ","+IM.Lo;
		const textcoords = ConvertDEGToDMS(IM.La, true) + ",&nbsp;" + ConvertDEGToDMS(IM.Lo, false);
		retval = `<a class='NoDecorationLink' href="https://www.google.com/maps/dir//${gmapscoords}/@${gmapscoords},18z" target="_blank"><span class='GpsInfo'>${textcoords}</span></a>`;
	}
	return retval;

}