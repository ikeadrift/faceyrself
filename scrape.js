var src = document.querySelector('body > script:nth-child(4)').innerHTML;

var section = src.indexOf('ads_preferences_desktop_root');
var start = src.indexOf('[', section);
var end = src.indexOf(']', start);

var dataStr = src.substring(start, end + 1);
var data = JSON.parse(dataStr);

/*var sortedData = {};
for (var i = 0; i < data.length; i++) {
  var interest = data[i];
  if (!sortedData[interest.topic])
    sortedData[interest.topic] = [];
  sortedData[interest.topic].push(interest);
}

console.log(sortedData);*/

chrome.runtime.sendMessage(data);
//var url = chrome.extension.getURL('index.html');
//console.log(url);
//document.location.replace(url);
