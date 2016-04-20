var app = angular.module('chartApp', []);


  app.controller('salesController', ['$scope', '$http', function($scope, $http) {


    var salesData =
    [{
      Totals: {
        Interior: 5310.9,
        Exterior: 47411.01,
        Window: 26725.215,
        Moulding: 1741.07,
        Siding: 476.5,
        Decking: 11469.92,
        Skylight: 10215.76
      },
      Name: "Test User",
      Id: 7
    },
    {
      Totals: {
        Interior: 0,
        Exterior: 0,
        Window: 0,
        Moulding: 0,
        Siding: 0,
        Decking: 0,
        Skylight: 0
      },
      Name: "Test User2",
      Id: 8
    }];

    /*
    var salesData =
    [{
      Totals: { },
      Name: "mail Test",
      Id: 5
    },
    {
      Totals: {
        Interior: 5310.9,
        Exterior: 47411.01,
        Window: 26725.215,
        Moulding: 1741.07,
        Siding: 476.5,
        Decking: 11469.92,
        Skylight: 10215.76
      },
      Name: "Test User",
      Id: 7
    },
    {
      Totals: {
        Skylight: 157.84,
        Window: 6978.52
      },
      Name: "Jason Lindquist",
      Id: 94
    },
    {
      Totals: { },
      Name: "Jason Parchomchuk",
      Id: 262
    },
    {
      Totals: {
        Exterior: 620.65,
        Window: 4491.25,
        Moulding: 93.77,
        Skylight: 751,
        Siding: 471.36
      },
      Name: "Jason Lindquist",
      Id: 300
    },
    {
      Totals: {
        Siding: 3.87
      },
      Name: "Jonny Tester",
      Id: 301
    }];
    */

    $scope.salesData = salesData;

    $http({
      method: 'GET',
      url: 'http://www.fasterbids.com/DataAccess/getordersbysalesperson?USERkey=EP65g4K-8Fg67'
    })
    .success(function(data) {
      $scope.salesData = data;
    })
    .error(function(data) {
      console.log(data);
    });

  }]);


