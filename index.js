var fs = require('fs');
var pkg = require('./package.json');
try {
  clientId = fs.readFileSync('/proc/cpuinfo').toString().split('Serial')[1].replace(':', '').trim();
} catch (e) {}
var serverUrl = process.env.SERVER_URL || 'http://localhost:5001';
var socket = require('socket.io-client')(serverUrl);
var PDFDocument = require('pdfkit');
var ipp = require('ipp');
var printer = ipp.Printer('http://127.0.0.1:631/printers/printer');

// socket.on('connect', function() {
//   console.log('socket connect');
// });

socket.on('register', function(fn) {
  fn(clientId);
});

socket.on('order', function(data) {
  if (data.clientId === clientId) {
    var doc = new PDFDocument({margin: 0});

    doc.font('Helvetica', 10).text('Mobile Order:', 10, 10);

    doc.font('Helvetica-Bold', 14).text('Chris', 10, 25);

    doc.font('Helvetica', 10).text('Item: 1 of 1', 10, 60);

    doc.font('Helvetica-Bold', 11).text('Single Origin Pour Over', 10, 90);

    doc.font('Helvetica', 10).text('2 pumps Classic Syrup', 10, 105);

    doc.font('Helvetica', 10).text('Lt Whole Milk', 10, 116);

    doc.font('Helvetica', 10).text('Time: 09:34:23 AM', 10, 140);

    doc.font('Helvetica-Bold', 12).text('Drip', 60, 165);

    doc.font('Helvetica', 8).text('http://getdrip.io', 46, 180);

    doc.output(function(pdf) {
      var msg = {
        "operation-attributes-tag": {
          "requesting-user-name": "",
          "job-name": "",
          "document-format": "application/pdf"
        },
        data: pdf
      };
      printer.execute("Print-Job", msg, function(err, res) {
        console.log(res);
      });
    });
  }
});
