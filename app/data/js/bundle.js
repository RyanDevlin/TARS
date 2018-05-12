(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// -- CLOCK LOGIC -- //
// -- THE FOLLOWING CLOCK CODE IS NOT MINE AND WAS WRITTEN BY Rik Schennink -- //
// -- VIEW THE CODE HERE: https://codepen.io/rikschennink/pen/lyuaf -- //
var Clock = (function(){
             
             var exports = function(element) {
             this._element = element;
             var html = '';
             for (var i=0;i<6;i++) {
             html += '<span>&nbsp;</span>';
             }
             this._element.innerHTML = html;
             this._slots = this._element.getElementsByTagName('span');
             this._tick();
             };
             
             exports.prototype = {
             
             _tick:function() {
             var time = new Date();
             
             // -- Added code to convert to 12 hour format and add ampm/day -- //
             var hours = time.getHours();
             var day = time.getDay();
             var ampm = hours >= 12 ? 'pm' : 'am';
             hours = hours % 12;
             hours = hours ? hours : 12; // the hour '0' should be '12'
             // -- End added code -- //
             
             this._update(this._pad(hours) + this._pad(time.getMinutes()) + this._pad(time.getSeconds()), ampm, day);
             var self = this;
             setTimeout(function(){
                        self._tick();
                        },1000);
             },
             
             _pad:function(value) {
             return ('0' + value).slice(-2);
             },
             
             _update:function(timeString, ampm, day) {
             // -- Added code to update day and ampm next to the clock -- //
             document.getElementById("curr_ampm").innerHTML = ampm.toUpperCase();
             
             
             switch(day) {
             case 0:
             document.getElementById("curr_day").innerHTML = "SUN";
             break;
             case 1:
             document.getElementById("curr_day").innerHTML = "MON";
             break;
             case 2:
             document.getElementById("curr_day").innerHTML = "TUE";
             break;
             case 3:
             document.getElementById("curr_day").innerHTML = "WED";
             break;
             case 4:
             document.getElementById("curr_day").innerHTML = "THU";
             break;
             case 5:
             document.getElementById("curr_day").innerHTML = "FRI";
             break;
             case 6:
             document.getElementById("curr_day").innerHTML = "SAT";
             break;
             default:
             document.getElementById("curr_day").innerHTML = "NULL :(";
             }
             
             
             var i=0,l=this._slots.length,value,slot,now;
             for (;i<l;i++) {
             
             value = timeString.charAt(i);
             slot = this._slots[i];
             now = slot.dataset.now;
             
             if (!now) {
             slot.dataset.now = value;
             slot.dataset.old = value;
             continue;
             }
             
             if (now !== value) {
             this._flip(slot,value);
             }
             }
             },
             
             _flip:function(slot,value) {
             
             // setup new state
             slot.classList.remove('flip');
             slot.dataset.old = slot.dataset.now;
             slot.dataset.now = value;
             
             // force dom reflow
             slot.offsetLeft;
             
             // start flippin
             slot.classList.add('flip');
             
             }
             
             };
             
             return exports;
             }());

module.exports = Clock;
// -- END CLOCK LOGIC -- //

},{}],2:[function(require,module,exports){
const PiStats = require('./py_stats.js');
const Clock = require('./clock.js');
const Diagnostics = require('./diagnostics.js');
const Smoothie = require('smoothie');


// -- HIDE / REVEAL ALL ELEMENTS -- //
document.getElementById("clock_window").onclick = function() {
    console.log("CLICKED");
    var main_border = document.getElementById("window_border");
    var flicker_count = 0;
    var interval_control = setInterval(function() {
                                    main_border.classList.toggle('fade');
                                    flicker_count++;
                                    if(flicker_count === 5) {
                                        console.log("TOGGLE");
                                        clearInterval(interval_control);
                                    }
                                   }, 50);
}

// -- Start the clock module -- //
var i=0,clocks = document.querySelectorAll('.clock'),l=clocks.length;
for (;i<l;i++) {
    new Clock(clocks[i]);
}

// -- Diagnostics Module -- //
/*
PiStats.getCPUInfo(function(err, data){
                   console.log("CPU_GET");
                   console.log("Current CPU Usage: " + data.percentUsed + "%");
                   // -- Added this to feed system data into mirror core.js -- //
                   });*/
console.log(" -- CALLING MEM INFO NOW -- ");
PiStats.printMemoryInfo();

// Update Diagnostic Graphs with real-time cpu and mem data
/*
var diagnostics = Diagnostics();
setInterval(function() {
            var point = 0;
            PiStats.getCPUInfo(function(err, data){
                               //console.log("CPU_GET");
                               //point = data.percentUsed;
                               point = Math.random() * 100;
                               
                               diagnostics.cpu.append(Date.now(), point);
                               document.getElementById("cpu_load_text").innerHTML = "CPU: " + point.toFixed(2) + "%";
                               //console.log("Current CPU Usage: " + data.percentUsed + "%");
                               // -- Added this to feed system data into mirror core.js -- //
                               });
            }, 500);


setInterval(function() {
            var point = 0;
            PiStats.getMemoryInfo(function(err, data){
                                  //console.log("MEM_GET");
                                  //console.log("total\tused\tfree\tcached");
                                  //console.log( data.total + "\t" + data.used + "\t" + data.free + "\t" + data.cached );
                                  //console.log("Memory Usage:\t" + data.percentUsed + "%");
                                  
                                  point = Math.random() * 100;
                                  //point = data.percentUsed;
                                  diagnostics.mem.append(Date.now(), point);
                                  document.getElementById("mem_load_text").innerHTML = "MEM: " + point.toFixed(2) + "%";
                                  //document.getElementById("stat_window").innerHTML = test_data;
                                  });
            }, 500);*/

// -- HIDE / REVEAL DIAGNOSTICS -- //
document.getElementById("stat_window").onclick = function() {
    console.log("STAT_CLICKED");
    var stat_border = document.getElementById("stat_window");
    var flicker_count = 0;
    var interval_control = setInterval(function() {
                                       stat_border.classList.toggle('fade');
                                       flicker_count++;
                                       if(flicker_count === 5) {
                                       console.log("TOGGLE");
                                       clearInterval(interval_control);
                                       }
                                       }, 50);
}

},{"./clock.js":1,"./diagnostics.js":3,"./py_stats.js":4,"smoothie":7}],3:[function(require,module,exports){
const Smoothie = require('smoothie');

var Diagnostics = function() {
    // Create a time series
    var series1 = new Smoothie.TimeSeries();

    // Find the canvas
    var canvas1 = document.getElementById('cpu_canvas');

    // Create the chart
    var chart1 = new Smoothie.SmoothieChart();
    chart1.addTimeSeries(series1, { strokeStyle: 'rgba(243, 74, 133, 1)', fillStyle: 'rgba(243, 74, 133, 0.4)', lineWidth: 2 });
    chart1.streamTo(canvas1, 500);


    // Create a time series
    var series2 = new Smoothie.TimeSeries();

    // Find the canvas
    var canvas2 = document.getElementById('mem_canvas');

    // Create the chart
    var chart2 = new Smoothie.SmoothieChart();
    chart2.addTimeSeries(series2, {strokeStyle: 'rgba(78, 134, 203, 1)', fillStyle: 'rgba(78, 134, 203, 0.4)', lineWidth: 2 });
    chart2.streamTo(canvas2, 500);
    
    return({cpu:series1,
           mem:series2});
}

module.exports = Diagnostics;

},{"smoothie":7}],4:[function(require,module,exports){
(function (__filename,__dirname){
'use strict'

// A very simple nodeJS script that demonstrates how you can access
// memory usage information similar to how free -m works on the
// Raspberry Pi. Goes with µCast #14. http://youtu.be/EqyVlTP4R5M


// Usage: node pi_mem.js
// Example Output
//
// total    used    free    cached
// 469      65      404     31
// Memory Usage:    7%

var fs = require('file-system');
console.log("-- THIS IS FS --");
console.log(fs);
console.log("-- END FS --");
//var fs = require('browserify-fs');

var PiStats = function(){
    
    var memInfo = {};
    var currentCPUInfo = {total:0, active:0};
    var lastCPUInfo = {total:0, active:0};
    
    function getValFromLine(line){
        var match = line.match(/[0-9]+/gi);
        if(match !== null)
            return parseInt(match[0]);
        else
            return null;
    }
    
    var getMemoryInfo = function(cb){
        
        /*
        fs.readFile('/proc/meminfo', 'utf8', function(err, data){
                    console.log("GETTING MEM INFO");
                    if(err){
                    console.log("MEM READ ERROR");
                    console.log(err);
                    cb(err);
                    return;
                    }
                    console.log("MEMORY_INFO: " + data);
                    var lines = data.split('\n');
                    memInfo.total = Math.floor(getValFromLine(lines[0]) / 1024);
                    memInfo.free = Math.floor(getValFromLine(lines[1]) / 1024);
                    memInfo.cached = Math.floor(getValFromLine(lines[3]) / 1024);
                    memInfo.used = memInfo.total - memInfo.free;
                    memInfo.percentUsed = Math.ceil(((memInfo.used - memInfo.cached) / memInfo.total) * 100);
                    
                    cb(null, memInfo);
                    });*/
        console.log(" -- TESTING FS! -- ");
        console.log(__filename);
        console.log(__dirname);
        //fs.readFile('../../../../../proc/meminfo', 'utf-8', function(err, data) {
        fs.readFile('/proc/meminfo', 'utf-8', function(err, data) {
            if(err){
                    console.log("MEM READ ERROR");
                    console.log(err);
                    cb(err);
                    return;
            }
            console.log(data);
        });

    };
    
    var calculateCPUPercentage = function(oldVals, newVals){
        var totalDiff = newVals.total - oldVals.total;
        var activeDiff = newVals.active - oldVals.active;
        return Math.ceil((activeDiff / totalDiff) * 100);
    };
    
    var getCPUInfo = function(cb){
        lastCPUInfo.active = currentCPUInfo.active;
        lastCPUInfo.idle = currentCPUInfo.idle;
        lastCPUInfo.total = currentCPUInfo.total;
        
        fs.readFile('/proc/stat', 'utf8', function(err, data){
                    if(err){
                    if(cb !== undefined)
                    cb(err);
                    return;
                    }
                    var lines = data.split('\n');
                    var cpuTimes = lines[0].match(/[0-9]+/gi);
                    currentCPUInfo.total = 0;
                    // We'll count both idle and iowait as idle time
                    currentCPUInfo.idle = parseInt(cpuTimes[3]) + parseInt(cpuTimes[4]);
                    for (var i = 0; i < cpuTimes.length; i++){
                    currentCPUInfo.total += parseInt(cpuTimes[i]);
                    }
                    currentCPUInfo.active = currentCPUInfo.total - currentCPUInfo.idle
                    currentCPUInfo.percentUsed = calculateCPUPercentage(lastCPUInfo, currentCPUInfo);
                    
                    if(cb !== undefined)
                    cb(null, currentCPUInfo);
                    });
    };
    
    return{
    getMemoryInfo: getMemoryInfo,
    getCPUInfo: getCPUInfo,
    printMemoryInfo: function(){
        getMemoryInfo(function(err, data){
                      console.log("total\tused\tfree\tcached");
                      //console.log( data.total + "\t" + data.used + "\t" + data.free + "\t" + data.cached );
                      //console.log("Memory Usage:\t" + data.percentUsed + "%");
                      // -- Added this to feed system data into mirror core.js -- //
                      //return("TEST");
                      });
    },
    printCPUInfo: function(){
        getCPUInfo(function(err, data){
                   console.log("Current CPU Usage: " + data.percentUsed + "%");
                   // -- Added this to feed system data into mirror core.js -- //
                   //return("TEST2");
                   });
    }
    };
}();
module.exports = PiStats;
//PiStats.printMemoryInfo();
//console.log("")
//setInterval(PiStats.printCPUInfo, 1000);



}).call(this,"/data/js/py_stats.js","/data/js")
},{"file-system":6}],5:[function(require,module,exports){
var util = require('utils-extend');
/**
 * @description
 * @example
 * `**\/*` match all files
 * `*.js`  only match current dir files
 * '**\/*.js' match all js files
 * 'path/*.js' match js files in path
 * '!*.js' exclude js files 
 */
function fileMatch(filter, ignore) {
  if (filter === null) {
    return function() {
      return true;
    };
  } else if (filter === '' || (util.isArray(filter) && !filter.length)) {
    return function() {
      return false;
    };
  }

  if (util.isString(filter)) {
    filter = [filter];
  }

  var match = [];
  var negate = [];
  var isIgnore = ignore ? 'i' : '';

  filter.forEach(function(item) {
    var isNegate = item.indexOf('!') === 0;
    item = item
      .replace(/^!/, '')
      .replace(/\*(?![\/*])/, '[^/]*?')
      .replace('**\/', '([^/]+\/)*')
      .replace(/\{([^\}]+)\}/g, function($1, $2) {
        var collection = $2.split(',');
        var length = collection.length;
        var result = '(?:';

        collection.forEach(function(item, index) {
          result += '(' + item.trim() + ')';

          if (index + 1 !== length) {
            result += '|';
          }
        });

        result += ')';

        return result;
      })
      .replace(/([\/\.])/g, '\\$1');

    item = '(^' + item + '$)';

    if (isNegate) {
      negate.push(item);
    } else {
      match.push(item);
    }
  });

  match = match.length ?  new RegExp(match.join('|'), isIgnore) : null;
  negate = negate.length ? new RegExp(negate.join('|'), isIgnore) : null;

  return function(filepath) {
    // Normalize \\ paths to / paths.
    filepath = util.path.unixifyPath(filepath);

    if (negate && negate.test(filepath)) {
      return false;
    }

    if (match && match.test(filepath)) {
      return true;
    }

    return false;
  };
}

module.exports = fileMatch;
},{"utils-extend":8}],6:[function(require,module,exports){
/**
 * @fileoverview Strengthen the ability of file system
 * @author wliao <wliao@Ctrip.com> 
 */
var fs = require('fs');
var util = require('utils-extend');
var path = require('path');
var fileMatch = require('file-match');

function checkCbAndOpts(options, callback) {
  if (util.isFunction(options)) {
    return {
      options: null,
      callback: options
    };
  } else if (util.isObject(options)) {
    return {
      options: options,
      callback: callback
    };
  } else {
    return {
      options: null,
      callback: util.noop
    };
  }
}

function getExists(filepath) {
  var exists = fs.existsSync(filepath);

  if (exists) {
    return filepath;
  } else {
    return getExists(path.dirname(filepath));
  }
}

util.extend(exports, fs);

/**
 * @description
 * Assign node origin methods to fs
 */
exports.fs = fs;

exports.fileMatch = fileMatch;

/**
 * @description
 * Create dir, if dir exist, it will only invoke callback.
 *
 * @example
 * ```js
 *   fs.mkdir('1/2/3/4/5', 511);
 *   fs.mkdir('path/2/3', function() {});
 * ```
 */
exports.mkdir = function(filepath, mode, callback) {
  var root = getExists(filepath);
  var children  = path.relative(root, filepath);

  if (util.isFunction(mode)) {
    callback = mode;
    mode = null;
  }

  if (!util.isFunction(callback)) {
    callback = util.noop;
  }

  mode = mode || 511;

  if (!children) return callback();

  children = children.split(path.sep);

  function create(filepath) {
    if (create.count === children.length) {
      return callback();
    }

    filepath = path.join(filepath, children[create.count]);

    fs.mkdir(filepath, mode, function(err) {
      create.count++;
      create(filepath);
    });
  }

  create.count = 0;
  create(root);
};

/**
 * @description
 * Same as mkdir, but it is synchronous
 */
exports.mkdirSync = function(filepath, mode) {
  var root = getExists(filepath);
  var children  = path.relative(root, filepath);

  if (!children) return;

  children = children.split(path.sep);

  children.forEach(function(item) {
    root = path.join(root, item);
    fs.mkdirSync(root, mode);
  });
};

/**
 * @description 
 * Create file, if path don't exists, it will not throw error.
 * And will mkdir for path, it is asynchronous
 * 
 * @example
 * ```js
 *   fs.writeFile('path/filename.txt', 'something')
 *   fs.writeFile('path/filename.txt', 'something', {})
 * ```
 */
exports.writeFile = function(filename, data, options, callback) {
  var result = checkCbAndOpts(options, callback);
  var dirname = path.dirname(filename);
  options = result.options;
  callback = result.callback;

  // Create dir first
  exports.mkdir(dirname, function() {
    fs.writeFile(filename, data, options, callback);
  });
};

/**
 * @description
 * Same as writeFile, but it is synchronous
 */
exports.writeFileSync = function(filename, data, options) {
  var dirname = path.dirname(filename);

  exports.mkdirSync(dirname);
  fs.writeFileSync(filename, data, options);
};

/**
 * @description
 * Asynchronously copy a file
 * @example
 * file.copyFile('demo.txt', 'demo.dest.txt', { done: function(err) { }})
 */
exports.copyFile = function(srcpath, destpath, options) {
  options = util.extend({
    encoding: 'utf8',
    done: util.noop
  }, options || {});

  if (!options.process) {
    options.encoding = null;
  }

  fs.readFile(srcpath, {
    encoding: options.encoding
  }, function(err, contents) {
    if (err) return options.done(err);

    if (options.process) {
      contents = options.process(contents);
    }

    exports.writeFile(destpath, contents, options, options.done);
  });
};

/**
 * @description
 * Copy file to dest, if no process options, it will only copy file to dest
 * @example
 * file.copyFileSync('demo.txt', 'demo.dest.txt' { process: function(contents) { }});
 * file.copyFileSync('demo.png', 'dest.png');
 */
exports.copyFileSync = function(srcpath, destpath, options) {
  options = util.extend({
    encoding: 'utf8' 
  }, options || {});
  var contents;

  if (options.process) {
    contents = fs.readFileSync(srcpath, options);
    contents = options.process(contents, srcpath, options.relative);

    if (util.isObject(contents) && contents.filepath) {
      destpath = contents.filepath;
      contents = contents.contents;
    }

    exports.writeFileSync(destpath, contents, options);    
  } else {
    contents = fs.readFileSync(srcpath);
    exports.writeFileSync(destpath, contents);
  }
};

/**
 * @description
 * Recurse into a directory, executing callback for each file and folder
 * if the filename is undefiend, the callback is for folder, otherwise for file.
 * and it is asynchronous
 * @example
 * file.recurse('path', function(filepath, filename) { });
 * file.recurse('path', ['*.js', 'path/**\/*.html'], function(filepath, relative, filename) { });
 */
exports.recurse = function(dirpath, filter, callback) {
  if (util.isFunction(filter)) {
    callback = filter;
    filter = null;
  }
  var filterCb = fileMatch(filter);
  var rootpath = dirpath;

  function recurse(dirpath) {
    fs.readdir(dirpath, function(err, files) {
      if (err) return callback(err);

      files.forEach(function(filename) {
        var filepath = path.join(dirpath, filename);

        fs.stat(filepath, function(err, stats) {
            var relative = path.relative(rootpath, filepath);
            var flag = filterCb(relative);

            if (stats.isDirectory()) {
              recurse(filepath);
              if (flag) callback(filepath, relative);
            } else {
              if (flag) callback(filepath, relative, filename);
            }
          });
        });
    });
  }

  recurse(dirpath);
};

/**
 * @description
 * Same as recurse, but it is synchronous
 * @example
 * file.recurseSync('path', function(filepath, filename) {});
 * file.recurseSync('path', ['*.js', 'path/**\/*.html'], function(filepath, relative, filename) {});
 */
exports.recurseSync = function(dirpath, filter, callback) {
  if (util.isFunction(filter)) {
    callback = filter;
    filter = null;
  }
  var filterCb = fileMatch(filter);
  var rootpath = dirpath;

  function recurse(dirpath) {
    fs.readdirSync(dirpath).forEach(function(filename) {
      var filepath = path.join(dirpath, filename);
      var stats = fs.statSync(filepath);
      var relative = path.relative(rootpath, filepath);
      var flag = filterCb(relative);

      if (stats.isDirectory()) {
        recurse(filepath);
        if (flag) callback(filepath, relative);
      } else {
        if (flag) callback(filepath, relative, filename);
      }
    });
  }

  recurse(dirpath);
};

/**
 * @description
 * Remove folder and files in folder, but it's synchronous
 * @example
 * file.rmdirSync('path');
 */
exports.rmdirSync = function(dirpath) {
  exports.recurseSync(dirpath, function(filepath, relative, filename) {
    // it is file, otherwise it's folder
    if (filename) {
      fs.unlinkSync(filepath);
    } else {
      fs.rmdirSync(filepath);
    }
  });

  fs.rmdirSync(dirpath);
};

/**
 * @description
 * Copy dirpath to destpath, pass process callback for each file hanlder
 * if you want to change the dest filepath, process callback return { contents: '', filepath: ''}
 * otherwise only change contents
 * @example
 * file.copySync('path', 'dest');
 * file.copySync('src', 'dest/src');
 * file.copySync('path', 'dest', { process: function(contents, filepath) {} });
 * file.copySync('path', 'dest', { process: function(contents, filepath) {} }, noProcess: ['']);
 */
exports.copySync = function(dirpath, destpath, options) {
  options = util.extend({
    encoding: 'utf8',
    filter: null,
    noProcess: ''
  }, options || {});
  var noProcessCb = fileMatch(options.noProcess);

  // Make sure dest root
  exports.mkdirSync(destpath);
  exports.recurseSync(dirpath, options.filter, function(filepath, relative, filename) {
    if (!filename) return;
    var newpath = path.join(destpath, relative);
    var opts = {
      relative: relative
    };

    if (options.process && !noProcessCb(relative)) {
      opts.encoding = options.encoding;
      opts.process = options.process;
    }

    exports.copyFileSync(filepath, newpath, opts);
  });
};
},{"file-match":5,"fs":9,"path":10,"utils-extend":8}],7:[function(require,module,exports){
// MIT License:
//
// Copyright (c) 2010-2013, Joe Walnes
//               2013-2018, Drew Noakes
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * Smoothie Charts - http://smoothiecharts.org/
 * (c) 2010-2013, Joe Walnes
 *     2013-2018, Drew Noakes
 *
 * v1.0: Main charting library, by Joe Walnes
 * v1.1: Auto scaling of axis, by Neil Dunn
 * v1.2: fps (frames per second) option, by Mathias Petterson
 * v1.3: Fix for divide by zero, by Paul Nikitochkin
 * v1.4: Set minimum, top-scale padding, remove timeseries, add optional timer to reset bounds, by Kelley Reynolds
 * v1.5: Set default frames per second to 50... smoother.
 *       .start(), .stop() methods for conserving CPU, by Dmitry Vyal
 *       options.interpolation = 'bezier' or 'line', by Dmitry Vyal
 *       options.maxValue to fix scale, by Dmitry Vyal
 * v1.6: minValue/maxValue will always get converted to floats, by Przemek Matylla
 * v1.7: options.grid.fillStyle may be a transparent color, by Dmitry A. Shashkin
 *       Smooth rescaling, by Kostas Michalopoulos
 * v1.8: Set max length to customize number of live points in the dataset with options.maxDataSetLength, by Krishna Narni
 * v1.9: Display timestamps along the bottom, by Nick and Stev-io
 *       (https://groups.google.com/forum/?fromgroups#!topic/smoothie-charts/-Ywse8FCpKI%5B1-25%5D)
 *       Refactored by Krishna Narni, to support timestamp formatting function
 * v1.10: Switch to requestAnimationFrame, removed the now obsoleted options.fps, by Gergely Imreh
 * v1.11: options.grid.sharpLines option added, by @drewnoakes
 *        Addressed warning seen in Firefox when seriesOption.fillStyle undefined, by @drewnoakes
 * v1.12: Support for horizontalLines added, by @drewnoakes
 *        Support for yRangeFunction callback added, by @drewnoakes
 * v1.13: Fixed typo (#32), by @alnikitich
 * v1.14: Timer cleared when last TimeSeries removed (#23), by @davidgaleano
 *        Fixed diagonal line on chart at start/end of data stream, by @drewnoakes
 * v1.15: Support for npm package (#18), by @dominictarr
 *        Fixed broken removeTimeSeries function (#24) by @davidgaleano
 *        Minor performance and tidying, by @drewnoakes
 * v1.16: Bug fix introduced in v1.14 relating to timer creation/clearance (#23), by @drewnoakes
 *        TimeSeries.append now deals with out-of-order timestamps, and can merge duplicates, by @zacwitte (#12)
 *        Documentation and some local variable renaming for clarity, by @drewnoakes
 * v1.17: Allow control over font size (#10), by @drewnoakes
 *        Timestamp text won't overlap, by @drewnoakes
 * v1.18: Allow control of max/min label precision, by @drewnoakes
 *        Added 'borderVisible' chart option, by @drewnoakes
 *        Allow drawing series with fill but no stroke (line), by @drewnoakes
 * v1.19: Avoid unnecessary repaints, and fixed flicker in old browsers having multiple charts in document (#40), by @asbai
 * v1.20: Add SmoothieChart.getTimeSeriesOptions and SmoothieChart.bringToFront functions, by @drewnoakes
 * v1.21: Add 'step' interpolation mode, by @drewnoakes
 * v1.22: Add support for different pixel ratios. Also add optional y limit formatters, by @copacetic
 * v1.23: Fix bug introduced in v1.22 (#44), by @drewnoakes
 * v1.24: Fix bug introduced in v1.23, re-adding parseFloat to y-axis formatter defaults, by @siggy_sf
 * v1.25: Fix bug seen when adding a data point to TimeSeries which is older than the current data, by @Nking92
 *        Draw time labels on top of series, by @comolosabia
 *        Add TimeSeries.clear function, by @drewnoakes
 * v1.26: Add support for resizing on high device pixel ratio screens, by @copacetic
 * v1.27: Fix bug introduced in v1.26 for non whole number devicePixelRatio values, by @zmbush
 * v1.28: Add 'minValueScale' option, by @megawac
 *        Fix 'labelPos' for different size of 'minValueString' 'maxValueString', by @henryn
 * v1.29: Support responsive sizing, by @drewnoakes
 * v1.29.1: Include types in package, and make property optional, by @TrentHouliston
 * v1.30: Fix inverted logic in devicePixelRatio support, by @scanlime
 * v1.31: Support tooltips, by @Sly1024 and @drewnoakes
 * v1.32: Support frame rate limit, by @dpuyosa
 * v1.33: Use Date static method instead of instance, by @nnnoel
 *        Fix bug with tooltips when multiple charts on a page, by @jpmbiz70
 * v1.34: Add disabled option to TimeSeries, by @TechGuard (#91)
 *        Add nonRealtimeData option, by @annazhelt (#92, #93)
 *        Add showIntermediateLabels option, by @annazhelt (#94)
 *        Add displayDataFromPercentile option, by @annazhelt (#95)
 *        Fix bug when hiding tooltip element, by @ralphwetzel (#96)
 *        Support intermediate y-axis labels, by @beikeland (#99)
 * v1.35: Fix issue with responsive mode at high DPI, by @drewnoakes (#101)
 */

;(function(exports) {

  // Date.now polyfill
  Date.now = Date.now || function() { return new Date().getTime(); };

  var Util = {
    extend: function() {
      arguments[0] = arguments[0] || {};
      for (var i = 1; i < arguments.length; i++)
      {
        for (var key in arguments[i])
        {
          if (arguments[i].hasOwnProperty(key))
          {
            if (typeof(arguments[i][key]) === 'object') {
              if (arguments[i][key] instanceof Array) {
                arguments[0][key] = arguments[i][key];
              } else {
                arguments[0][key] = Util.extend(arguments[0][key], arguments[i][key]);
              }
            } else {
              arguments[0][key] = arguments[i][key];
            }
          }
        }
      }
      return arguments[0];
    },
    binarySearch: function(data, value) {
      var low = 0,
          high = data.length;
      while (low < high) {
        var mid = (low + high) >> 1;
        if (value < data[mid][0])
          high = mid;
        else
          low = mid + 1;
      }
      return low;
    }
  };

  /**
   * Initialises a new <code>TimeSeries</code> with optional data options.
   *
   * Options are of the form (defaults shown):
   *
   * <pre>
   * {
   *   resetBounds: true,        // enables/disables automatic scaling of the y-axis
   *   resetBoundsInterval: 3000 // the period between scaling calculations, in millis
   * }
   * </pre>
   *
   * Presentation options for TimeSeries are specified as an argument to <code>SmoothieChart.addTimeSeries</code>.
   *
   * @constructor
   */
  function TimeSeries(options) {
    this.options = Util.extend({}, TimeSeries.defaultOptions, options);
    this.disabled = false;
    this.clear();
  }

  TimeSeries.defaultOptions = {
    resetBoundsInterval: 3000,
    resetBounds: true
  };

  /**
   * Clears all data and state from this TimeSeries object.
   */
  TimeSeries.prototype.clear = function() {
    this.data = [];
    this.maxValue = Number.NaN; // The maximum value ever seen in this TimeSeries.
    this.minValue = Number.NaN; // The minimum value ever seen in this TimeSeries.
  };

  /**
   * Recalculate the min/max values for this <code>TimeSeries</code> object.
   *
   * This causes the graph to scale itself in the y-axis.
   */
  TimeSeries.prototype.resetBounds = function() {
    if (this.data.length) {
      // Walk through all data points, finding the min/max value
      this.maxValue = this.data[0][1];
      this.minValue = this.data[0][1];
      for (var i = 1; i < this.data.length; i++) {
        var value = this.data[i][1];
        if (value > this.maxValue) {
          this.maxValue = value;
        }
        if (value < this.minValue) {
          this.minValue = value;
        }
      }
    } else {
      // No data exists, so set min/max to NaN
      this.maxValue = Number.NaN;
      this.minValue = Number.NaN;
    }
  };

  /**
   * Adds a new data point to the <code>TimeSeries</code>, preserving chronological order.
   *
   * @param timestamp the position, in time, of this data point
   * @param value the value of this data point
   * @param sumRepeatedTimeStampValues if <code>timestamp</code> has an exact match in the series, this flag controls
   * whether it is replaced, or the values summed (defaults to false.)
   */
  TimeSeries.prototype.append = function(timestamp, value, sumRepeatedTimeStampValues) {
    // Rewind until we hit an older timestamp
    var i = this.data.length - 1;
    while (i >= 0 && this.data[i][0] > timestamp) {
      i--;
    }

    if (i === -1) {
      // This new item is the oldest data
      this.data.splice(0, 0, [timestamp, value]);
    } else if (this.data.length > 0 && this.data[i][0] === timestamp) {
      // Update existing values in the array
      if (sumRepeatedTimeStampValues) {
        // Sum this value into the existing 'bucket'
        this.data[i][1] += value;
        value = this.data[i][1];
      } else {
        // Replace the previous value
        this.data[i][1] = value;
      }
    } else if (i < this.data.length - 1) {
      // Splice into the correct position to keep timestamps in order
      this.data.splice(i + 1, 0, [timestamp, value]);
    } else {
      // Add to the end of the array
      this.data.push([timestamp, value]);
    }

    this.maxValue = isNaN(this.maxValue) ? value : Math.max(this.maxValue, value);
    this.minValue = isNaN(this.minValue) ? value : Math.min(this.minValue, value);
  };

  TimeSeries.prototype.dropOldData = function(oldestValidTime, maxDataSetLength) {
    // We must always keep one expired data point as we need this to draw the
    // line that comes into the chart from the left, but any points prior to that can be removed.
    var removeCount = 0;
    while (this.data.length - removeCount >= maxDataSetLength && this.data[removeCount + 1][0] < oldestValidTime) {
      removeCount++;
    }
    if (removeCount !== 0) {
      this.data.splice(0, removeCount);
    }
  };

  /**
   * Initialises a new <code>SmoothieChart</code>.
   *
   * Options are optional, and should be of the form below. Just specify the values you
   * need and the rest will be given sensible defaults as shown:
   *
   * <pre>
   * {
   *   minValue: undefined,                      // specify to clamp the lower y-axis to a given value
   *   maxValue: undefined,                      // specify to clamp the upper y-axis to a given value
   *   maxValueScale: 1,                         // allows proportional padding to be added above the chart. for 10% padding, specify 1.1.
   *   minValueScale: 1,                         // allows proportional padding to be added below the chart. for 10% padding, specify 1.1.
   *   yRangeFunction: undefined,                // function({min: , max: }) { return {min: , max: }; }
   *   scaleSmoothing: 0.125,                    // controls the rate at which y-value zoom animation occurs
   *   millisPerPixel: 20,                       // sets the speed at which the chart pans by
   *   enableDpiScaling: true,                   // support rendering at different DPI depending on the device
   *   yMinFormatter: function(min, precision) { // callback function that formats the min y value label
   *     return parseFloat(min).toFixed(precision);
   *   },
   *   yMaxFormatter: function(max, precision) { // callback function that formats the max y value label
   *     return parseFloat(max).toFixed(precision);
   *   },
   *   yIntermediateFormatter: function(intermediate, precision) { // callback function that formats the intermediate y value labels
   *     return parseFloat(intermediate).toFixed(precision);
   *   },
   *   maxDataSetLength: 2,
   *   interpolation: 'bezier'                   // one of 'bezier', 'linear', or 'step'
   *   timestampFormatter: null,                 // optional function to format time stamps for bottom of chart
   *                                             // you may use SmoothieChart.timeFormatter, or your own: function(date) { return ''; }
   *   scrollBackwards: false,                   // reverse the scroll direction of the chart
   *   horizontalLines: [],                      // [ { value: 0, color: '#ffffff', lineWidth: 1 } ]
   *   grid:
   *   {
   *     fillStyle: '#000000',                   // the background colour of the chart
   *     lineWidth: 1,                           // the pixel width of grid lines
   *     strokeStyle: '#777777',                 // colour of grid lines
   *     millisPerLine: 1000,                    // distance between vertical grid lines
   *     sharpLines: false,                      // controls whether grid lines are 1px sharp, or softened
   *     verticalSections: 2,                    // number of vertical sections marked out by horizontal grid lines
   *     borderVisible: true                     // whether the grid lines trace the border of the chart or not
   *   },
   *   labels
   *   {
   *     disabled: false,                        // enables/disables labels showing the min/max values
   *     fillStyle: '#ffffff',                   // colour for text of labels,
   *     fontSize: 15,
   *     fontFamily: 'sans-serif',
   *     precision: 2,
   *     showIntermediateLabels: false,          // shows intermediate labels between min and max values along y axis
   *     intermediateLabelSameAxis: true,
   *   },
   *   tooltip: false                            // show tooltip when mouse is over the chart
   *   tooltipLine: {                            // properties for a vertical line at the cursor position
   *     lineWidth: 1,
   *     strokeStyle: '#BBBBBB'
   *   },
   *   tooltipFormatter: SmoothieChart.tooltipFormatter, // formatter function for tooltip text
   *   nonRealtimeData: false,                   // use time of latest data as current time
   *   displayDataFromPercentile: 1,             // display not latest data, but data from the given percentile
   *                                             // useful when trying to see old data saved by setting a high value for maxDataSetLength
   *                                             // should be a value between 0 and 1
   *   responsive: false,                        // whether the chart should adapt to the size of the canvas
   *   limitFPS: 0                               // maximum frame rate the chart will render at, in FPS (zero means no limit)
   * }
   * </pre>
   *
   * @constructor
   */
  function SmoothieChart(options) {
    this.options = Util.extend({}, SmoothieChart.defaultChartOptions, options);
    this.seriesSet = [];
    this.currentValueRange = 1;
    this.currentVisMinValue = 0;
    this.lastRenderTimeMillis = 0;
    this.lastChartTimestamp = 0;

    this.mousemove = this.mousemove.bind(this);
    this.mouseout = this.mouseout.bind(this);
  }

  /** Formats the HTML string content of the tooltip. */
  SmoothieChart.tooltipFormatter = function (timestamp, data) {
      var timestampFormatter = this.options.timestampFormatter || SmoothieChart.timeFormatter,
          lines = [timestampFormatter(new Date(timestamp))];

      for (var i = 0; i < data.length; ++i) {
        lines.push('<span style="color:' + data[i].series.options.strokeStyle + '">' +
        this.options.yMaxFormatter(data[i].value, this.options.labels.precision) + '</span>');
      }

      return lines.join('<br>');
  };

  SmoothieChart.defaultChartOptions = {
    millisPerPixel: 20,
    enableDpiScaling: true,
    yMinFormatter: function(min, precision) {
      return parseFloat(min).toFixed(precision);
    },
    yMaxFormatter: function(max, precision) {
      return parseFloat(max).toFixed(precision);
    },
    yIntermediateFormatter: function(intermediate, precision) {
      return parseFloat(intermediate).toFixed(precision);
    },
    maxValueScale: 1,
    minValueScale: 1,
    interpolation: 'bezier',
    scaleSmoothing: 0.125,
    maxDataSetLength: 2,
    scrollBackwards: false,
    displayDataFromPercentile: 1,
    grid: {
      fillStyle: '#000000',
      strokeStyle: '#777777',
      lineWidth: 1,
      sharpLines: false,
      millisPerLine: 1000,
      verticalSections: 2,
      borderVisible: true
    },
    labels: {
      fillStyle: '#ffffff',
      disabled: false,
      fontSize: 10,
      fontFamily: 'monospace',
      precision: 2,
      showIntermediateLabels: false,
      intermediateLabelSameAxis: true,
    },
    horizontalLines: [],
    tooltip: false,
    tooltipLine: {
      lineWidth: 1,
      strokeStyle: '#BBBBBB'
    },
    tooltipFormatter: SmoothieChart.tooltipFormatter,
    nonRealtimeData: false,
    responsive: false,
    limitFPS: 0
  };

  // Based on http://inspirit.github.com/jsfeat/js/compatibility.js
  SmoothieChart.AnimateCompatibility = (function() {
    var requestAnimationFrame = function(callback, element) {
          var requestAnimationFrame =
            window.requestAnimationFrame        ||
            window.webkitRequestAnimationFrame  ||
            window.mozRequestAnimationFrame     ||
            window.oRequestAnimationFrame       ||
            window.msRequestAnimationFrame      ||
            function(callback) {
              return window.setTimeout(function() {
                callback(Date.now());
              }, 16);
            };
          return requestAnimationFrame.call(window, callback, element);
        },
        cancelAnimationFrame = function(id) {
          var cancelAnimationFrame =
            window.cancelAnimationFrame ||
            function(id) {
              clearTimeout(id);
            };
          return cancelAnimationFrame.call(window, id);
        };

    return {
      requestAnimationFrame: requestAnimationFrame,
      cancelAnimationFrame: cancelAnimationFrame
    };
  })();

  SmoothieChart.defaultSeriesPresentationOptions = {
    lineWidth: 1,
    strokeStyle: '#ffffff'
  };

  /**
   * Adds a <code>TimeSeries</code> to this chart, with optional presentation options.
   *
   * Presentation options should be of the form (defaults shown):
   *
   * <pre>
   * {
   *   lineWidth: 1,
   *   strokeStyle: '#ffffff',
   *   fillStyle: undefined
   * }
   * </pre>
   */
  SmoothieChart.prototype.addTimeSeries = function(timeSeries, options) {
    this.seriesSet.push({timeSeries: timeSeries, options: Util.extend({}, SmoothieChart.defaultSeriesPresentationOptions, options)});
    if (timeSeries.options.resetBounds && timeSeries.options.resetBoundsInterval > 0) {
      timeSeries.resetBoundsTimerId = setInterval(
        function() {
          timeSeries.resetBounds();
        },
        timeSeries.options.resetBoundsInterval
      );
    }
  };

  /**
   * Removes the specified <code>TimeSeries</code> from the chart.
   */
  SmoothieChart.prototype.removeTimeSeries = function(timeSeries) {
    // Find the correct timeseries to remove, and remove it
    var numSeries = this.seriesSet.length;
    for (var i = 0; i < numSeries; i++) {
      if (this.seriesSet[i].timeSeries === timeSeries) {
        this.seriesSet.splice(i, 1);
        break;
      }
    }
    // If a timer was operating for that timeseries, remove it
    if (timeSeries.resetBoundsTimerId) {
      // Stop resetting the bounds, if we were
      clearInterval(timeSeries.resetBoundsTimerId);
    }
  };

  /**
   * Gets render options for the specified <code>TimeSeries</code>.
   *
   * As you may use a single <code>TimeSeries</code> in multiple charts with different formatting in each usage,
   * these settings are stored in the chart.
   */
  SmoothieChart.prototype.getTimeSeriesOptions = function(timeSeries) {
    // Find the correct timeseries to remove, and remove it
    var numSeries = this.seriesSet.length;
    for (var i = 0; i < numSeries; i++) {
      if (this.seriesSet[i].timeSeries === timeSeries) {
        return this.seriesSet[i].options;
      }
    }
  };

  /**
   * Brings the specified <code>TimeSeries</code> to the top of the chart. It will be rendered last.
   */
  SmoothieChart.prototype.bringToFront = function(timeSeries) {
    // Find the correct timeseries to remove, and remove it
    var numSeries = this.seriesSet.length;
    for (var i = 0; i < numSeries; i++) {
      if (this.seriesSet[i].timeSeries === timeSeries) {
        var set = this.seriesSet.splice(i, 1);
        this.seriesSet.push(set[0]);
        break;
      }
    }
  };

  /**
   * Instructs the <code>SmoothieChart</code> to start rendering to the provided canvas, with specified delay.
   *
   * @param canvas the target canvas element
   * @param delayMillis an amount of time to wait before a data point is shown. This can prevent the end of the series
   * from appearing on screen, with new values flashing into view, at the expense of some latency.
   */
  SmoothieChart.prototype.streamTo = function(canvas, delayMillis) {
    this.canvas = canvas;
    this.delay = delayMillis;
    this.start();
  };

  SmoothieChart.prototype.getTooltipEl = function () {
    // Create the tool tip element lazily
    if (!this.tooltipEl) {
      this.tooltipEl = document.createElement('div');
      this.tooltipEl.className = 'smoothie-chart-tooltip';
      this.tooltipEl.style.position = 'absolute';
      this.tooltipEl.style.display = 'none';
      document.body.appendChild(this.tooltipEl);
    }
    return this.tooltipEl;
  };

  SmoothieChart.prototype.updateTooltip = function () {
    var el = this.getTooltipEl();

    if (!this.mouseover || !this.options.tooltip) {
      el.style.display = 'none';
      return;
    }

    var time = this.lastChartTimestamp;

    // x pixel to time
    var t = this.options.scrollBackwards
      ? time - this.mouseX * this.options.millisPerPixel
      : time - (this.canvas.offsetWidth - this.mouseX) * this.options.millisPerPixel;

    var data = [];

     // For each data set...
    for (var d = 0; d < this.seriesSet.length; d++) {
      var timeSeries = this.seriesSet[d].timeSeries;
      if (timeSeries.disabled) {
          continue;
      }

      // find datapoint closest to time 't'
      var closeIdx = Util.binarySearch(timeSeries.data, t);
      if (closeIdx > 0 && closeIdx < timeSeries.data.length) {
        data.push({ series: this.seriesSet[d], index: closeIdx, value: timeSeries.data[closeIdx][1] });
      }
    }

    if (data.length) {
      el.innerHTML = this.options.tooltipFormatter.call(this, t, data);
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  };

  SmoothieChart.prototype.mousemove = function (evt) {
    this.mouseover = true;
    this.mouseX = evt.offsetX;
    this.mouseY = evt.offsetY;
    this.mousePageX = evt.pageX;
    this.mousePageY = evt.pageY;

    var el = this.getTooltipEl();
    el.style.top = Math.round(this.mousePageY) + 'px';
    el.style.left = Math.round(this.mousePageX) + 'px';
    this.updateTooltip();
  };

  SmoothieChart.prototype.mouseout = function () {
    this.mouseover = false;
    this.mouseX = this.mouseY = -1;
    if (this.tooltipEl)
      this.tooltipEl.style.display = 'none';
  };

  /**
   * Make sure the canvas has the optimal resolution for the device's pixel ratio.
   */
  SmoothieChart.prototype.resize = function () {
    var dpr = !this.options.enableDpiScaling || !window ? 1 : window.devicePixelRatio,
        width, height;
    if (this.options.responsive) {
      // Newer behaviour: Use the canvas's size in the layout, and set the internal
      // resolution according to that size and the device pixel ratio (eg: high DPI)
      width = this.canvas.offsetWidth;
      height = this.canvas.offsetHeight;

      if (width !== this.lastWidth) {
        this.lastWidth = width;
        this.canvas.setAttribute('width', (Math.floor(width * dpr)).toString());
        this.canvas.getContext('2d').scale(dpr, dpr);
      }
      if (height !== this.lastHeight) {
        this.lastHeight = height;
        this.canvas.setAttribute('height', (Math.floor(height * dpr)).toString());
        this.canvas.getContext('2d').scale(dpr, dpr);
      }
    } else if (dpr !== 1) {
      // Older behaviour: use the canvas's inner dimensions and scale the element's size
      // according to that size and the device pixel ratio (eg: high DPI)
      width = parseInt(this.canvas.getAttribute('width'));
      height = parseInt(this.canvas.getAttribute('height'));

      if (!this.originalWidth || (Math.floor(this.originalWidth * dpr) !== width)) {
        this.originalWidth = width;
        this.canvas.setAttribute('width', (Math.floor(width * dpr)).toString());
        this.canvas.style.width = width + 'px';
        this.canvas.getContext('2d').scale(dpr, dpr);
      }

      if (!this.originalHeight || (Math.floor(this.originalHeight * dpr) !== height)) {
        this.originalHeight = height;
        this.canvas.setAttribute('height', (Math.floor(height * dpr)).toString());
        this.canvas.style.height = height + 'px';
        this.canvas.getContext('2d').scale(dpr, dpr);
      }
    }
  };

  /**
   * Starts the animation of this chart.
   */
  SmoothieChart.prototype.start = function() {
    if (this.frame) {
      // We're already running, so just return
      return;
    }

    this.canvas.addEventListener('mousemove', this.mousemove);
    this.canvas.addEventListener('mouseout', this.mouseout);

    // Renders a frame, and queues the next frame for later rendering
    var animate = function() {
      this.frame = SmoothieChart.AnimateCompatibility.requestAnimationFrame(function() {
        if(this.options.nonRealtimeData){
           var dateZero = new Date(0);
           // find the data point with the latest timestamp
           var maxTimeStamp = this.seriesSet.reduce(function(max, series){
             var dataSet = series.timeSeries.data;
             var indexToCheck = Math.round(this.options.displayDataFromPercentile * dataSet.length) - 1;
             indexToCheck = indexToCheck >= 0 ? indexToCheck : 0;
             indexToCheck = indexToCheck <= dataSet.length -1 ? indexToCheck : dataSet.length -1;
             if(dataSet && dataSet.length > 0)
             {
              // timestamp corresponds to element 0 of the data point
              var lastDataTimeStamp = dataSet[indexToCheck][0];
              max = max > lastDataTimeStamp ? max : lastDataTimeStamp;
             }
             return max;
          }.bind(this), dateZero);
          // use the max timestamp as current time
          this.render(this.canvas, maxTimeStamp > dateZero ? maxTimeStamp : null);
        } else {
          this.render();
        }
        animate();
      }.bind(this));
    }.bind(this);

    animate();
  };

  /**
   * Stops the animation of this chart.
   */
  SmoothieChart.prototype.stop = function() {
    if (this.frame) {
      SmoothieChart.AnimateCompatibility.cancelAnimationFrame(this.frame);
      delete this.frame;
      this.canvas.removeEventListener('mousemove', this.mousemove);
      this.canvas.removeEventListener('mouseout', this.mouseout);
    }
  };

  SmoothieChart.prototype.updateValueRange = function() {
    // Calculate the current scale of the chart, from all time series.
    var chartOptions = this.options,
        chartMaxValue = Number.NaN,
        chartMinValue = Number.NaN;

    for (var d = 0; d < this.seriesSet.length; d++) {
      // TODO(ndunn): We could calculate / track these values as they stream in.
      var timeSeries = this.seriesSet[d].timeSeries;
      if (timeSeries.disabled) {
          continue;
      }

      if (!isNaN(timeSeries.maxValue)) {
        chartMaxValue = !isNaN(chartMaxValue) ? Math.max(chartMaxValue, timeSeries.maxValue) : timeSeries.maxValue;
      }

      if (!isNaN(timeSeries.minValue)) {
        chartMinValue = !isNaN(chartMinValue) ? Math.min(chartMinValue, timeSeries.minValue) : timeSeries.minValue;
      }
    }

    // Scale the chartMaxValue to add padding at the top if required
    if (chartOptions.maxValue != null) {
      chartMaxValue = chartOptions.maxValue;
    } else {
      chartMaxValue *= chartOptions.maxValueScale;
    }

    // Set the minimum if we've specified one
    if (chartOptions.minValue != null) {
      chartMinValue = chartOptions.minValue;
    } else {
      chartMinValue -= Math.abs(chartMinValue * chartOptions.minValueScale - chartMinValue);
    }

    // If a custom range function is set, call it
    if (this.options.yRangeFunction) {
      var range = this.options.yRangeFunction({min: chartMinValue, max: chartMaxValue});
      chartMinValue = range.min;
      chartMaxValue = range.max;
    }

    if (!isNaN(chartMaxValue) && !isNaN(chartMinValue)) {
      var targetValueRange = chartMaxValue - chartMinValue;
      var valueRangeDiff = (targetValueRange - this.currentValueRange);
      var minValueDiff = (chartMinValue - this.currentVisMinValue);
      this.isAnimatingScale = Math.abs(valueRangeDiff) > 0.1 || Math.abs(minValueDiff) > 0.1;
      this.currentValueRange += chartOptions.scaleSmoothing * valueRangeDiff;
      this.currentVisMinValue += chartOptions.scaleSmoothing * minValueDiff;
    }

    this.valueRange = { min: chartMinValue, max: chartMaxValue };
  };

  SmoothieChart.prototype.render = function(canvas, time) {
    var nowMillis = Date.now();

    // Respect any frame rate limit.
    if (this.options.limitFPS > 0 && nowMillis - this.lastRenderTimeMillis < (1000/this.options.limitFPS))
      return;

    if (!this.isAnimatingScale) {
      // We're not animating. We can use the last render time and the scroll speed to work out whether
      // we actually need to paint anything yet. If not, we can return immediately.

      // Render at least every 1/6th of a second. The canvas may be resized, which there is
      // no reliable way to detect.
      var maxIdleMillis = Math.min(1000/6, this.options.millisPerPixel);

      if (nowMillis - this.lastRenderTimeMillis < maxIdleMillis) {
        return;
      }
    }

    this.resize();
    this.updateTooltip();

    this.lastRenderTimeMillis = nowMillis;

    canvas = canvas || this.canvas;
    time = time || nowMillis - (this.delay || 0);

    // Round time down to pixel granularity, so motion appears smoother.
    time -= time % this.options.millisPerPixel;

    this.lastChartTimestamp = time;

    var context = canvas.getContext('2d'),
        chartOptions = this.options,
        dimensions = { top: 0, left: 0, width: canvas.clientWidth, height: canvas.clientHeight },
        // Calculate the threshold time for the oldest data points.
        oldestValidTime = time - (dimensions.width * chartOptions.millisPerPixel),
        valueToYPixel = function(value) {
          var offset = value - this.currentVisMinValue;
          return this.currentValueRange === 0
            ? dimensions.height
            : dimensions.height - (Math.round((offset / this.currentValueRange) * dimensions.height));
        }.bind(this),
        timeToXPixel = function(t) {
          if(chartOptions.scrollBackwards) {
            return Math.round((time - t) / chartOptions.millisPerPixel);
          }
          return Math.round(dimensions.width - ((time - t) / chartOptions.millisPerPixel));
        };

    this.updateValueRange();

    context.font = chartOptions.labels.fontSize + 'px ' + chartOptions.labels.fontFamily;

    // Save the state of the canvas context, any transformations applied in this method
    // will get removed from the stack at the end of this method when .restore() is called.
    context.save();

    // Move the origin.
    context.translate(dimensions.left, dimensions.top);

    // Create a clipped rectangle - anything we draw will be constrained to this rectangle.
    // This prevents the occasional pixels from curves near the edges overrunning and creating
    // screen cheese (that phrase should need no explanation).
    context.beginPath();
    context.rect(0, 0, dimensions.width, dimensions.height);
    context.clip();

    // Clear the working area.
    context.save();
    context.fillStyle = chartOptions.grid.fillStyle;
    context.clearRect(0, 0, dimensions.width, dimensions.height);
    context.fillRect(0, 0, dimensions.width, dimensions.height);
    context.restore();

    // Grid lines...
    context.save();
    context.lineWidth = chartOptions.grid.lineWidth;
    context.strokeStyle = chartOptions.grid.strokeStyle;
    // Vertical (time) dividers.
    if (chartOptions.grid.millisPerLine > 0) {
      context.beginPath();
      for (var t = time - (time % chartOptions.grid.millisPerLine);
           t >= oldestValidTime;
           t -= chartOptions.grid.millisPerLine) {
        var gx = timeToXPixel(t);
        if (chartOptions.grid.sharpLines) {
          gx -= 0.5;
        }
        context.moveTo(gx, 0);
        context.lineTo(gx, dimensions.height);
      }
      context.stroke();
      context.closePath();
    }

    // Horizontal (value) dividers.
    for (var v = 1; v < chartOptions.grid.verticalSections; v++) {
      var gy = Math.round(v * dimensions.height / chartOptions.grid.verticalSections);
      if (chartOptions.grid.sharpLines) {
        gy -= 0.5;
      }
      context.beginPath();
      context.moveTo(0, gy);
      context.lineTo(dimensions.width, gy);
      context.stroke();
      context.closePath();
    }
    // Bounding rectangle.
    if (chartOptions.grid.borderVisible) {
      context.beginPath();
      context.strokeRect(0, 0, dimensions.width, dimensions.height);
      context.closePath();
    }
    context.restore();

    // Draw any horizontal lines...
    if (chartOptions.horizontalLines && chartOptions.horizontalLines.length) {
      for (var hl = 0; hl < chartOptions.horizontalLines.length; hl++) {
        var line = chartOptions.horizontalLines[hl],
            hly = Math.round(valueToYPixel(line.value)) - 0.5;
        context.strokeStyle = line.color || '#ffffff';
        context.lineWidth = line.lineWidth || 1;
        context.beginPath();
        context.moveTo(0, hly);
        context.lineTo(dimensions.width, hly);
        context.stroke();
        context.closePath();
      }
    }

    // For each data set...
    for (var d = 0; d < this.seriesSet.length; d++) {
      context.save();
      var timeSeries = this.seriesSet[d].timeSeries;
      if (timeSeries.disabled) {
          continue;
      }

      var dataSet = timeSeries.data,
          seriesOptions = this.seriesSet[d].options;

      // Delete old data that's moved off the left of the chart.
      timeSeries.dropOldData(oldestValidTime, chartOptions.maxDataSetLength);

      // Set style for this dataSet.
      context.lineWidth = seriesOptions.lineWidth;
      context.strokeStyle = seriesOptions.strokeStyle;
      // Draw the line...
      context.beginPath();
      // Retain lastX, lastY for calculating the control points of bezier curves.
      var firstX = 0, lastX = 0, lastY = 0;
      for (var i = 0; i < dataSet.length && dataSet.length !== 1; i++) {
        var x = timeToXPixel(dataSet[i][0]),
            y = valueToYPixel(dataSet[i][1]);

        if (i === 0) {
          firstX = x;
          context.moveTo(x, y);
        } else {
          switch (chartOptions.interpolation) {
            case "linear":
            case "line": {
              context.lineTo(x,y);
              break;
            }
            case "bezier":
            default: {
              // Great explanation of Bezier curves: http://en.wikipedia.org/wiki/Bezier_curve#Quadratic_curves
              //
              // Assuming A was the last point in the line plotted and B is the new point,
              // we draw a curve with control points P and Q as below.
              //
              // A---P
              //     |
              //     |
              //     |
              //     Q---B
              //
              // Importantly, A and P are at the same y coordinate, as are B and Q. This is
              // so adjacent curves appear to flow as one.
              //
              context.bezierCurveTo( // startPoint (A) is implicit from last iteration of loop
                Math.round((lastX + x) / 2), lastY, // controlPoint1 (P)
                Math.round((lastX + x)) / 2, y, // controlPoint2 (Q)
                x, y); // endPoint (B)
              break;
            }
            case "step": {
              context.lineTo(x,lastY);
              context.lineTo(x,y);
              break;
            }
          }
        }

        lastX = x; lastY = y;
      }

      if (dataSet.length > 1) {
        if (seriesOptions.fillStyle) {
          // Close up the fill region.
          context.lineTo(dimensions.width + seriesOptions.lineWidth + 1, lastY);
          context.lineTo(dimensions.width + seriesOptions.lineWidth + 1, dimensions.height + seriesOptions.lineWidth + 1);
          context.lineTo(firstX, dimensions.height + seriesOptions.lineWidth);
          context.fillStyle = seriesOptions.fillStyle;
          context.fill();
        }

        if (seriesOptions.strokeStyle && seriesOptions.strokeStyle !== 'none') {
          context.stroke();
        }
        context.closePath();
      }
      context.restore();
    }

    if (chartOptions.tooltip && this.mouseX >= 0) {
      // Draw vertical bar to show tooltip position
      context.lineWidth = chartOptions.tooltipLine.lineWidth;
      context.strokeStyle = chartOptions.tooltipLine.strokeStyle;
      context.beginPath();
      context.moveTo(this.mouseX, 0);
      context.lineTo(this.mouseX, dimensions.height);
      context.closePath();
      context.stroke();
      this.updateTooltip();
    }

    // Draw the axis values on the chart.
    if (!chartOptions.labels.disabled && !isNaN(this.valueRange.min) && !isNaN(this.valueRange.max)) {
      var maxValueString = chartOptions.yMaxFormatter(this.valueRange.max, chartOptions.labels.precision),
          minValueString = chartOptions.yMinFormatter(this.valueRange.min, chartOptions.labels.precision),
          maxLabelPos = chartOptions.scrollBackwards ? 0 : dimensions.width - context.measureText(maxValueString).width - 2,
          minLabelPos = chartOptions.scrollBackwards ? 0 : dimensions.width - context.measureText(minValueString).width - 2;
      context.fillStyle = chartOptions.labels.fillStyle;
      context.fillText(maxValueString, maxLabelPos, chartOptions.labels.fontSize);
      context.fillText(minValueString, minLabelPos, dimensions.height - 2);
    }

    // Display intermediate y axis labels along y-axis to the left of the chart
    if ( chartOptions.labels.showIntermediateLabels
          && !isNaN(this.valueRange.min) && !isNaN(this.valueRange.max)
          && chartOptions.grid.verticalSections > 0) {
      // show a label above every vertical section divider
      var step = (this.valueRange.max - this.valueRange.min) / chartOptions.grid.verticalSections;
      var stepPixels = dimensions.height / chartOptions.grid.verticalSections;
      for (var v = 1; v < chartOptions.grid.verticalSections; v++) {
        var gy = dimensions.height - Math.round(v * stepPixels);
        if (chartOptions.grid.sharpLines) {
          gy -= 0.5;
        }
        var yValue = chartOptions.yIntermediateFormatter(this.valueRange.min + (v * step), chartOptions.labels.precision);
        //left of right axis?
        intermediateLabelPos =
          chartOptions.labels.intermediateLabelSameAxis
          ? (chartOptions.scrollBackwards ? 0 : dimensions.width - context.measureText(yValue).width - 2)
          : (chartOptions.scrollBackwards ? dimensions.width - context.measureText(yValue).width - 2 : 0);

        context.fillText(yValue, intermediateLabelPos, gy - chartOptions.grid.lineWidth);
      }
    }

    // Display timestamps along x-axis at the bottom of the chart.
    if (chartOptions.timestampFormatter && chartOptions.grid.millisPerLine > 0) {
      var textUntilX = chartOptions.scrollBackwards
        ? context.measureText(minValueString).width
        : dimensions.width - context.measureText(minValueString).width + 4;
      for (var t = time - (time % chartOptions.grid.millisPerLine);
           t >= oldestValidTime;
           t -= chartOptions.grid.millisPerLine) {
        var gx = timeToXPixel(t);
        // Only draw the timestamp if it won't overlap with the previously drawn one.
        if ((!chartOptions.scrollBackwards && gx < textUntilX) || (chartOptions.scrollBackwards && gx > textUntilX))  {
          // Formats the timestamp based on user specified formatting function
          // SmoothieChart.timeFormatter function above is one such formatting option
          var tx = new Date(t),
            ts = chartOptions.timestampFormatter(tx),
            tsWidth = context.measureText(ts).width;

          textUntilX = chartOptions.scrollBackwards
            ? gx + tsWidth + 2
            : gx - tsWidth - 2;

          context.fillStyle = chartOptions.labels.fillStyle;
          if(chartOptions.scrollBackwards) {
            context.fillText(ts, gx, dimensions.height - 2);
          } else {
            context.fillText(ts, gx - tsWidth, dimensions.height - 2);
          }
        }
      }
    }

    context.restore(); // See .save() above.
  };

  // Sample timestamp formatting function
  SmoothieChart.timeFormatter = function(date) {
    function pad2(number) { return (number < 10 ? '0' : '') + number }
    return pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds());
  };

  exports.TimeSeries = TimeSeries;
  exports.SmoothieChart = SmoothieChart;

})(typeof exports === 'undefined' ? this : exports);

},{}],8:[function(require,module,exports){
(function (process){
/**
 * @fileoverview Extend node util module
 * @author douzi <liaowei08@gmail.com> 
 */
var util = require('util');
var toString = Object.prototype.toString;
var isWindows = process.platform === 'win32';

function isObject(value) {
  return toString.call(value) === '[object Object]';
}

// And type check method: isFunction, isString, isNumber, isDate, isRegExp, isObject
['Function', 'String', 'Number', 'Date', 'RegExp'].forEach(function(item) {
  exports['is' + item]  = function(value) {
    return toString.call(value) === '[object ' + item + ']';
  };
});

/**
 * @description
 * Deep extend
 * @example
 * extend({ key: { k1: 'v1'} }, { key: { k2: 'v2' }, none: { k: 'v' } });
 * extend({ arr: [] }, { arr: [ {}, {} ] });
 */
function extend(target, source) {
  var value;

  for (var key in source) {
    value = source[key];

    if (Array.isArray(value)) {
      if (!Array.isArray(target[key])) {
        target[key] = [];
      }

      extend(target[key], value);
    } else if (isObject(value)) {
      if (!isObject(target[key])) {
        target[key]  = {};
      }

      extend(target[key], value);
    } else {
      target[key] = value;
    }
  }

  return target;
}

extend(exports, util);

// fixed util.isObject 
exports.isObject = isObject;

exports.extend = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  var target = args.shift();

  args.forEach(function(item) {
    extend(target, item);
  });

  return target;
};

exports.isArray = Array.isArray;

exports.isUndefined = function(value) {
  return typeof value == 'undefined';
};

exports.noop = function() {};

exports.unique = function(array) {
  var result = [];

  array.forEach(function(item) {
    if (result.indexOf(item) == -1) {
      result.push(item);
    }
  });

  return result;
};

exports.escape = function(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

exports.unescape = function(value) {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
};

exports.hrtime = function(time) {
  if (time) {
    var spend = process.hrtime(time);
    
    spend = (spend[0] + spend[1] / 1e9) * 1000 + 'ms';

    return spend;
  } else {
    return process.hrtime();
  }
};

/**
 * @description
 * Return a copy of the object with list keys
 * @example
 * util.pick({ key: 'value' }, 'key', 'key1');
 * util.pick(obj, function(value, key, object) { });
 */
exports.pick = function(obj, iteratee) {
  var result = {};

  if (exports.isFunction(iteratee)) {
    for (var key in obj) {
      var value = obj[key];
      if (iteratee(value, key, obj)) {
        result[key] = value;
      }
    }
  } else {
    var keys = Array.prototype.slice.call(arguments, 1);

    keys.forEach(function(key) {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
  }

  return result;
};

exports.path = {};

if (isWindows) {
  // Regex to split a windows path into three parts: [*, device, slash,
  // tail] windows-only
  var splitDeviceRe =
      /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

  exports.path.isAbsolute = function(filepath) {
    var result = splitDeviceRe.exec(filepath),
        device = result[1] || '',
        isUnc = !!device && device.charAt(1) !== ':';
    // UNC paths are always absolute
    return !!result[2] || isUnc;
  };

  // Normalize \\ paths to / paths.
  exports.path.unixifyPath = function(filepath) {
    return filepath.replace(/\\/g, '/');
  };

} else {
  exports.path.isAbsolute = function(filepath) {
    return filepath.charAt(0) === '/';
  };

  exports.path.unixifyPath = function(filepath) {
    return filepath;
  };
}
}).call(this,require('_process'))
},{"_process":11,"util":14}],9:[function(require,module,exports){

},{}],10:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":11}],11:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],12:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],13:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],14:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":13,"_process":11,"inherits":12}]},{},[2]);
