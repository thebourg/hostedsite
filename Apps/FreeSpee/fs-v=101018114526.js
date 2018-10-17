/*jshint ignore:start */
var __fs_configuration_proxy, __fs_dncs, __fs_dncs_instance;

HTMLElement.prototype.addFSEventListener = function (event, callback) {
    if (this.addEventListener) {
        this.addEventListener(event, callback);
    } else {
        this.attachEvent(event, callback);
    }
};

__fs_configuration_proxy = function (instance) {
    this._instance = instance;
    this._proxyId = 0x01;

    this.push = function (arrParameter) {
        this._instance.parseConfiguration(arrParameter[0], arrParameter[1]);
    };
};

__fs_dncs = function () {
    this._advid = {};
    this._allAdvid = {};
    this._stradvid = '';
    this._shard = false;
    this._cookieDomain = false;
    this._parameterString = '';
    this._spans = [];
    this._numbers = [];
    this._classNames = ['fs-dynamic-number'];
    this._loadEventTriggered = false;
    this._formattingFunction = function (s1, s2) {
        return s1;
    };
    this._numberReplacedListeners = [];
    this._numberConfigurations = {};
    this._alternativeNumbers = {};
    this._defaultFsButtonOptions = {
        run: false,
        pre: 'Call us',
        post: ['Call us @ {{phone}}'],
        useLocalPhoneNumber: true
    };
    this._parameters = {
        'numberDetection': true,
        'trackEmailLinks': false,
        'returnInputNumber': true
    };
    this._configurationFrozen = false;
    this._cbwConfiguration = {};
    this.keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789-_" + "=";
    this._defaultCookies = ['__utma', '__utmz', '_ga', 'WT_FPC', 'xtidc', '__fsComscoreCookie', '__troRUID', 'vscr_vid'];
    this._p_s_parameters = ['__sess', '__uid', '__vdf', 'xtsd', 'xtsite', 'xtp', 'eloqua_email', 'eloqua_campaign_id'];
    this._altAnsNums = '';
    this._loadModel = 'onload';
    this._waitFor = false;
    this._getNumberEventTag = '';
    this._spa = {
        referrer: null,
        urlHistory: []
    };
    this._crossDomainRequest = false;
    this._dryRun = false;
    this._minNumberLength = 5;

    this.readConfigurationBundle();

    if (this.getParameter("autoInvoke", true) && this._waitFor === false) {
        this.addLoadEvent(function () {
            __fs_dncs_instance.loadEvent();
        });
    }
};

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

