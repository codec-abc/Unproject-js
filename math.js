// load math.js
var math = require('mathjs');

/*** DATA HERE ***/
var imageWidth = 3264;
var imageHeight = 2448;

var src = [
    {"x" : 1287, "y" : 1194},
    {"x" : 1659, "y" : 1250},
    {"x" : 1617, "y" : 1593},
    {"x" : 1259, "y" : 1535},
];

var dst = [
    {"x" : 0, "y" : 0},
    {"x" : 375, "y" : 0},
    {"x" : 375, "y" : 375},
    {"x" : 0, "y" : 375},
];

/*** CODE HERE ***/

var tl = src[0];
var tr = src[1];
var br = src[2];
var bl = src[3];

// compute the width of the new image, which will be the
// maximum distance between bottom - right and bottom - left
// x - coordinates or the top - right and top - left x - coordinates
var widthA = Math.sqrt((Math.pow((br.x - bl.x), 2.0)) + (Math.pow((br.y - bl.y),2.0)));
var widthB = Math.sqrt((Math.pow((tr.x - tl.x), 2.0)) + (Math.pow((tr.y - tl.y),2.0)));
var maxWidth = Math.max(widthA, widthB);

//compute the height of the new image, which will be the
//maximum distance between the top - right and bottom - right
//y - coordinates or the top - left and bottom - left y - coordinates
var heightA = Math.sqrt((Math.pow((tr.x - br.x), 2.0)) + (Math.pow((tr.y - br.y), 2.0)));
var heightB = Math.sqrt((Math.pow((tl.x - bl.x), 2.0)) + (Math.pow((tl.y - bl.y), 2.0)));
var maxHeight = Math.max(heightA, heightB);

var max2 = Math.max(maxWidth, maxHeight);

var a = [
    [0, 0, 0, 0,   0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0],

    [0, 0, 0, 0,   0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0]
  ];

var b = [
    [0],
    [0],
    [0],
    [0],

    [0],
    [0],
    [0],
    [0],
];

for( var i = 0; i < 4; ++i )
{
    a[i][0] = a[i+4][3] = src[i].x;
    a[i][1] = a[i+4][4] = src[i].y;
    a[i][2] = a[i+4][5] = 1; 
    a[i][3] = a[i][4] = a[i][5] = a[i+4][0] = a[i+4][1] = a[i+4][2] = 0;
    a[i][6] = -src[i].x*dst[i].x;
    a[i][7] = -src[i].y*dst[i].x;
    a[i+4][6] = -src[i].x*dst[i].y;
    a[i+4][7] = -src[i].y*dst[i].y;
    b[i] = dst[i].x;
    b[i+4] = dst[i].y;
}

var matrixA = math.matrix(a);
var matrixB = math.matrix(b);

var matrixTransform1 = math.lusolve(matrixA, matrixB);

var transform = [
    [matrixTransform1._data[0][0], matrixTransform1._data[1][0], matrixTransform1._data[2][0]],
    [matrixTransform1._data[3][0], matrixTransform1._data[4][0], matrixTransform1._data[5][0]],
    [matrixTransform1._data[6][0], matrixTransform1._data[7][0], 1],
];

var matrixTransform = math.matrix(transform);

var brpm = math.multiply(matrixTransform, math.matrix([ [imageWidth],  [imageHeight],  [1] ]));
var blpm = math.multiply(matrixTransform, math.matrix([ [0],          [imageHeight],  [1] ]));
var trpm = math.multiply(matrixTransform, math.matrix([ [imageWidth],  [0],            [1] ]));
var tlpm = math.multiply(matrixTransform, math.matrix([ [0],          [0],            [1] ]));

var minX = Math.min(
    brpm._data[0][0] / brpm._data[2][0], 
    blpm._data[0][0] / blpm._data[2][0], 
    trpm._data[0][0] / trpm._data[2][0],
    tlpm._data[0][0] / tlpm._data[2][0]);

var maxX = Math.max(
    brpm._data[0][0] / brpm._data[2][0],
    blpm._data[0][0] / blpm._data[2][0],
    trpm._data[0][0] / trpm._data[2][0],
    tlpm._data[0][0] / tlpm._data[2][0]);

var minY = Math.min(
    brpm._data[1][0] / brpm._data[2][0],
    blpm._data[1][0] / blpm._data[2][0],
    trpm._data[1][0] / trpm._data[2][0],
    tlpm._data[1][0] / tlpm._data[2][0]);

var maxY = Math.max(
    brpm._data[1][0] / brpm._data[2][0],
    blpm._data[1][0] / blpm._data[2][0],
    trpm._data[1][0] / trpm._data[2][0],
    tlpm._data[1][0] / tlpm._data[2][0]);

var T = [
    [1,0,-minX],
    [0,1,-minY],
    [0,0,1]
];

var matrixT = math.matrix(T);

var TxTransform = math.multiply(matrixT, matrixTransform);

console.log(TxTransform);