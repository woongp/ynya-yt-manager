/**
 * @OnlyCurrentDoc
 */

/***
 * 주일 예배 영상 Video ID를 가져오는 함수.
 * 매주 일요일 2pm에 실행되도록 스케줄
 */
function getSundayServiceVideoId() {
  var video = getVideoByEventType('completed');
  if (video) {
    console.log('getSundayServiceVideoId', video.id.videoId);
    setVideoId(video.id.videoId);
    var subject = `A live video (ID: ${video.id.videoId}) has been stored`;
    var content = `<h3>Video Information</h3><br/>
                  <b>Video ID</b>: ${video.id.videoId}<br/>
                  <b>Title</b>: ${unescape(video.snippet.title)}<br/>
                  <b>Channel</b>: ${video.snippet.channelTitle}`;
    sendNotification(subject, content);
  }
}

/***
 * 지난 주일 예배 영상을 unlist하는 함수.
 * 원하는 시간에 실행되도록 스케줄 세팅
 */
function unlistVideo() {
  updateVideoPrivacyStatus('unlisted');
}

/***
 * 지난 주일 예배 영상을 unlist하는 함수.
 * 원하는 시간에 실행되도록 스케줄 세팅
 */
function privateVideo() {
  updateVideoPrivacyStatus('private');
}

/***
 * Video의 PrivacyStatus를 변경하는 함수.
 *  - ScriptProperties에 저장된 Video ID를 사용함.
 */
function updateVideoPrivacyStatus(status) {
  var VideoId = getVideoId();
  var part = 'id,snippet,status';
  var params = {'id': VideoId};
  
  var response = YouTube.Videos.list(part, params);
  var video = response.items[0];
  console.log("video.id", video.id);
  console.log("video.snippet.title", video.snippet.title);

  var resource = {
      status: {
        privacyStatus: status
      },
      id: VideoId
    };
  var res = YouTube.Videos.update(resource, 'id,status');
  console.log("video.status.privacyStatus has been updated", res.status.privacyStatus, 'from', video.status.privacyStatus);
  var subject = `A video (ID: ${VideoId}) status has been updated`;
  var content = `<h3>Video Information</h3><br/>
                  <b>Video ID</b>: ${VideoId}<br/>
                  <b>Title</b>: ${unescape(video.snippet.title)}<br/>
                  <b>Privacy Status</b>: ${status}<br/>
                  <b>Channel</b>: ${video.snippet.channelTitle}`;
  sendNotification(subject, content);
}

/***
 * EventType으로 비디오를 검색하는 함수.
 * available types: live, completed
 */
function getVideoByEventType(type) {
  var channelId = 'UCZPUVbo6OJS0Fjc4UpNwRwQ';
  var results = YouTube.Search.list('id,snippet', {channelId: channelId, eventType: type, type: 'video', maxResults: 25});
  if (results.items.length > 0) {
    var video = results.items[results.items.length-1];
    console.log("getVideoIdByEventType:"+type, video.id.videoId);
    console.log("video.snippet.title", video.snippet.title);
    return video;
  }
  return null;
}

/***
 * Video ID를 ScriptProperties에 저장하는 함수
 */
function setVideoId(id) {
  var scriptProperties = PropertiesService.getScriptProperties();
  if (prevVideoId) {
    var prevVideoId = scriptProperties.getProperty("videoId");
    scriptProperties.setProperty("prevVideoId", prevVideoId);
  }
  scriptProperties.setProperty("videoId", id);
}

/***
 * ScriptProperties에 저장된 Video ID를 가져오는 함수
 *   ScriptProperties에 저장된 Video ID가 없을 경우 completed인 마지막 라이브 스트리밍 정보를 가져옮.
 */
function getVideoId() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var videoId = scriptProperties.getProperty("videoId");
  if (videoId == null) {
    var video = getVideoByEventType('completed');
    videoId = video.id.videoId;
  }
  return videoId;
}

/***
 * 이메일로 알림을 보내는 함수
 */
function sendNotification(subject, message) {
  // MailApp.sendEmail('woongp@gmail.com', subject, message);
  MailApp.sendEmail({
    to: "ynya.creative@gmail.com",
    subject: subject,
    htmlBody: message
  });
}

function test() {
  // sendNotification('test send email from apps scripts', 'body');
  // setVideoId('yoS7S7VROv0');
  // console.log(getVideoId());
  // var scriptProperties = PropertiesService.getScriptProperties();
  // scriptProperties.deleteProperty('videoId');
  // getVideoIdByEventType('completed');
}
