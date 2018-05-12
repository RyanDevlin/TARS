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
//PiStats.printMemoryInfo();

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
