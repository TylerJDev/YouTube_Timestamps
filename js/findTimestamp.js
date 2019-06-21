const c_timestamps = require('./currentTimestamp.js');

function findCurrentTimestamps(currentVideoTime=0) {
  // Check if any timestamps currently exist
  var descriptionContent = document.querySelector('#description > .content')

  if (!descriptionContent.querySelectorAll('a').length) {
    return false; // If no links (timestamps) are found
  }

  var currentLinks = Array.from(descriptionContent.querySelectorAll('a'));
  var timestamps_current = [];

  // Grab the corresponding timestamp text
  currentLinks.forEach(function(curr, index) {
    var val = c_timestamps.timestampToSeconds(curr.textContent);
    if (val >= 0 && typeof val === 'number') {
        curr.classList.add('yt_timestamp_link'); // Add class to proper timestamp link
        timestamps_current.push([curr, grabTimestampText(curr, descriptionContent)]); // timestampToSeconds returns an integer
    }
  });

  // Grab the current track based on currentVideoTime parameter passed
  var currentTimestamp = timestamps_current.filter(currEle => currEle[0].textContent === c_timestamps.determineTimeSlot(currentVideoTime, timestamps_current.map(curr => curr[0].textContent)))
  var timestampObj = {'links_tracks': timestamps_current, 'current_link': currentTimestamp[0][0], 'current_track': currentTimestamp[0][1]};

  // Remove previous selected classes
  Array.from(document.querySelectorAll('a.yt_timestamp_selected'), curr => curr.classList.remove('yt_timestamp_selected'));

  // Add class to current link
  timestampObj.current_link.classList.add('yt_timestamp_selected');

  return timestampObj;
}

function grabTimestampText(ele, descr) {
  var siblings = [ele.previousSibling, ele.nextSibling]; // [0] = Some random text not related, [1] Proper timestamp text
  var descrText = descr.textContent.split('\n');

  var timestampText = descrText.filter(function(curr, idx) {
    if (siblings[0] !== null && curr.indexOf(siblings[0].textContent.trim()) >= 0 && curr.indexOf(ele.textContent) >= 0) {
      return curr;
    } else if (siblings[1] !== null && curr.indexOf(siblings[1].textContent.trim()) >= 0 && curr.indexOf(ele.textContent) >= 0) {
      return curr;
    }
  });

  return timestampText[0].replace(ele.textContent, '').trim();
}

module.exports = {findCurrentTimestamps}