app.directive('linearChart', function($window){
   return{
      restrict:'EA',
      template:"<svg></svg>",
      // scope :{chartData:'@' },
       link: function(scope, elem, attrs){

          // scope.$watch("chartData",function(newValue,oldValue) {
          scope.$watch("salesData",function(newValue,oldValue) {
              //This gets called when data changes.
              // alert("The sales data changed.");

            var data=scope[attrs.chartData];

            // ============================================================
            // loop thru data array
            // ... and create an object whose properties are all Product types in data
            productTypeObj = {};
            data.forEach(function(d){

              for (var property in d.Totals) {
                  if (d.Totals.hasOwnProperty(property)) {
                      productTypeObj[property] = 0;
                  }
              }

            });

             // console.log("productTypeObj");
             // console.log(productTypeObj);


             // loop thru the properties of productTypeObj
             // and create an array of strings of the properties of productTypeObj

              var productTypes = [];

              for (var property in productTypeObj) {
                  if (productTypeObj.hasOwnProperty(property)) {
                      productTypes.push(property);
                  }
              }

              // console.log("productTypes");
              // console.log(productTypes);

             // ============================================================

              //  loop thru data array
              //  If an item/object in the array is missing one of the product types in ProductTypes
              //  ... then add the property to the item/object
             // ============================================================

             data.forEach(function(d){

                 productTypes.forEach(function(productType){

                    if (d.Totals.hasOwnProperty(productType) === false) {
                      d.Totals[productType] = 0;
                    }
                 });
             });


             var padding = 20;
             var pathClass="path";
             var xScale, yScale, xAxisGen, yAxisGen, lineFun;

             var d3 = $window.d3;

             // ============================================================


              // var margin = {top: 20, right: 20, bottom: 30, left: 40},
              //     width = 960 - margin.left - margin.right,
              //     height = 500 - margin.top - margin.bottom;


              var margin = {top: 20, right: 20, bottom: 30, left: 40},
                  width = 480 - margin.left - margin.right,
                  height = 250 - margin.top - margin.bottom;

              // function that translates x data values into x coordinate values
              //  origin 0,0 is at top left corner of svg element
              var x = d3.scale.ordinal()
                  .rangeRoundBands([0, width], 0.1);

              // function that translates x data values into x coordinate values
              //  origin 0,0 is at top left corner of svg element
              var y = d3.scale.linear()
                  .rangeRound([height, 0]);

              // function that translates column data name ? hex color values
              //
              //  change colors later

              //   There are 7 product type items,  so there must be 7 matching colors only
              //
              var colorArray = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
              var color = d3.scale.ordinal()
                  .range(colorArray);

              // labels for x axis are beneath x axis
              var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");

              // labels for y axis are to left of y axis
              var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .tickFormat(d3.format(".2s"));

              var svg = d3.selectAll('g.child').remove();

              var rawSvg=elem.find('svg');

              // var svg = d3.select(rawSvg[0]).selectAll("svg.child");

              // svg.remove();

              // single g group element parent of all other elements in svg

              svg = d3.select(rawSvg[0])
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("class", "child")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                // set domain of color scale
                // this returns all the keys in one object in the array of objects "data"
                // These keys are the column slices names
                //
                //  COLOR DOMAIN
                //
                // Interior: 5310.9,
                // Exterior: 47411.01,
                // Window: 26725.215,
                // Moulding: 1741.07,
                // Siding: 476.5,
                // Decking: 11469.92,
                // Skylight: 10215.76,
                // Siding:

                //     The "domain" of the Totals object is calculated before this point in the code !!
                //
                // {
                //   Totals: {
                //     Interior: 1,
                //     Exterior: 47411.01,
                //     Window: 26725.215,
                //     Moulding: 1741.07,
                //     Siding: 476.5,
                //     Decking: 11469.92,
                //     Skylight: 10215.76
                //     Siding: 1
                //   },
                //   Name: "Test User",
                //   Id: 7
                // }

                // var productTypes = ["Interior", "Exterior", "Window", "Moulding", "Siding", "Decking", "Skylight"];

                if (productTypes.length > colorArray.length) {
                  alert("There are more product types than there are colors.  Need to add more colors");
                }

                // the number of colors must equal the number of product types
                //  There should be same number in both for ordinal() scale

                color.domain(productTypes);

                // for each object in the data array (d)
                // .. create cummulativeSales array and sort it by productVolume
                data.forEach(function(d) {
                  d.cummulativeSales = color.domain().map(function(name) { return {name: name, y0: 0,  productVolume: +d.Totals[name], y1: 0}; });

                  // console.log("d.cummulativeSales");
                  // console.log(d.cummulativeSales);

                 // sort items in cummulativeSales array by productVolume descending
                  d.cummulativeSales.sort(function(a, b) { return b.productVolume - a.productVolume;});

                });

                // for each object in the data array
                // calculate  y0 and y1
                //
                // ... add new key:value pairs to the object
                // ...   cummulativeSales:   an array of objects    (changed  ages --> cummulativeSales)
                // ...   total:  999
                data.forEach(function(d) {
                  var y0 = 0;

                  // loop thru the color domain using the string values as keys to access
                  // ... values in key:value pairs in the object d
                  // ... and calculate running totals of data counts of people in the age categories
                  // ... These are the tops and bottoms of the "stripes" in the column
                  // ... in data units (not translated into y coordinates)
                  // d.cummulativeSales is an array of objects
                  // Each d.cummulativeSales object represents one stripe in the column
                  d.cummulativeSales = d.cummulativeSales.map(function(dObj) { return {name: dObj.name, y0: y0,  productVolume: dObj.productVolume, y1: y0 += dObj.productVolume}; });

                  // top of column in data values (not in y coordinates)
                  d.total = d.cummulativeSales[d.cummulativeSales.length - 1].y1;
                });

                // sort the objects in "data" array in desc order by data values of the top of the column
                data.sort(function(a, b) { return b.total - a.total; });

                // set x domain... which are the salespeople names
                // ... iterate thru all the objects in "data" array
                // ... Get the  values for "Name" key
                x.domain(data.map(function(d) { return d.Name; }));

                // set y domain ...
                // ... iterate thru the objects in data array
                // ... Find the  max value with key = "total"
                y.domain([0, d3.max(data, function(d) { return d.total; })]);

                // add x axis
                // ... translate x axis down by height pixels
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                // add y axis
                // ... fancy code to handle y axis labels
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                  .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Volume");

                // tool tip
                // http://bl.ocks.org/Caged/6476579
                var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  return "<strong style='color:red'>Volume:</strong> <span style='color:red'>" + d.total + "</span>";
                });

                svg.call(tip);


                //  http://javascript.tutorialhorizon.com/2014/11/20/a-visual-explanation-of-the-enter-update-and-exit-selections-in-d3js/
                //  enter() selection - rep­re­sents map­pings to DOM nodes
                //  ...  that will need to be cre­ated in order to map the excess data points.
                //
                //  each of these new g elements is a column
                //  The data for each g element is the object in the data array
                var state = svg.selectAll(".salesperson")
                    .data(data)
                  .enter().append("g")
                    .attr("class", "g")
                    .attr("transform", function(d) { return "translate(" + x(d.Name) + ",0)"; });

              // tool tip
               var columns = svg.selectAll(".g")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
                // ===========================================================

                //  Latest attempt at fix

                // You are appending the text to rect elements -- this isn't valid in SVG
                // and the text won't show up.
                // Instead, append the text either to a g element or the top-level SVG:

                svg.selectAll("text.bar")
                  .data(data)
                .enter().append("text")
                  //.attr("transform", "rotate(-90)")
                  //.attr("class", "bar")
                  .attr("text-anchor", "middle")
                  .attr("x", function(d) { return x(d.Name) + x.rangeBand()/2; })
                  .attr("y", function(d) { return height - 30; })
                  .style("fill", "black")
                  .text(function(d) { return d.Name; });

                // ===========================================================

                // now put set of rect element inside each g element
                //  Iterates over the cummulativeSales array and adds one rect per cummulativeSales element

                // ... rect element has width and height
                // Inherits  data object from parent element
                //
                //  cummulativeSales array elements are the data here

                state.selectAll("rect")
                    .data(function(d) { return d.cummulativeSales; })
                  .enter().append("rect")
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.y1); })
                    .attr("height", function(d) { return y(d.y0) - y(d.y1); })
                    .style("fill", function(d) { return color(d.name); });



                // add fancy legend
                //
                // append some g elements
                //
                // slice does not alter.
                // It returns a shallow copy of elements from the original array.
                // Elements of the original array are copied into the returned array
                var legend = svg.selectAll(".legend")
                    .data(color.domain().slice().reverse())
                  .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                // put rect inside legend g elements with width and height
                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);

                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function(d) { return d; });

          });  // end of  scope.$watch("chartData",function(newValue,oldValue) {
       }   // end of link: function(scope, elem, attrs){

   };   // end of return
});  // app.directive('linearChart', function($window){

