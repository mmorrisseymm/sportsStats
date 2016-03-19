// this collection contains all the songs
Songs = new Mongo.Collection("songs");
// this variable will store the visualisation so we can delete it when we need to 
var visjsobj;
if (Meteor.isClient){

////////////////////////////
///// helper functions for the vis control form
////////////////////////////


////////////////////////////
///// helper functions for the feature list display template
////// (provide the data for that list of songs)
////////////////////////////

// helper that provides an array of feature_values
// for all songs of the currently selected type
// this is used to feed the template that displays the big list of 
// numbers


////////////////////////////
///// event handlers for the team control form
////////////////////////////
Template.teams_stats_controls.events({

   "click .js_show-stats":function(event){
      event.preventDefault();
      //Get the values from the combo boxes
     // var tName = $('#team-sel :selected').text();
     var tName = $("#team-sel").children("option").filter(":selected").text();
     var stat = $("#stat-sel").val();
     var type = $("#type-sel").val();

     if(type=="timeline"){
      initMyVis(tName, stat, type);
     };

     if(type=="scatter"){
      initMyVis(tName, stat, type);
     }

     if(type=="nodes"){
       initNodeVis(tName, stat);
     };
      
    },

});//End Team stats control events

}

////////////////////////////
///// functions that set up and display the visualisation
////////////////////////////


//Build a for loop which starts at 1960 and adds 1 to each year, then using keys
//grab and build the data.

//graphdata.1960.Celtics.wins (the variable will be the year - which will also be stored as array
//Need to collect two points x and y  - x has to be the date
// y will be the data point which will need to be plotted

  // iterate the graphs collection, converting each song into a simple
  // object that the visualiser understands

function initMyVis(teamName, stats, type){

 if (visjsobj != undefined){
    visjsobj.destroy();
  }

  var ind = 0;
  var year = 1960;
  var myYear = "y" + year;
  var tColor = 'green'

  // generate an array of items
  // from the graphData collection
  // where each item describes a peice of data currently selected
  // feature
  var items = new Array();

  $.each(graphData, function(key, value ){
    if (graphData[myYear][teamName][stats] != undefined)
     {
      var label = "ind: "+ ind;
      label = year + " | " + stats + ": " + graphData[myYear][teamName][stats];
      // console.log("this is the label: " + label);
      }   
      var value = graphData[myYear][teamName][stats];

      //get the 2nd stat for the chart
      var date = year + "-01-01";
      var res = graphData[myYear][teamName].championship;

      // here we create the actual object for the visualiser
      // and put it into the items array
      items[ind] = {
        x: date, 
        y: value, 
        //group: 0,
        // slighlty hacky label -- check out the vis-label
        // class in song_data_viz.css 
        label:{content:label, className:'vis-label', yOffset:-5}, 
      };
      ind ++ ;
      //  console.log("index: " + ind);
      year = 1960 + ind
      // console.log("year: " + year)
      myYear = "";
      myYear = "y" + year;
      // console.log("myYear: " + myYear);
  })
   //console.log(items);
   // set up the data plotter
   if(type=="timeline"){
      var options = {
      shaded: {
        orientation: 'top',
        style:{
          fill:tColor
        }
      },
      drawPoints:{
        fill:tColor,
      },
      start: '1960-01-01',
      end: '2015-06-01',
      }
    };
  
  if(type=="scatter"){
   var options = {
      //style:'bar',
     sort: false,
     sampling:false,
     style:'points',
     drawPoints: {
      size: 5,
      style: 'circle',
     } 
    };  
  };

    // get the div from the DOM that we are going to 
    // put our graph into 
    var container = document.getElementById('visjs');
    // create the graph
    visjsobj = new vis.Graph2d(container, items, options);
    // tell the graph to set up its axes so all data points are shown
    visjsobj.fit();
};


function initNodeVis(teamName, stats){

 if (visjsobj != undefined){
    visjsobj.destroy();
  }

  var ind = 0;
  var year = 1960;
  var myYear = "y" + year;

  // generate an array of items
  // from the graphData collection
  // where each item describes a peice of data currently selected
  // feature
  var nodes = new Array();

  $.each(graphData, function(key, value ){
    if (graphData[myYear][teamName][stats] != undefined)
     {
      var label = "ind: "+ ind;
      label = year + " | " + graphData[myYear][teamName][stats];
      // console.log("this is the label: " + label);
      }   
      var value = graphData[myYear][teamName][stats];

      //get the 2nd stat for the chart
      var date = year + "-01-01";
      var res = graphData[myYear][teamName].championship;

      // here we create the actual object for the visualiser
      // and put it into the items array
      nodes[ind] = {
       id: ind, 
       label: label,
       value: value, 
        //group: 0,
        // slighlty hacky label -- check out the vis-label
      };
      ind ++ ;
      //  console.log("index: " + ind);
      year = 1960 + ind
      // console.log("year: " + year)
      myYear = "";
      myYear = "y" + year;
      // console.log("myYear: " + myYear);
  })

    // edges are used to connect nodes together. 
    // we don't need these for now...
    edges =[
    ];
    // this data will be used to create the visualisation
    var data = {
      nodes: nodes,
      edges: edges
    };
    // options for the visualisation
     var options = {
      nodes: {
        shape: 'star',
        color: '#2277CC',
        fixed: false,
        font: '14px arial red',
        scaling: {
            label: true
        },
        shadow: true
      }

    };
    // get the div from the dom that we'll put the visualisation into
    container = document.getElementById('visjs');
    // create the visualisation
    visjsobj = new vis.Network(container, data, options);
};