__fs_dncs.prototype = {
    base64_encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        input = unescape(encodeURIComponent(input));
        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) + this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);
        output = output.replace(/=/g, "");
        return output;
    },

    getUrlParameters: function () {
        var params = {};

        if (document.location.search) {
            var parts = document.location.search.substring(1).split('&');
            for (var i = 0; i < parts.length; i++) {
                var nv = parts[i].split('=');
                if (!nv[0]) continue;
                params[nv[0]] = nv[1] || true;
            }
        }

        return params;
    },

    getSessionId: function (advId) {
        var sId = '';

        var strAdv = this._stradvid;

        if (advId) {
            strAdv = advId;
        }

        if (this.getCookie('__fs_dncs_sessionid_' + strAdv)) {
            sId = this.getCookie('__fs_dncs_sessionid_' + strAdv);
        } else if (this.getCookie('__fs_dncs_sessionid')) {
            sId = this.getCookie('__fs_dncs_sessionid');
        }

        // Override session ID and force sameSite if exists in URL parameter (iframe/cross-domain support)
        var parms = this.getUrlParameters();
        if (typeof (parms.__fs_dncs_sessionid) !== 'undefined' && parms.__fs_dncs_sessionid !== '' && parms.__fs_dncs_sessionid !== true) {
            this._crossDomainRequest = true;
            sId = parms.__fs_dncs_sessionid;
        }

        return sId;
    },

    getTrackingId: function (advId) {
        var tId = '';
        var strAdv = this._stradvid;

        if (advId) {
            strAdv = advId;
        }

        if (this.getCookie('__fs_dncs_trackingid_' + strAdv)) {
            tId = this.getCookie('__fs_dncs_trackingid_' + strAdv);
        } else if (this.getCookie('__fs_dncs_sessionid')) {
            tId = this.getCookie('__fs_dncs_trackingid');
        }

        return tId;
    },

    stringify: function (val) {
        // WARNING: Not a full shim for JSON.stringify. Use with caution.

        var str = '';

        if (typeof val === 'number') {
            return val;
        }

        if (typeof val === 'string' || val instanceof String) {
            return '"' + val + '"';
        }

        if (Object.prototype.toString.call(val) === '[object Array]') {
            str += '[';

            for (var i = 0; i < val.length; i++) {
                str += this.stringify(val[i]);

                if (i < val.length - 1) {
                    str += ',';
                }
            }

            str += ']';
        } else {
            str += '{';

            for (var key in val) {
                if (val.hasOwnProperty(key)) {
                    str += '"' + key + '":' + this.stringify(val[key]) + ',';
                }
            }

            str = str.replace(/,$/, '');

            str += '}';
        }

        return str;
    },

    addElementClass: function (strClass) {
        this._classNames.push(strClass);
    },

    setCbwAnsweringNumber: function (strPhonenr) {
        this._cbwConfiguration.answering_number = strPhonenr;
    },

    setCbwCallerId: function (strPhonenr) {
        this._cbwConfiguration.caller_id = strPhonenr;
    },

    setAdv: function (strAdvid) {
        this._advid[strAdvid.id] = strAdvid;
        this._allAdvid[strAdvid.id] = strAdvid;
        this._stradvid = strAdvid.id;
    },

    setTestMode: function (bTestMode) {
        this._dryRun = bTestMode;
    },

    setShard: function (shard) {
        this._shard = shard;
    },

    setCookieDomain: function (cookieDomain) {
        this._cookieDomain = cookieDomain;
    },

    setMinimumNumberLength: function (minNumberLength) {
        this._minNumberLength = Number(minNumberLength);
    },

    addAlternativeAnsweringNumbers: function (altNums) {
        this._altAnsNums = altNums;
    },

    prepareData: function (b) {
        if (b && !this.checkSameSite()) {
            this.setCookie('__fs_dncs_prep_u', document.location.href, 43200);
            this.setCookie('__fs_dncs_prep_r', document.referrer ? document.referrer : '', 43200);
        }
    },

    readConfigurationBundle: function () {
        if (typeof (__fs_conf) == 'object' && !__fs_conf._proxyId) {
            var tmp_fs_conf = __fs_conf;
            __fs_conf = new __fs_configuration_proxy(this);

            for (key in tmp_fs_conf) {
                this.parseConfiguration(tmp_fs_conf[key][0], tmp_fs_conf[key][1]);
            }
        }
    },

    parseConfiguration: function (strParameter, strValue) {
        if (this._configurationFrozen) {

        } else if (typeof (this[strParameter]) == 'function') {
            this[strParameter](strValue);
        } else {
            this.setParameter(strParameter, strValue);
        }
    },


    setParameter: function (strParameter, strValue) {
        this._parameters[strParameter] = strValue;
    },

    getParameter: function (strParameter, strDefaultValue) {
        if (this._parameters.hasOwnProperty(strParameter)) {
            return this._parameters[strParameter];
        } else if (typeof (strDefaultValue) != 'undefined') {
            return strDefaultValue;
        } else {
            return null;
        }
    },

    replaceNumber: function (element, replaceWith) {
        var oldNumber = this.cleanNumber(element.innerHTML);
        var formattedNumber = this._formattingFunction(replaceWith.local, replaceWith.e164);
        if (formattedNumber === null) {
            return;
        }
        var newNumber = unescape(formattedNumber);
        var cleanNumber = this.cleanNumber(replaceWith.e164);

        if (element.tagName == "FORM") {
            oldNumber = this.cleanNumber(element.action);
            element.action = (element.action.indexOf("tel:") != -1) ? "tel:" + cleanNumber : newNumber;
        } else if (element.tagName == "A" && this.cleanNumber(element.href) == this.cleanNumber(element.innerHTML)) {
            element.innerHTML = (element.innerHTML.indexOf("tel:") != -1) ? "tel:" + cleanNumber : newNumber;
            element.href = (element.href.indexOf("tel:") != -1) ? "tel:" + cleanNumber : newNumber;
        } else if (element.tagName == "A") {
            element.href = (element.href.indexOf("tel:") != -1) ? "tel:" + cleanNumber : newNumber;
        } else if (element.tagName != "A") {
            element.innerHTML = newNumber;
        }
        this.notifyNumberReplacedListeners(element, oldNumber, newNumber);
    },

    notifyNumberReplacedListeners: function (element, number, replacedWith) {
        for (var key in this._numberReplacedListeners) {
            var thisObj = this;
            setTimeout(function () {
                thisObj._numberReplacedListeners[key](element, number, replacedWith);
            }, 1);
        }
    },

    addNumberReplacedListener: function (f) {
        if (typeof f === 'function') {
            this._numberReplacedListeners.push(f);
        }
    },

    removeNumberReplacedListener: function (f) {
        for (var i = 0; i < this._numberReplacedListeners.length; i += 1) {
            if (this._numberReplacedListeners[i] == f) {
                this._numberReplacedListeners.splice(i, 1);
                i -= 1;
            }
        }
    },

    removeAllNumberReplacedListeners: function () {
        this._numberReplacedListeners = [];
    },

    addNumberConfiguration: function (configuration) {
        if (typeof configuration[0] === 'string' && typeof configuration[1] === 'object') {
            this._numberConfigurations[this.cleanNumber(configuration[0])] = configuration[1];
        }
    },

    setParameterString: function (s) {
        this._parameterString = s;
    },

    appendCookies: function (s) {
        for (var i = 0; i < s.length; i++) {
            if (!this._defaultCookies[s[i]]) {
                this._defaultCookies.push(s[i]);
            }
        }
    },

    clearFormattingFunction: function () {
        this._formattingFunction = function (s) {
            return s;
        };
    },

    setFormattingFunction: function (f) {
        if (typeof (f) == 'function') {
            this._formattingFunction = f;
        }
    },

    waitFor: function (c, o, d, t) {
        var tP;
        var iP = setInterval(function () {
            if (typeof (__fs_dncs_instance) === 'undefined') return;
            if (!c()) return;

            clearInterval(iP);
            if (tP) clearTimeout(tP);
            o();
        }, d);

        if (t) tP = setTimeout(function () {
            clearInterval(iP);
        }, t);
    },

    setWaitForFunction: function (f, d, t) {
        if (typeof (f) == 'function') {
            if (!d) {
                d = 100;
            }
            if (!t) {
                t = false;
            }
            this._waitFor = true;
            this.waitFor(f, function () {
                __fs_dncs_instance.loadEvent();
            }, d, t);
        }
    },

    setLoadModel: function (s) {
        if (s == 'onDomLoaded') {
            this._loadModel = 'ondom';
        }
    },

    addLoadEvent: function (func) {
        if (this._loadModel == 'onload') {
            if (window.addEventListener) {
                // W3C DOM
                window.addEventListener('load', func, false);
            } else if (window.attachEvent) {
                // IE DOM
                window.attachEvent('onload', func);
            }
        } else if (this._loadModel == 'ondom') {
            if (document.addEventListener) {
                // W3C DOM
                document.addEventListener('DOMContentLoaded', func, false);
            } else if (document.attachEvent) {
                // IE DOM
                document.attachEvent("onreadystatechange", function () {
                    if (document.readyState === "complete") {
                        func();
                    }
                });
            }
        }
    },

    setCookie: function (c_name, value, exminutes) {
        var exdate = new Date((new Date()).getTime() + exminutes * 60000).toUTCString();
        var domain = "";
        if (this._cookieDomain) {
            domain = ";domain=" + this._cookieDomain;
        }
        var c_value = escape(value) + ((exminutes == null) ? "" : "; expires=" + exdate + domain + "; path=/");
        document.cookie = c_name + "=" + c_value;
    },

    getCookie: function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }

        return '';
    },

    iterate_the_DOM: function (func) {
        var elems = document.getElementsByTagName("*"), i = elems.length;
        do {
            func(elems[i]);
        } while (--i);
    },

    getElementsByClassName: function (className) {

        // IE detection from http://tanalin.com/en/articles/ie-version-js/
        var ieEightOrLower = (document.all && !document.addEventListener);

        if (document.getElementsByClassName && !ieEightOrLower) {
            return document.getElementsByClassName(className);
        }

        var results = [];
        this.iterate_the_DOM(function (elem) {
            if (elem && elem.className.indexOf(className) != -1) {
                results.push(elem);
            }
        });
        return results;
    },

    cleanNumber: function (string) {
        string = string.trim();
        string = String(unescape(string)).replace(/(<([^>]+)>)/ig, "").replace(/\(0\)/gi, "").replace(/tel:/, "").replace(/telprompt:/, "").replace(/[\n\r]+/g, '');
        var prefix = string.replace(/(^\+?).*/, "$1");
        return prefix + string.replace(/[^0-9]/gi, "");
    },

    cleanNumbersSeparated: function (string, separator) {
        var separated = string.split(separator);
        var size = separated.length;
        var clean = [];
        for (var i = 0; i < size; i++) {
            clean[i] = this.cleanNumber(separated[i]);
        }
        var unseparated = clean.join(separator);
        return unseparated;
    },

    replaceNumberInText: function (node, start, end) {
        var number = this._numbers[this.cleanNumber(node.nodeValue.substring(start, end))];
        if (number && number.replace_with) {
            var replaceWith = number.replace_with;
            var formattedNumber = this._formattingFunction(replaceWith.local, replaceWith.e164);
            if (formattedNumber === null) {
                return;
            }
            var oldNumber = this.cleanNumber(node.nodeValue.substring(start, end));

            var newNumber = unescape(formattedNumber);

            // Handle href="tel:1235" correctly with numberDetection
            if (node.nodeType === 2 && node.nodeValue.indexOf("tel:") !== -1) {
                node.nodeValue = node.nodeValue.substring(0, start) + replaceWith.e164 + node.nodeValue.substring(end);
            } else {
                node.nodeValue = node.nodeValue.substring(0, start) + newNumber + node.nodeValue.substring(end);
            }

            // If parentNode exists of the text node, take that, otherwise take the text node itself as in the case of href attributes for example
            this.notifyNumberReplacedListeners(node.parentNode ? node.parentNode : node, oldNumber, newNumber);
        }
    },

    onClickToReveal: function (event) {
        var self = __fs_dncs_instance;
        if (event.target.getAttribute('data-fs-replaced') === null) {
            event.preventDefault();
            event.stopPropagation();
            var customerParameters = event.target.getAttribute('data-fs-parameters');

            self.getNumber(
                function (elem, result) {
                    var settings = self.getParameter('fsButton', self._defaultFsButtonOptions);
                    var visiblePhoneNumber = (result !== null ? (settings.useLocalPhoneNumber === true ? result.local : result.e164) : self._numbers[elem.getAttribute('data-fs-nr')].originalNumber);
                    var hrefNumber = (result !== null ? (result.e164) : self._numbers[elem.getAttribute('data-fs-nr')].cleanNumber);
                    var templateIndex = (elem.getAttribute('data-fs-index')) ? elem.getAttribute('data-fs-index') : 0;
                    elem.innerHTML = elem.innerHTML.replace(settings.pre, settings.post[templateIndex].replace('{{phone}}', visiblePhoneNumber));
                    elem.setAttribute('href', 'tel:' + hrefNumber);
                    elem.setAttribute('data-fs-replaced', true);

                    if (result === null && elem.getAttribute('data-fs-original-href') !== null) {
                        elem.setAttribute('href', 'tel:' + elem.getAttribute('data-fs-original-href'));
                    }
                },
                event.target,
                event.target.getAttribute('data-fs-nr'),
                self._stradvid,
                null,
                customerParameters ? customerParameters : null,
                null
            );
        }
    },

    addNumberInText: function (node, start, end) {
        var originalNumber = node.nodeValue.substring(start, end);
        var cleanNumber = this.cleanNumber(originalNumber);
        // Assume cleaned numbers are at least 5 digits long
        if (cleanNumber.length >= this._minNumberLength) {
            if (this._numbers[cleanNumber] === undefined) {
                this._numbers[cleanNumber] = {
                    'cleanNumber': cleanNumber,
                    'originalNumber': originalNumber,
                    'nodes': [node]
                };
            } else if (this._numbers[cleanNumber].hasOwnProperty('nodes')) {
                this._numbers[cleanNumber].nodes.push(node);
            }
        }
    },

    addFsLinkToDOM: function (numbersToReplace) {

        var fsButtonConf = this.getParameter('fsButton', this._defaultFsButtonOptions);

        for (var j = 0; j < numbersToReplace.length; j++) {
            var num = this._numbers[numbersToReplace[j].number];

            for (var i = 0; i < num.nodes.length; i++) {
                if (num.nodes[i].nodeName === 'href') {
                    num.nodes[i].ownerElement.setAttribute('data-fs-original-href', num.originalNumber);
                    num.nodes[i].nodeValue = '#fs-replaced-onreveal';
                } else {
                    if (!num.nodes[i].parentElement) {
                        continue;
                    }
                    var refElement;
                    if (num.nodes[i].parentElement.tagName === 'A') {
                        refElement = num.nodes[i].parentElement;
                        num.nodes[i].nodeValue = num.nodes[i].nodeValue.replace(num.originalNumber, fsButtonConf.pre);
                    } else {
                        var anchorId = 'fs-button-' + new Date().getTime() + '' + Math.floor(Math.random() * 1000);
                        var anchor = document.createElement('a');
                        anchor.setAttribute('id', anchorId);
                        anchor.setAttribute('href', '#fs-replaced-onreveal');
                        anchor.setAttribute('data-fs-original-href', num.originalNumber);
                        anchor.innerHTML = fsButtonConf.pre;
                        for (var l = fsButtonConf.post.length - 1; l >= 0; l--) {
                            var replacement = fsButtonConf.post[l].replace('{{phone}}', num.originalNumber);
                            if (num.nodes[i].parentElement.innerHTML.indexOf(replacement) !== -1) {
                                anchor.setAttribute('data-fs-index', l);
                                num.nodes[i].parentElement.innerHTML = num.nodes[i].parentElement.innerHTML.replace(replacement, anchor.outerHTML);
                                refElement = document.getElementById(anchorId);
                                break;
                            }
                        }
                    }
                    if (refElement) {
                        refElement.addFSEventListener('click', this.onClickToReveal);
                        refElement.setAttribute('data-fs-nr', num.cleanNumber);
                        if (numbersToReplace[j].custnr && numbersToReplace[j].custname) {
                            refElement.setAttribute('data-fs-parameters', '&custnr=' + numbersToReplace[j].custnr + '&custname=' + encodeURIComponent(numbersToReplace[j].custname));
                        }
                    }
                }
            }
        }
    },

    addOrReplaceNumbersInText: function (node, replaceFlag) {
        var inNumber = false;
        var numberStartAt = 0;
        var numberEndAt = 0;
        if (node.nodeValue && node.nodeValue.length < 50000 && /\d.*\d.*\d.*\d.*\d/.test(node.nodeValue)) {
            // At least five digits
            var nodeValue = node.nodeValue.split('');
            for (var i = 0; i < node.nodeValue.length; i++) {
                var c = nodeValue[i];
                if (inNumber) {
                    if (c >= '0' && c <= '9') {
                        numberEndAt = i + 1;
                    } else if (c == '-' || c == ' ' || c == 'Â ' /* &nbsp; */ || c == '\t' || c == '\r' || c == '\n' || c == '.' || c == '(' || c == ')' || c == '\x0b' || c == '/') {
                        if (c == '(' || c == '/') {
                            if (replaceFlag == false) {
                                // Just search for numbers
                                this.addNumberInText(node, numberStartAt, numberEndAt);
                            } else {
                                this.replaceNumberInText(node, numberStartAt, numberEndAt);
                            }
                        } else {
                            // ok, maybe in a number still, just continue
                        }
                    } else {
                        if (replaceFlag == false) {
                            // Just search for numbers
                            this.addNumberInText(node, numberStartAt, numberEndAt);
                        } else {
                            // Replace number
                            this.replaceNumberInText(node, numberStartAt, numberEndAt);
                        }
                        numberStartAt = 0;
                        numberEndAt = 0;
                        inNumber = false;
                    }
                }

                if (!inNumber && (c == '+' || (c >= '0' && c <= '9'))) {
                    // Start of number
                    inNumber = true;
                    numberStartAt = i;
                }
            }
            if (inNumber) {
                if (replaceFlag == false) {
                    // Just search for numbers
                    this.addNumberInText(node, numberStartAt, numberEndAt);
                } else {
                    // Replace numbers..
                    this.replaceNumberInText(node, numberStartAt, numberEndAt);
                }
                numberStartAt = 0;
                numberEndAt = 0;
                inNumber = false;
            }
        }
    },

    loopTextElementsForNumbers: function (node, replaceFlag) {
        if (node) {
            node = node.firstChild;
            while (node != null) {
                var tagName = node.tagName;
                if (tagName) {
                    tagName = tagName.toLowerCase();
                }
                if (node.nodeType == 3) {
                    // Text node
                    this.addOrReplaceNumbersInText(node, replaceFlag);
                } else if (node.nodeType == 1 && (!tagName || (tagName && tagName != "script" && tagName != "style" && tagName != "noscript"))) {
                    this.loopTextElementsForNumbers(node, replaceFlag);
                    if (tagName && tagName == "a") {
                        var attr = node.getAttributeNode("href");
                        if (attr) {
                            this.addOrReplaceNumbersInText(attr, replaceFlag);
                        }
                    }
                    if (tagName && tagName == "form") {
                        var attr = node.getAttributeNode("action");
                        if (attr) {
                            this.addOrReplaceNumbersInText(attr, replaceFlag);
                        }
                    }
                }
                node = node.nextSibling;
            }
        }
    },

    // Get all mailto links and add an event to send an event message when clicked
    addEventsToMailToLinks: function () {
        var _fs_i = __fs_dncs_instance;
        var elements = document.getElementsByTagName('a');
        for (var i = 0, len = elements.length; i < len; i++) {
            if (elements[i].getAttribute('href') && elements[i].getAttribute('href').indexOf('mailto:') >= 0) {
                if (elements[i].getAttribute('fs-link') === null) {

                    // Add listeners to links
                    if (elements[i].addEventListener) {
                        elements[i].addEventListener('click', function () {
                            var advId = this.getAttribute('adv-id');
                            // Get email address of link and page URL
                            var href = this.getAttribute('href');
                            // See if there is more than just the email address in the href attribute it should be removed
                            var furtherInfo = href.indexOf('?');
                            if (furtherInfo >= 0) {
                                href = href.substring(0, furtherInfo);
                            }
                            var emailAddress = href.replace('mailto:', '').trim();
                            var pageUrl = window.location.href;
                            _fs_i.sendEvent('email_link_tracking', emailAddress, { 'url': pageUrl }, advId);
                        });
                    } else if (elements[i].attachEvent) {
                        elements[i].attachEvent('onclick', function () {
                            var advId = this.getAttribute('adv-id');
                            // Get email address of link and page URL
                            var href = this.getAttribute('href');
                            // See if there is more than just the email address in the href attribute it should be removed
                            var furtherInfo = href.indexOf('?');
                            if (furtherInfo >= 0) {
                                href = href.substring(0, furtherInfo);
                            }
                            var emailAddress = href.replace('mailto:', '').trim();
                            var pageUrl = window.location.href;
                            _fs_i.sendEvent('email_link_tracking', emailAddress, { 'url': pageUrl }, advId);
                        });
                    }
                    elements[i].setAttribute('fs-link', 'true');


                }

            }
        }
    },

    loadEvent: function () {
        var name, elems, i, len, preFlight = false;

        if (this._loadEventTriggered) {
            return;
        }

        this._loadEventTriggered = true;

        // Numbers to replace?
        for (name in this._classNames) {
            elems = this.getElementsByClassName(this._classNames[name]);
            for (i = 0, len = elems.length; i < len; i += 1) {
                if (elems[i].tagName == "A" && this.cleanNumber(elems[i].innerHTML) == this.cleanNumber(elems[i].href)) {
                    this._spans.push(elems[i]);
                    this._numbers[this.cleanNumber(elems[i].innerHTML)] = {};
                } else if (elems[i].tagName == "A") {
                    this._spans.push(elems[i]);
                    this._numbers[this.cleanNumber(elems[i].href)] = {};
                } else if (elems[i].tagName == "FORM") {
                    this._spans.push(elems[i]);
                    this._numbers[this.cleanNumber(elems[i].action)] = {};
                } else {
                    if (elems[i].children.length == 0 && elems[i].tagName != "A") {
                        this._spans.push(elems[i]);
                        this._numbers[this.cleanNumber(elems[i].innerHTML)] = {};
                    } else if (elems[i].children.length > 0 && elems[i].firstChild.tagName == "A" && this.cleanNumber(elems[i].firstChild.innerHTML) == this.cleanNumber(elems[i].firstChild.href)) {
                        this._spans.push(elems[i].firstChild);
                        this._numbers[this.cleanNumber(elems[i].firstChild.innerHTML)] = {};
                    } else if (elems[i].children.length > 0 && elems[i].firstChild.tagName == "A") {
                        this._spans.push(elems[i].firstChild);
                        this._numbers[this.cleanNumber(elems[i].firstChild.href)] = {};
                    }
                }
            }
        }
        var fsButtonConf = this.getParameter('fsButton', this._defaultFsButtonOptions);
        if (this.getParameter("numberDetection", false) || fsButtonConf.run) {
            this.loopTextElementsForNumbers(document.body, false);
            if (fsButtonConf.run) {
                preFlight = true;
            }
        }

        if (this.getParameter("trackEmailLinks", false)) {
            this.addEventsToMailToLinks();
        }

        for (var key in this._advid) {
            if (this._advid[key].cbw_visible_number) {
                this._advid[key].cbw_visible_number = this.cleanNumber(this._advid[key].cbw_visible_number);
                this._numbers[this._advid[key].cbw_visible_number] = {};
            }
        }

        this.makeBackendRequest(preFlight);
    },

    trackPage: function (opts) {
        opts = opts || {};

        if (this._spa.urlHistory.length > 0) {
            this._spa.referrer = this._spa.urlHistory[this._spa.urlHistory.length - 1];
        }

        this._spa.urlHistory.push(window.location.href);

        if (opts.noRequest) {
            return;
        }

        this._loadEventTriggered = false;
        this.loadEvent();
    },

    checkSameSite: function () {
        if (this._spa.referrer) {
            return 1;
        }

        var refDomain = '', sameSite = 0;
        if (document.referrer) {
            var a = document.createElement('a');
            a.href = document.referrer;
            refDomain = a.hostname;
        }

        // If cookieDomain is set, sameSite should always be 1 when we are crossing subdomains of cookieDomain
        if (this._cookieDomain !== false) {
            if (refDomain.indexOf(this._cookieDomain) !== -1) {
                return 1;
            }
        }

        if (refDomain == window.location.hostname) {
            sameSite = 1;
        }

        return sameSite;
    },

    makeBackendRequest: function (preFlight, overrideNumberToReplace, overrideAdvid, overrideParameters, overrideCallback, overrideShard, overrideSendNotSameSite) {
        var sessionId, url, referrer, numbersToReplace, advid, key, parameters, trackingId, extTrack, coData = '', altNumData, eventTag, dryRun;

        for (var i = 0; i < this._p_s_parameters.length; i++) {
            if (typeof window[this._p_s_parameters[i]] === 'string') {
                coData = coData + '&_p_s' + this._p_s_parameters[i] + '=' + window[this._p_s_parameters[i]];
            }
            if (typeof window[this._p_s_parameters[i]] === 'number') {
                coData = coData + '&_p_s' + this._p_s_parameters[i] + '=' + window[this._p_s_parameters[i]];
            }
            if (typeof window[this._p_s_parameters[i]] === 'object') {
                coData = coData + '&_p_s' + this._p_s_parameters[i] + '=' + window[this._p_s_parameters[i]].join('.');
            }
        }

        if (typeof (ga) != 'undefined' && typeof (ga.getAll) === 'function') {
            var ga_trackers = ga.getAll();
            var dims = {};
            var trackingIds = [];
            var clientIds = [];
            for (var i = 0; i < ga_trackers.length; i++) {
                if (typeof (ga_trackers[i]) === 'object') {
                    var thisClientId = ga_trackers[i].get('clientId');
                    if (typeof (thisClientId) !== 'undefined' && thisClientId !== '') {
                        clientIds.push(thisClientId);
                    }
                    var thisTracker = ga_trackers[i].get('trackingId');
                    if (typeof (thisTracker) !== 'undefined' && thisTracker !== '') {
                        trackingIds.push(thisTracker);
                    }
                    for (var d = 1; d <= 20; d++) {
                        var dimension = ga_trackers[i].get('dimension' + d);
                        if (typeof (dimension) !== 'undefined') {
                            dims[d] = dimension;
                        }
                    }
                }
            }
            coData = coData + '&_p_ga_wpi=' + trackingIds.join(',');
            coData = coData + '&_p_sf_gacids=' + clientIds.join(',');
            coData = coData + '&_p_ga_dims=' + this.stringify(dims);

        } else if (typeof (_gat) != 'undefined' && typeof (_gat.bb) === 'string') {
            coData = coData + '&_p_ga_wpi=' + _gat.bb;
        }

        if (typeof (SZCD) !== 'undefined' && typeof (SZCD.UID) !== 'undefined') {
            coData = coData + '&_p_sm__uid=' + SZCD.UID;
            if (typeof (SZCD.CID) !== 'undefined') {
                coData = coData + '&_p_sm__cid=' + SZCD.CID;
            }
            if (typeof (SZCD.VTID) !== 'undefined') {
                coData = coData + '&_p_sm__vtid=' + SZCD.VTID;
            }
        }

        if (typeof Adform !== 'undefined' && typeof Adform._uid !== 'undefined' && Adform._uid !== '') {
            coData = coData + '&_p_adform_cookie_id=' + Adform._uid;
        }

        for (var i = 0; i < this._defaultCookies.length; i++) {
            if (this.getCookie(this._defaultCookies[i])) {
                coData = coData + '&' + this._defaultCookies[i] + '=' + encodeURIComponent(this.getCookie(this._defaultCookies[i]));
            }
        }

        if (typeof (s) === 'object' && s !== null && typeof (s.c_r) === 'function') {
            coData = coData + '&_p_asc_s_vi' + '=' + s.c_r('s_vi').substring(7, 40);
            if (typeof (s.visitor) === 'object' && typeof (s.visitor.getMarketingCloudVisitorID) === 'function') {
                coData = coData + '&_p_asc_mid' + '=' + s.visitor.getMarketingCloudVisitorID();
            }
            if (typeof (s.fid) === 'string') {
                coData = coData + '&_p_asc_fid' + '=' + s.fid;
            }
            if (typeof (s.un) === 'string') {
                coData = coData + '&_p_asc_un' + '=' + s.un;
            }
            if (typeof (s_account) === 'string') {
                coData = coData + '&_p_asc_rsid' + '=' + s_account;
            } else if (typeof (s.account) === 'string') {
                coData = coData + '&_p_asc_rsid' + '=' + s.account;
            }
            if (typeof (s.version) === 'string') {
                coData = coData + '&_p_asc_version' + '=' + s.version;
            }
            if (typeof (s.visitorNamespace) === 'string') {
                coData = coData + '&_p_asc_visitorNamespace' + '=' + s.visitorNamespace;
            }
            if (typeof (s.trackingServer) === 'string') {
                coData = coData + '&_p_asc_trackingServer' + '=' + s.trackingServer;
            }
            if (typeof (s.channel) === 'string') {
                coData = coData + '&_p_asc_channel' + '=' + s.channel;
            }
            if (typeof (s.campaign) === 'string') {
                coData = coData + '&_p_asc_campaign' + '=' + s.campaign;
            }
            if (typeof (s.eVar3) === 'string') {
                coData = coData + '&_p_asc_eVar3' + '=' + s.eVar3;
            }
        }

        if (typeof (return_ia_js_uid) != 'undefined' && typeof (return_ia_js_uid) === 'function') {
            coData = coData + '&_p_ia_uid' + '=' + return_ia_js_uid();
        }

        if (typeof (heap) != 'undefined' && typeof (heap.appid) != 'undefined' && typeof (heap.userid) != 'undefined') {
            coData = coData + '&_p_heap_aid' + '=' + heap.appid;
            coData = coData + '&_p_heap_uid' + '=' + heap.userid;
        }

        if (typeof (_vwo_acc_id) != 'undefined') {
            var _vis_data = '', _vis_combination, _vis_id, _vis_l = 0;
            for (; _vis_l < _vwo_exp_ids.length; _vis_l++) {
                _vis_id = _vwo_exp_ids[_vis_l];
                if (_vwo_exp[_vis_id].ready) {
                    _vis_combination = this.getCookie('_vis_opt_exp_' + _vis_id + '_combi');
                    if (typeof (_vwo_exp[_vis_id].combination_chosen) != "undefined") {
                        _vis_combination = _vwo_exp[_vis_id].combination_chosen;
                    }
                    if (typeof (_vwo_exp[_vis_id].comb_n[_vis_combination]) != "undefined") {
                        _vis_data = _vis_data + _vis_id + ',' + _vis_combination + ';';
                    }
                }
            }
            if (_vis_data) {
                coData = coData + '&_p_vwo_acc_id' + '=' + _vwo_acc_id;
                coData = coData + '&_p_vwo_t_v' + '=' + _vis_data;
                coData = coData + '&_p_vwo_uuid' + '=' + this.getCookie('_vwo_uuid');
            }
        }

        if (typeof (optimizely) === 'object') {
            var optimizelyEndUserId;
            var optimizelyBuckets;
            var optimizelySegments;
            if (typeof (optimizely.getProjectId) === 'function') {
                coData = coData + '&_p_opt_proj_id' + '=' + optimizely.getProjectId();
            } else { // Adds support for Optimizely X
                if (typeof (optimizely.get) === 'function' && typeof (optimizely.get("data")) === 'object' && typeof (optimizely.get("data").projectId) === 'string') {
                    coData = coData + '&_p_opt_proj_id' + '=' + optimizely.get('data').projectId;
                }
            }
            optimizelyEndUserId = this.getCookie('optimizelyEndUserId');
            if (typeof (optimizelyEndUserId) === 'string' && optimizelyEndUserId.length > 0) {
                coData = coData + '&_p_opt_user_id' + '=' + optimizelyEndUserId;
            }
            optimizelyBuckets = this.getCookie('optimizelyBuckets');
            if (typeof (optimizelyBuckets) === 'string' && optimizelyBuckets.length > 0) {
                coData = coData + '&_p_opt_bucks' + '=' + decodeURIComponent(optimizelyBuckets);
            }
            optimizelySegments = this.getCookie('optimizelySegments');
            if (typeof (optimizelySegments) === 'string' && optimizelySegments.length > 0) {
                coData = coData + '&_p_opt_segs' + '=' + decodeURIComponent(optimizelySegments);
            }
        }


        if (typeof (ABTasty) === 'object') {
            if ((typeof (ABTasty.accountSettings) === 'object') && (typeof (ABTasty.accountSettings.identifier) === 'string')) {
                coData += '&_p_abt_chid' + '=' + ABTasty.accountSettings.identifier;
                var abTastySessionCount = 1;
                var abTastyCookieParameter = '';
                var abTastyTests = [];
                var abTastyVariations = [];
                //fetch session count from Cookie.
                var abTastyCookie = this.getCookie('ABTasty');
                if ((typeof (abTastyCookie) === 'string') && abTastyCookie.length > 0) {
                    var abTastyCookieValues = JSON.parse('{"' + decodeURI(abTastyCookie).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}');
                    if ((typeof (abTastyCookieValues) === 'object') && (typeof (abTastyCookieValues.ns) === 'string') && (abTastyCookieValues.ns.length > 0)) {
                        abTastySessionCount = abTastyCookieValues.ns;
                    }
                }
                if ((typeof (ABTasty.visitor) === 'object') && (typeof (ABTasty.visitor.id) === 'string') && ABTasty.visitor.id.length > 0) {
                    abTastyCookieParameter += ABTasty.visitor.id;
                    if (typeof (ABTasty.getTestsOnPage) === 'function') {
                        var abTastyTestObject = ABTasty.getTestsOnPage();
                        var abTastyTestIDs = Object.keys(abTastyTestObject);
                        for (var abt_key = 0; abt_key < abTastyTestIDs.length; abt_key++) {
                            if ((typeof abTastyTestObject[abTastyTestIDs[abt_key]].variationID) === 'undefined') {
                                continue;
                            }
                            abTastyCookieParameter += '*' + abTastyTestIDs[abt_key] + '.' + abTastyTestObject[abTastyTestIDs[abt_key]].variationID + '.' + abTastySessionCount;
                            abTastyTests.push(abTastyTestIDs[abt_key]);
                            abTastyVariations.push(abTastyTestObject[abTastyTestIDs[abt_key]].variationID);
                        }
                    }
                }
                coData += '&_p_abt_cookie' + '=' + abTastyCookieParameter;
                coData += '&_p_abt_tests' + '=' + abTastyTests.join(',');
                coData += '&_p_abt_variations' + '=' + abTastyVariations.join(',');
            }
        }


        if (typeof _kTck !== 'undefined'
            && typeof _kTck.pClId !== 'undefined'
        ) {
            var madmetricsCookie = this.getCookie('K_' + _kTck.pClId);

            if (madmetricsCookie) {
                coData += '&_p_mad_client_id=' + _kTck.pClId
                    + '&_p_mad_cookie=' + madmetricsCookie;
            }
        }

        if (typeof vscr !== 'undefined'
            && typeof vscr.state !== 'undefined'
            && typeof vscr.state.accountId !== 'undefined'
        ) {
            coData += '&_p_cubed_aid' + '=' + vscr.state.accountId;
        }

        sameSite = this.checkSameSite();

        if ((sameSite == 1 || overrideSendNotSameSite) && this.getCookie('__fs_dncs_prep_u')) {
            url = this.base64_encode(decodeURI(this.getCookie('__fs_dncs_prep_u')));
            referrer = this.getCookie('__fs_dncs_prep_r') ? this.base64_encode(decodeURI(this.getCookie('__fs_dncs_prep_r'))) : '';
        } else {
            url = this.base64_encode(decodeURI(document.location.href));

            if (this._spa.referrer) {
                referrer = this.base64_encode(decodeURI(this._spa.referrer));
            } else {
                referrer = document.referrer ? this.base64_encode(decodeURI(document.referrer)) : '';
            }
        }

        numbersToReplace = [];
        advid = [];
        if (!overrideAdvid) {
            for (var key in this._advid) {
                var requestedNdc = '';
                if (this._advid[key].requested_ndc) {
                    requestedNdc = this._advid[key].requested_ndc;
                }

                advid.push(key + ';' + requestedNdc);
            }
        } else {
            advid = [overrideAdvid];

            // If the overrideAdvid contains a requested_ndc, remove it now as it will break checking for an existing session below
            if (overrideAdvid.indexOf(';') >= 0) {
                overrideAdvid = overrideAdvid.slice(0, overrideAdvid.indexOf(';'));
            }
        }

        if (this._shard !== false) {
            overrideShard = this._shard;
        }

        if (this._altAnsNums != '') {
            altNumData = this.base64_encode(this.stringify(this._altAnsNums));
        }

        advid = this.base64_encode(advid.join(','));

        if (!overrideNumberToReplace) {
            for (key in this._numbers) {
                if (!this._numbers.hasOwnProperty(key)) {
                    continue;
                }
                if (key.length > 20) {
                    // skip too long numbers
                    continue;
                }
                if (this._numberConfigurations[key] && this._numberConfigurations[key].connect_to) {
                    if (this._numberConfigurations[key].connect_to.indexOf(";") === -1) {
                        var cleanConnectToNumber = this.cleanNumber(this._numberConfigurations[key].connect_to);
                    } else {
                        var cleanConnectToNumber = this.cleanNumbersSeparated(this._numberConfigurations[key].connect_to, ";");
                    }
                    numbersToReplace.push(cleanConnectToNumber);
                    this._alternativeNumbers[cleanConnectToNumber] = this._alternativeNumbers[cleanConnectToNumber] || [];
                    this._alternativeNumbers[cleanConnectToNumber].push(key);
                } else {
                    numbersToReplace.push(key);
                }
            }
        } else {
            if (this._numberConfigurations[overrideNumberToReplace] && this._numberConfigurations[overrideNumberToReplace].connect_to) {
                var cleanConnectToNumber = this.cleanNumber(this._numberConfigurations[overrideNumberToReplace].connect_to);
                numbersToReplace.push(cleanConnectToNumber);
                this._alternativeNumbers[cleanConnectToNumber] = this._alternativeNumbers[cleanConnectToNumber] || [];
                this._alternativeNumbers[cleanConnectToNumber].push(overrideNumberToReplace);
            } else {
                numbersToReplace.push(overrideNumberToReplace);
            }
        }

        numbersToReplace = this.base64_encode(numbersToReplace.join(','));

        parameters = this.base64_encode((overrideParameters ? overrideParameters : this._parameterString) + coData);

        var callback = '__fs_dncs_instance.backendCallback';
        if (overrideCallback) {
            callback = overrideCallback;
        }

        if (!overrideAdvid) {
            sessionId = this.getSessionId();
            trackingId = this.getTrackingId();
        } else {
            sessionId = this.getSessionId(overrideAdvid);
            trackingId = this.getTrackingId(overrideAdvid);
        }

        if (this._crossDomainRequest === true) {
            sameSite = 1;
        }

        if (this._dryRun === true) {
            dryRun = 1;
        }

        extTrack = this.getCookie('__fs_dncs_exttrack') ? this.getCookie('__fs_dncs_exttrack') : '0';

        eventTag = this._getNumberEventTag ? this.base64_encode(this._getNumberEventTag) : '';

        var callbackParameters = 'advid:' + advid +
            '/sessionId:' + sessionId +
            '/url:' + url +
            '/referrer:' + referrer +
            '/numbersToReplace:' + numbersToReplace +
            '/parameters:' + parameters +
            '/sameSite:' + (overrideSendNotSameSite ? 0 : sameSite) +
            '/trackingId:' + trackingId +
            '/extTrack:' + extTrack +
            (preFlight ? ('/preFlight:1') : '') +
            ((!isNaN(overrideShard) && overrideShard != null) ? ('/shard:' + overrideShard) : '') +
            (altNumData ? ('/altNum:' + altNumData) : "") +
            (eventTag ? ('/eventTag:' + eventTag) : '') +
            (dryRun ? ('/dryRun:' + dryRun) : '');
        var endpointUrl = this.getParameter('freespeeHost', '//analytics.freespee.com') + '/index.php?url=/external/dncs';
        this.jsonp(endpointUrl, callback, callbackParameters);
    },

    checkAndUpdatePendingBackendRequest: function (backendRequestId, callback) {
        var curTimestamp = new Date().getTime();
        for (var callbackInfoKey in this.numberCallbackInfo) {
            if (!this.numberCallbackInfo.hasOwnProperty(callbackInfoKey)) {
                continue;
            }
            var callbackInfo = this.numberCallbackInfo[callbackInfoKey];
            if (!callbackInfo)
                continue;
            // If recent pending request, add callback to pending request
            if (callbackInfo['backendRequestId'] == backendRequestId && curTimestamp < callbackInfo['timestamp'] + 600) {
                callbackInfo['callbacks'].push(callback);
                callbackInfo['timestamp'] = curTimestamp;
                return true;
            }
        }
        return false;
    },

    numberCallbackInfo: {},
    getNumber: function (callback, reference, phonenr, advid, shard, parameterString, eventTag) {
        var curTimestamp = new Date().getTime();
        if (typeof (eventTag) === 'undefined') {
            this._getNumberEventTag = 'getNumber';
        } else {
            this._getNumberEventTag = eventTag;
        }

        var temp = '__fs_' + Math.floor((Math.random() * 10000000));
        window[temp] = function (temp) {
            return function (data) {
                __fs_dncs_instance.backendCallback(data, temp);
            };
        }(temp);

        var origInputNumber = phonenr;
        phonenr = this.cleanNumber(phonenr);

        var backendRequestId = phonenr + advid + parameterString + shard + this._getNumberEventTag;

        if (this.checkAndUpdatePendingBackendRequest(backendRequestId, callback)) {
            return;
        }

        this.makeBackendRequest(false, phonenr, advid, parameterString, temp, shard, 0);
        this.numberCallbackInfo[temp] = { 'callbacks': [callback], 'reference': reference, 'backendRequestId': backendRequestId, 'timestamp': curTimestamp, 'createdFrom': 'getNumber', 'originalNumber': origInputNumber };
    },

    requestCallback: function (advid, answeringnr, cc, phonenr, e164callerid, customdata, time, callback, callbackref, retries) {
        var curTimestamp = new Date().getTime();
        var sessionId;
        var temp = '__fs_' + Math.floor((Math.random() * 10000000));
        window[temp] = function (temp) {
            return function (data) {
                __fs_dncs_instance.cbwFormInternalCallback(data, temp);
            };
        }(temp);

        advid = advid || this._stradvid;

        if (this.getCookie('__fs_dncs_sessionid_' + advid)) {
            sessionId = this.getCookie('__fs_dncs_sessionid_' + advid);
        } else if (this.getCookie('__fs_dncs_sessionid')) {
            sessionId = this.getCookie('__fs_dncs_sessionid');
        } else {
            callback(callbackref, { 'status': 'fail', 'errors': ['No session initiated.'] });
            return;
        }

        var backendRequestId = sessionId + phonenr + cc + answeringnr + (time ? ('&time=' + time) : '') + e164callerid + this.base64_encode(this.stringify(customdata)) + retries;
        if (this.checkAndUpdatePendingBackendRequest(backendRequestId, callback)) {
            return;
        }

        var requestUrl = this.getParameter('freespeeHost', '//analytics.freespee.com') +
            '/cbw/call?jsonp=' + temp + '&session_id=' + sessionId + '&phonenr=' + encodeURIComponent(this.cleanNumber(phonenr)) +
            '&cc_phonenr=' + encodeURIComponent(cc) + '&answeringnr=' + encodeURIComponent(answeringnr) +
            (time ? ('&time=' + time) : '') +
            '&caller_id=' + encodeURIComponent(this.cleanNumber(e164callerid)) + '&custom=' + this.base64_encode(this.stringify(customdata)) +
            '&retries=' + encodeURIComponent(retries);

        this.jsonp(requestUrl, null);
        this.numberCallbackInfo[temp] = { 'callbacks': [callback], 'reference': callbackref, 'backendRequestId': backendRequestId, 'timestamp': curTimestamp, 'createdFrom': 'requestCallback' };
    },

    cbwFormInternalCallback: function (data, overrideCallbackId) {
        if (overrideCallbackId && this.numberCallbackInfo[overrideCallbackId]) {
            var callbacks = this.numberCallbackInfo[overrideCallbackId]['callbacks'];
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](this.numberCallbackInfo[overrideCallbackId]['reference'], data);
            }
            this.numberCallbackInfo[overrideCallbackId] = null;
        }
    },

    loadAdv: function (advid) {
        this._loadEventTriggered = false;
        this._advid = {};
        this.setAdv(advid);
        this.loadEvent();
    },

    backendCallback: function (data, overrideCallbackId) {

        var advidlen = 0;
        for (var key in this._advid) {
            if (this._advid.hasOwnProperty(key)) {
                advidlen++;
            }
        }

        if (data.status == 'success' && data.clear_cookie == false) {
            if (advidlen <= 1) {
                this.setCookie('__fs_dncs_sessionid_' + data.advid, data.session_id, 43200);
            } else {
                // If setAdv is called multiple times, one session must prevail
                this.setCookie('__fs_dncs_sessionid', data.session_id, 43200);
            }
        } else if (data.status == 'success' && data.clear_cookie == true) {
            if (advidlen <= 1) {
                this.setCookie('__fs_dncs_sessionid_' + data.advid, '', -1);
            } else {
                this.setCookie('__fs_dncs_sessionid', '', -1);
            }
        }

        if (data.status == 'success') {
            if (advidlen <= 1) {
                this.setCookie('__fs_dncs_trackingid_' + data.advid, data.tracking_id, 525600);
            } else {
                this.setCookie('__fs_dncs_trackingid', data.tracking_id, 525600);
            }
            this.setCookie('__fs_dncs_exttrack', data.ext_track, 525600);

            if (overrideCallbackId && this.numberCallbackInfo[overrideCallbackId]) {
                if (this.numberCallbackInfo[overrideCallbackId].createdFrom === 'getNumber') {
                    var getNumberCallback = this.numberCallbackInfo[overrideCallbackId].callbacks[0];
                    var reference = this.numberCallbackInfo[overrideCallbackId].reference;
                    var originalNumber = this.numberCallbackInfo[overrideCallbackId].originalNumber;
                    var callbackData;
                    if (data.numbers.length === 1) {
                        callbackData = data.numbers[0].replace_with;
                    } else {
                        // Fallback and return input number
                        if (this.getParameter('returnInputNumber', true)) {
                            callbackData = { 'e164': originalNumber, 'local': originalNumber, 'meas_id': null };
                        } else {
                            callbackData = null;
                        }
                    }
                    getNumberCallback(reference, callbackData);
                } else {
                    for (var y = 0, ylen = data.numbers.length; y < ylen; y++) {
                        var callbacks = this.numberCallbackInfo[overrideCallbackId]['callbacks'];
                        for (var i = 0; i < callbacks.length; i++) {
                            callbacks[i](this.numberCallbackInfo[overrideCallbackId]['reference'], data.numbers[y].replace_with);
                        }
                    }
                }
                this.numberCallbackInfo[overrideCallbackId] = null;
                return;
            }

            if (typeof data.numbers_to_replace !== 'undefined') {
                this.addFsLinkToDOM(data.numbers_to_replace);
                return;
            }


            if (typeof (this._allAdvid[data.advid].formatting_function) == 'function') {
                this._formattingFunction = this._allAdvid[data.advid].formatting_function;
            }

            for (var y = 0, ylen = data.numbers.length; y < ylen; y++) {
                if (this._alternativeNumbers.hasOwnProperty(data.numbers[y].number_on_page)) {
                    for (var j = 0; j < this._alternativeNumbers[data.numbers[y].number_on_page].length; j++) {
                        this._numbers[this._alternativeNumbers[data.numbers[y].number_on_page][j]].replace_with = data.numbers[y].replace_with;
                    }
                } else {
                    this._numbers[data.numbers[y].number_on_page].replace_with = data.numbers[y].replace_with;
                }
            }

            for (var i = 0, ilen = this._spans.length; i < ilen; i++) {
                //Strip down number string from the DOM
                var spanNumber = this.cleanNumber(this._spans[i].innerHTML);
                if (spanNumber == '' && this._spans[i].action) {
                    spanNumber = this.cleanNumber(this._spans[i].action);
                }
                if (spanNumber == '') {
                    spanNumber = this.cleanNumber(this._spans[i].href);
                }
                if (this._numbers[spanNumber] && this._numbers[spanNumber].replace_with) {
                    this.replaceNumber(this._spans[i], this._numbers[spanNumber].replace_with);
                }
            }
            /**
             * [if dynamic callback is set in the config step for the customer run their callback
             * function when the script is done getting numbers]
             * @param  function (data)
             */
            if (typeof this.getParameter('dynamicCallback') === 'function') {
                this.getParameter('dynamicCallback')(data);
            }

            if (this.getParameter("numberDetection", false)) {
                var that = this;

                // Push action last in execution queue in order to avoid rendering errors in IE
                setTimeout(function () {
                    that.loopTextElementsForNumbers(document.body, true);
                }, 1);
            }

            // Android browser redraw fix
            if (this._spans.length > 0 && !this.getParameter('preventWebkitWorkaround', false)) {
                this._spans[0].style.cssText += ';-webkit-transform:rotateZ(0deg)';
                this._spans[0].offsetHeight;
                this._spans[0].style.cssText += ';-webkit-transform:none';
            }

            for (var key in this._advid) {
                // CBW does not use allAdvid yet.. Thus, loadAdv() is not allowed for CBW customers
                if (this._advid[key].cbw_visible_number && this._numbers[this._advid[key].cbw_visible_number] && this._numbers[this._advid[key].cbw_visible_number].replace_with) {
                    this._advid[key].cbw_visible_number = this._numbers[this._advid[key].cbw_visible_number].replace_with.local;
                } else {
                    delete this._advid[key].cbw_visible_number;
                }
            }

            if (data.cbw_enabled && this._allAdvid[data.advid].cbw_answering_number_id) {
                this.setupCbw(data.session_id, this._advid[data.advid]);
            }
        } else {
            //call the callback function for getNumber with original number so subcribers does not need to handle faulty event when DNCS fails
            if (overrideCallbackId && this.numberCallbackInfo[overrideCallbackId] && this.numberCallbackInfo[overrideCallbackId].createdFrom === 'getNumber') {
                var getNumberCallback = this.numberCallbackInfo[overrideCallbackId].callbacks[0];
                var reference = this.numberCallbackInfo[overrideCallbackId].reference;
                var originalNumber = this.numberCallbackInfo[overrideCallbackId].originalNumber;
                var callbackData;
                if (this.getParameter('returnInputNumber', true)) {
                    callbackData = { 'e164': originalNumber, 'local': originalNumber, 'meas_id': null };
                } else {
                    callbackData = null;
                }
                getNumberCallback(reference, callbackData);
                this.numberCallbackInfo[overrideCallbackId] = null;
            }
        }
    },

    jsonp: function (url, strCallback, query) {

        if (strCallback && query) {
            url += "/callback:";
            url += strCallback + "/";

            if (query) {
                url += query + "/";
            }
        }

        var script = document.createElement("script");
        script.setAttribute("src", url);
        script.setAttribute("type", "text/javascript");

        var head = document.getElementsByTagName('head');
        if (head.length > 0) {
            head[0].appendChild(script);
        }
    },

    openCbw: function () {
        var overlay, overlaybg, top;

        overlay = document.getElementById('fs-callback-widget-overlay');

        if (this.getParameter('cbw_style', 'desktop') === 'desktop') {
            overlaybg = document.getElementById('fs-callback-widget-bg');

            if (overlay && overlaybg) {
                overlay.style.display = 'block';
                overlaybg.style.display = 'block';
            }

        } else {
            top = document.getElementById('fs-callback-widget-top');

            if (overlay && top) {
                this.oldPageMargin = document.body.style.margin;
                this.oldPagePadding = document.body.style.padding;
                document.body.style.margin = "0px";
                document.body.style.padding = "0px";

                overlay.style.display = 'block';
                top.style.display = 'block';
                window.scrollTo(0, 0);
            }
        }
    },

    closeCbw: function () {
        var overlay, overlaybg, top;

        overlay = document.getElementById('fs-callback-widget-overlay');

        if (this.getParameter('cbw_style', 'desktop') === 'desktop') {
            overlaybg = document.getElementById('fs-callback-widget-bg');

            if (overlay && overlaybg) {
                overlay.style.display = 'none';
                overlaybg.style.display = 'none';
            }
        } else {
            top = document.getElementById('fs-callback-widget-top');

            if (overlay && top) {
                document.body.style.margin = this.oldPageMargin;
                document.body.style.padding = this.oldPagePadding;
                overlay.style.display = 'none';
                top.style.display = 'none';
            }
        }
    },

    setupCbw: function (session_id, advSettings) {
        var iFrameSrc, iframe, d, style, html, open, close, overlay, overlaybg, top, back, bgImg;

        iFrameSrc = this.getParameter('freespeeHost', '//analytics.freespee.com') + '/cbw/frame';
        iFrameSrc += '/sid:' + session_id;
        iFrameSrc += '/answeringnr:' + encodeURIComponent(encodeURIComponent(advSettings.cbw_answering_number_id));

        if (advSettings.cbw_caller_id) {
            iFrameSrc += '/caller_id:' + encodeURIComponent(encodeURIComponent(advSettings.cbw_caller_id));
        }

        if (advSettings.cbw_visible_number) {
            iFrameSrc += '/visible_number:' + encodeURIComponent(encodeURIComponent(advSettings.cbw_visible_number));
        }

        d = new Date();

        iFrameSrc += '/tz_offset:' + d.getTimezoneOffset();
        iFrameSrc += '/language:' + this.getParameter('language', 'en_US');

        if (advSettings.cbw_style === 'mobile') {
            iFrameSrc += '/mobile:' + 1;
        }

        style = advSettings.cbw_style || 'desktop';

        if (style === 'desktop') {
            open = document.getElementById(advSettings.cbw_button_id || 'fs-open-callback-widget');

            if (!open) {
                open = document.createElement('div');
                open.setAttribute('id', 'fs-open-callback-widget');
                open.style.cursor = 'pointer';
                open.style.position = 'absolute';
                open.style.right = '0';
                open.style.top = '200px';
                open.style.width = '39px';
                open.style.height = '58px';
                open.style.background = 'url(' + this.getParameter('freespeeHost', '//analytics.freespee.com') + '/images/tab-phone-green.png) no-repeat';
                document.body.appendChild(open);
            }

            overlaybg = document.createElement('div');
            overlaybg.setAttribute('id', 'fs-callback-widget-bg');
            overlaybg.style.display = 'none';
            overlaybg.style.position = 'fixed';
            overlaybg.style.top = '0';
            overlaybg.style.right = '0';
            overlaybg.style.bottom = '0';
            overlaybg.style.left = '0';
            overlaybg.style.background = '#000';
            overlaybg.style.opacity = '.5';
            overlaybg.style.filter = 'alpha(opacity = 50)';

            overlay = document.createElement('div');
            overlay.setAttribute('id', 'fs-callback-widget-overlay');
            overlay.style.display = 'none';
            overlay.style.position = 'fixed';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.margin = '-137px 0 0 -195px';
            overlay.style.backgroundColor = '#fff';
            overlay.style.padding = '2px';
            overlay.style.borderRadius = '4px';
            overlay.style.boxShadow = 'rgb(0, 0, 0) 0px 3px 6px';
            overlay.style.zIndex = 9999;

            iframe = document.createElement('iframe');
            iframe.setAttribute('src', iFrameSrc);
            iframe.setAttribute('width', '415');
            iframe.setAttribute('height', '270');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');

            overlay.appendChild(iframe);

            close = document.createElement('div');
            close.setAttribute('id', 'fs-close-callback-widget');
            close.style.cursor = 'pointer';
            close.style.position = 'absolute';
            close.style.top = '-16px';
            close.style.right = '-16px';
            close.style.width = '32px';
            close.style.height = '31px';
            close.style.background = 'url(' + this.getParameter('freespeeHost', '//analytics.freespee.com') + '/images/close_cbw.png) no-repeat';

            overlay.appendChild(close);

            document.body.appendChild(overlaybg);
            document.body.appendChild(overlay);

            open.onclick = function (evt) {
                overlay.style.display = 'block';
                overlaybg.style.display = 'block';
            };

            overlaybg.onclick = close.onclick = function (evt) {
                overlay.style.display = 'none';
                overlaybg.style.display = 'none';
            };
        } else {

            overlay = document.createElement('div');
            overlay.setAttribute('id', 'fs-callback-widget-overlay');
            overlay.setAttribute('style', 'line-height: 0; display: none; position: absolute; top: 0px; right: 0; left: 0; background: #fff; overflow: auto;');

            iframe = document.createElement('iframe');
            iframe.setAttribute('src', iFrameSrc);
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '100%');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'auto');
            if (window.innerHeight) {
                // Try to use the current device height for the iframe
                iframe.setAttribute('style', 'min-height: ' + window.innerHeight + 'px;');
            } else {
                // Else use 360px as "default" if window.innerHeight is not supported (old browsers)
                iframe.setAttribute('style', 'min-height: 360px;');
            }
            overlay.appendChild(iframe);

            document.body.appendChild(overlay);

            open = document.getElementById(advSettings.cbw_button_id || 'fs-open-callback-widget');

            open.onclick = function (evt) {
                this.oldPageMargin = document.body.style.margin;
                this.oldPagePadding = document.body.style.padding;
                document.body.style.margin = "0px";
                document.body.style.padding = "0px";

                overlay.style.display = 'block';
                window.scrollTo(0, 0);
            };

            // Use the window.postMessage() API to receive a submit from outside this iframe
            eventListener = function (event) {
                if (event.data === "cbw_back_pressed") {
                    document.body.style.margin = this.oldPageMargin;
                    document.body.style.padding = this.oldPagePadding;
                    overlay.style.display = 'none';
                }
            };

            if (window.addEventListener) {
                addEventListener("message", eventListener, false);
            } else {
                attachEvent("onmessage", eventListener);
            }

            // Register for a browser resize event in order to keep iframe size to par
            resizeEventListener = function () {
                if (window.innerHeight) {
                    // Try to use the current device height for the iframe
                    iframe.setAttribute('style', 'min-height: ' + window.innerHeight + 'px;');
                } else {
                    // Else use 360px as "default" if window.innerHeight is not supported (old browsers)
                    iframe.setAttribute('style', 'min-height: 360px;');
                }
            };

            if (window.addEventListener) {
                addEventListener("resize", resizeEventListener, false);
            } else {
                attachEvent("onresize", resizeEventListener);
            }
        }
    },

    httpGet: function (url) {
        if (window.XMLHttpRequest) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        }
    },

    httpPost: function (url, parameters) {
        var json = this.stringify(parameters);
        if (window.XMLHttpRequest) {
            try {
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("POST", url, true);
                xmlHttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                // Handle any errors from API
                xmlHttp.onloadend = function () {
                    if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
                        var response = JSON.parse(xmlHttp.responseText);
                        if (!response.success) {
                            console.error('The API call failed with message: ', response.error);
                        }
                    } else {
                        console.error('Connection to the API failed with http status code: ', xmlHttp.status);
                    }
                };
                xmlHttp.send(json);
            } catch (e) {
                console.error('Setup of POST XHR failed with exeception: ', e);
            }
        }
    },

    setupSnapengage: function () {
        if (typeof (SnapEngage) !== 'undefined') {
            var _fs_i = __fs_dncs_instance;
            var baseUrl = _fs_i.getParameter('freespeeHost', '//analytics.freespee.com') +
                '/collect/chat' + '?cp=se&sId=' + _fs_i.getSessionId();

            SnapEngage.setCallback('Open', function (s) {
                _fs_i.httpGet(baseUrl + '&e=1&a=' + _fs_i.base64_encode(s));
            });
            SnapEngage.setCallback('Close', function (t, s) {
                _fs_i.httpGet(baseUrl + '&e=2&a=' + _fs_i.base64_encode(t) + '&b=' +
                    _fs_i.base64_encode(s));
            });
            SnapEngage.setCallback('StartChat', function (e, m, t) {
                _fs_i.httpGet(baseUrl + '&e=3&a=' + _fs_i.base64_encode(e) + '&b=' +
                    _fs_i.base64_encode(m) + '&c=' + _fs_i.base64_encode(t));
            });
            SnapEngage.setCallback('ChatMessageSent', function (m) {
                _fs_i.httpGet(baseUrl + '&e=4&a=' + _fs_i.base64_encode(m));
            });
            SnapEngage.setCallback('ChatMessageReceived', function (a, m) {
                _fs_i.httpGet(baseUrl + '&e=5&a=' + _fs_i.base64_encode(a) + '&b=' +
                    _fs_i.base64_encode(m));
            });
            SnapEngage.setCallback('OpenProactive', function (a, m) {
                _fs_i.httpGet(baseUrl + '&e=6&a=' + _fs_i.base64_encode(a) + '&b=' +
                    _fs_i.base64_encode(m));
            });
        }
    },

    loadSyncUrl: function (url) {
        if (url) {
            var img = document.createElement('img');
            img.setAttribute('src', url);
            img.setAttribute('style', 'position: absolute; height: 0px; width: 0px;');
            document.head.appendChild(img);
        }
    },

    sendEvent: function (eventType, eventId, eventData, advId) {
        var baseUrl = this.getParameter('freespeeHost', '//analytics.freespee.com') +
            '/collect/fs-event';

        if (advId === null) {
            advId = this._stradvid;
        }

        var sessionIds = [];

        for (var key in this._allAdvid) {
            sessionIds.push(this.getSessionId(key));
        };

        this.httpPost(baseUrl, {
            'event_type': eventType,
            'event_identifier': eventId,
            'event_data': eventData,
            'sessionIds': sessionIds,
            'advId': advId
        });
    }
};

if (__fs_dncs_instance == undefined) {
    __fs_dncs_instance = new __fs_dncs();

    // Custom load
    var enableSeForCustomer = '5a6af1f3-341b-46ae-a097-0e317cdbccd6';
    if (__fs_dncs_instance._stradvid == enableSeForCustomer) {
        if (window.addEventListener) {
            window.addEventListener('load', __fs_dncs_instance.setupSnapengage, false);
        } else if (window.attachEvent) {
            window.attachEvent('onload', __fs_dncs_instance.setupSnapengage);
        }
    }
}