import './index.css';
/*
var height = document.documentElement.clientHeight;
var width = document.documentElement.clientWidth;
$('#result').width(width - 11);
$('#result').height(height - 100);
k('#introduction').width(width - 11);
$('#introduction').height(height - 100);

$('#search-wrap').removeClass('start');
$('#search-wrap').addClass('show');

var stopSearchAnimation = false;
var autoTyping = ['The magnifier of classical music'];

function searchPost(type, keyword) {
  for (var i in audios) {
    audios[i].pause();
  }
  audios = [];
  $('#result-content').html('<div id="result-loading-wrap"><div id="result-loading"></div></div>');
  var keyword = keyword || $('#input-search').val();
  var type = type || $('.tab.selected').attr('data-type');
  $.ajax({
    url: '/search',
    type: 'post',
    data: {
      type: type,
      keyword: keyword,
    },
    timeout: 6000,
    success: function(res) {
      if (res.code != 0) {
        alert(res.msg);
        return;
      }
      history.pushState({}, $('#input-search').val(), '/s/' + type + '/' + encodeURIComponent(keyword));
      res.ratio = ((width - 11 - 10) / 200) * 100;
      $('#result-content').html(template('template-results', res));
      if ($('.tab.selected').attr('data-type') == 'audios') {
        $('#result-content')
          .find('audio')
          .each(function() {
            audios[$(this).attr('data-url')] = audiojs.create($(this)[0], {
              preload: false,
              css: false,
              createPlayer: {
                markup: false,
                playPauseClass: 'play-pauseZ',
                scrubberClass: 'scrubberZ',
                progressClass: 'progressZ',
                loaderClass: 'loadedZ',
                timeClass: 'timeZ',
                durationClass: 'durationZ',
                playedClass: 'playedZ',
                errorMessageClass: 'error-messageZ',
                playingClass: 'playingZ',
                loadingClass: 'loadingZ',
                errorClass: 'errorZ',
              },
            });
          });
      }
    },
    error: function() {
      $('#result-content').html('<%=language.busy%>');
    },
  });
}

var audios = {};

function search(keyword) {
  $('#input-search').blur();
  hideNavs();
  $('#search-wrap').addClass('show');
  if ($('#result-wrap').hasClass('show')) {
    $('#result-wrap').removeClass('show');
    setTimeout(function() {
      $('#result-wrap').addClass('show');
    }, 500);
  } else {
    $('#result-wrap').addClass('show');
  }
  searchPost();
}

var inputstr = '';
function changeInput(inputstr) {
  return function() {
    if (!stopSearchAnimation) {
      $('#input-search').val(inputstr);
    }
  };
}

var delay = 0;
for (var i in autoTyping) {
  $('#input-search').val('');
  inputstr = '';
  for (var j in autoTyping[i]) {
    inputstr += autoTyping[i][j];
    delay += 100;
    setTimeout(changeInput(inputstr), delay);
  }
}

function initMusicWall() {
  var ri = 0;
  var rj = -70;
  var zindex = 0;
  $.get('/random', function(res) {
    if (res.code != 0) {
      alert(res.msg);
      return;
    }
    var audios = res.data;
    var counter = 0;
    for (var i = 0; i < 6; ++i) {
      for (var j = 0; j < 15; ++j, ++counter) {
        var audio = audios[counter]._source;
        if (j > 14) break;

        var rx = rj;
        var ry = (ri + (rj / 80) * 360) % 360;
        var p = rotation2Position(300, rx, ry);

        snot.loadSprites([
          {
            template: 'template-sprite-music',
            spriteType: 'sprite-music',
            id: '123',

            x: p[0],
            y: p[1],
            z: p[2],

            rx: rx,
            ry: ry,
            song_id: audio.other_id.qqmusic_song_id,
            song_name: audio.name.en || audio.name.cn,
            player: audio.players[0].name.en || audio.players[0].name.cn,
            album_name: audio.album_name.en || audio.album_name.cn,
            url: audio.resources[0].url,
            album_thumbnail: audio.album_thumbnail || '/images/gray.jpg',
            album_image: audio.album_image || '/images/gray.jpg',
            zindex: ++zindex,
          },
        ]);

        //"http://tsmusic24.tc.qq.com/"+clist[j].songid+".mp3";

        if (rj >= 70) {
          rj = -70;
          ri += 60;
        } else {
          rj += 10;
        }
      }
    }
  });
}

$('#input-search').focus(function() {
  $(this).addClass('focus');
});

$('#input-search').blur(function() {
  $(this).removeClass('focus');
});

function nothing(e) {
  e.stopPropagation();
}
function moreInfo(e) {
  e.stopPropagation();
  e.preventDefault();
  stopSearchAnimation = true;
  $('#input-search').val($('#music-songname').text());
  search($('#music-songname').text());
  $('#sprite-music-content').offsetWidth = $('#sprite-music-content').offsetWidth;
  $('#sprite-music-content').removeClass('show');
}
function hideDetails() {
  $('#sprite-music-content').offsetWidth = $('#sprite-music-content').offsetWidth;
  $('#sprite-music-content').removeClass('show');
}
function clearSearch() {
  if (stopSearchAnimation == false) {
    $('#input-search').val('');
    stopSearchAnimation = true;
  }
  if ($('#input-search').val() == autoTyping[0]) {
    $('#input-search').val('');
  }
}
$('#input-search').on('focus', function() {
  $('#search-wrap').addClass('showbtn');
});

$('#input-search').on('keypress', function(e) {
  var keyCode = null;
  if (e.which) keyCode = e.which;
  else if (e.keyCode) keyCode = e.keyCode;

  if (keyCode == 13) {
    search($(this).val());
    return false;
  }
});

function switchTab() {
  if (contentScrolling) return;
  $('.tab').removeClass('selected');
  $(this).addClass('selected');
  searchPost();
}

function hideResults() {
  $('#result-wrap').removeClass('show');
}
function showNavs() {
  var delay = 0;
  $('.nav-wrap').each(function() {
    var self = $(this);
    setTimeout(function() {
      self.addClass('show');
    }, delay);
  });
  //$('#result-wrap').removeClass('show');
}
function hideNavs() {
  var delay = 0;
  $('.nav-wrap').each(function() {
    var self = $(this);
    setTimeout(function() {
      self.removeClass('show');
    }, delay);
  });
}
$('#logo').addClass('click');
function magnifierClick() {
  $('#logo').removeClass();
  $('#logo')[0].offsetWidth = $('#logo')[0].offsetWidth;
  $('#logo').addClass('click');
  $('#input-search').blur();
  if ($('.nav-wrap').hasClass('show')) {
    hideNavs();
  } else {
    $('#search-wrap').addClass('show');
    showNavs();
  }
}

function hideSearch() {
  $('#search-wrap').removeClass('show');
  $('#search-wrap').removeClass('start');
}

function showAbout() {
  hideDetails();
  hideNavs();
  $('#result-wrap').removeClass('show');
  $('#introduction-wrap').removeClass('show');
  setTimeout(function() {
    $('#introduction-title').text('<%-language.about%>');
    $('#introduction-wrap').addClass('show');
    $('#introduction-content').html('<%-language.about_content%>');
  }, 400);
}
function showVolunteer() {
  hideDetails();
  hideNavs();
  $('#result-wrap').removeClass('show');
  $('#introduction-wrap').removeClass('show');
  setTimeout(function() {
    $('#introduction-title').text('<%-language.volunteer%>');
    $('#introduction-wrap').addClass('show');
    $('#introduction-content').html('<%-language.volunteer_content%>');
  }, 400);
}
function hideIntroduction() {
  $('#introduction-wrap').removeClass('show');
}
function showHelp() {
  hideDetails();
  hideNavs();
  $('#introduction-wrap').removeClass('show');
  $('#result-wrap').removeClass('show');
  setTimeout(function() {
    $('#introduction-title').text('<%-language.help%>');
    $('#introduction-wrap').addClass('show');
    $('#introduction-content').html('<%-language.help_content%>');
  }, 400);
}

function hideAll() {
  hideNavs();
  hideSearch();
  hideIntroduction();
  hideDetails();
  $('#result-wrap').removeClass('show');
}

function showIframe() {
  stopBackgroundMusic();
  if ($(this).hasClass('playing')) {
    return;
  }
  if (videoDom) {
    videoDom.removeClass('playing');
    videoDom.html(videoHtml);
  }
  $(this).addClass('playing');
  hideDetails();
  hideNavs();
  var self = $(this);
  videoDom = self;
  videoHtml = self.html();

  parent = $(this).closest('.result-video');
  id = parent.attr('data-id');
  self.html(template('template-youku', { youku_id: id, height: self.height(), width: 280 }));
  YKU.Player('youkuplayer' + id, {
    styleid: '0',
    client_id: '<%=youku_client_id%>',
    vid: id,
  });
}

var videoDom;
var videoHtml;

function stopBackgroundMusic(e) {
  if (e) e.stopPropagation();
  if (audio && audio.playing) {
    audio.playPause();
  }
}

function stopAllMusic() {
  stopBackgroundMusic();
  for (var i in audios) {
    if (audios[i].playing) {
      audios[i].playPause();
    }
  }
}
function searchClick() {
  hideDetails();
  $('#introduction-wrap').removeClass('show');
  hideNavs();
  search($('#input-search').val());
}

var audio = false;
var contentScrolling = false;
var maxfov = 120,
  fov = 120,
  minfov = 120;

var bodyDom = $('body');
var result_wrap = $('#result-wrap');
if (isMobile()) {
  maxfov = 100;
  fov = 100;
  minfov = 100;

  bindClick($('#sprite-music-content'), hideDetails);
  bindClick($('#music-more'), moreInfo);
  bindClick($('#music-info'), nothing);
  bindClick($('#music-album'), nothing);

  bindClick($('#input-search'), clearSearch);
  bindClick($('#btn-search'), searchClick);
  bindClick($('.tab'), switchTab);

  bindClick($('#magnifier'), magnifierClick);
  bindClick($('.about'), showAbout);
  bindClick($('.volunteer'), showVolunteer);
  bindClick($('.help'), showHelp);
  bindClick($('.musicwall'), hideAll);

  bindClick($('.video-wrap'), showIframe, result_wrap, '.video-wrap');
  bindClick($('.result-audio'), stopBackgroundMusic, result_wrap, '.result-audio');

  $('#result-content').on('touchstart', function() {
    contentScrolling = true;
  });
  $('#result-content').on('touchend', function() {
    contentScrolling = false;
  });

  $('.play-pauseZ').on('touchend', nothing);
  $('.play-pauseZ').on('touchstart', nothing);
  $('.scrubberZ').on('touchend', nothing);
  $('.scrubberZ').on('touchstart', nothing);
  $('.user').on('touchstart', function() {
    location.href = '/rating';
  });
} else {
  $('.user').on('mouseup', function() {
    location.href = '/rating';
  });
  $('#sprite-music-content').on('mouseup', hideDetails);
  $('#music-more').on('mouseup', moreInfo);
  $('#music-album').on('mouseup', nothing);
  $('#input-search').on('mouseup', clearSearch);
  $('#btn-search').on('mouseup', function() {
    hideDetails();
    $('#introduction-wrap').removeClass('show');
    hideNavs();
    search($('#input-search').val());
  });
  $('.tab').on('mouseup', switchTab);
  $('#magnifier').on('mouseup', magnifierClick);
  $('.about').on('mouseup', showAbout);
  $('.musicwall').on('mouseup', hideAll);
  $('.volunteer').on('mouseup', showVolunteer);
  $('.help').on('mouseup', showHelp);
  bodyDom.on('click', '.video-wrap', showIframe, true);
  result_wrap.delegate('.result-audio', 'click', stopBackgroundMusic);
}

function randomPlay() {
  if ($('#result-wrap').hasClass('show')) {
    return;
  }
  hideDetails();
  setTimeout(function() {
    var random = parseInt(Math.random() * $('.sprite').size());
    ////////
  }, 300);
}

function onSpriteClick(data) {
  snot.autoRotation = 0;
  snot.setRx(data.rx, true);
  snot.setRy(data.ry, true);
  stopAllMusic();
  hideNavs();
  hideIntroduction();
  $('#search-wrap').removeClass('show');
  $('#result-wrap').removeClass('show');
  setTimeout(function() {
    $('#music-album').css('background-image', 'url(' + data.album_thumbnail + ')');
    $('#music-album-full').css('background-image', 'url(' + data.album_image + ')');
    $('#music-songname').text(data.song_name);
    $('#music-albumname').text(data.album_name);
    $('#music-singer').text(data.player);
    $('#sprite-music-content').offsetWidth = $('#sprite-music-content').offsetWidth;
    $('#sprite-music-content .scrubberZ').width(271);
    $('#sprite-music-content').addClass('show');
  }, 300);
  if (!audio) {
    audio = audiojs.create($('#audio')[0], {
      css: false,
      createPlayer: {
        markup: false,
        playPauseClass: 'play-pauseZ',
        scrubberClass: 'scrubberZ',
        progressClass: 'progressZ',
        loaderClass: 'loadedZ',
        timeClass: 'timeZ',
        durationClass: 'durationZ',
        playedClass: 'playedZ',
        errorMessageClass: 'error-messageZ',
        playingClass: 'playingZ',
        loadingClass: 'loadingZ',
        errorClass: 'errorZ',
      },
      trackEnded: function() {
        randomPlay();
      },
    });
  }
}

snot.init({
  maxfov: maxfov,
  minfov: minfov,
  fov: fov,
  callback: initMusicWall,
  autoRotation: 0.1,
  onClick: function() {},
  minDetectDistance: 30,
  onSpriteClick: onSpriteClick,
});
*/
/*
  <script id="template-results" type="text/html">
        <#if(
        (scores==undefined||(scores&&scores.length==0))&&
        (videos==undefined||(videos&&videos.length==0))&&
        (audios==undefined||(audios&&audios.length==0))){#>
            <%=i18n.noResult%>
        <#}#>
        <#for(var i in scores){#>
            <a className="result-score" target="_Blank" href="<#=scores[i].link#>" data-source="<#=scores[i].source#>"><#=scores[i].title#></a>
        <#}#>
        <#for(var i in videos){#>
            <div className="result-video" data-id="<#=videos[i].id#>" target="_Blank" data-title="<#=videos[i].title#>" data-source="<#=videos[i].source#>" data-link="<#=videos[i].link#>" >
                <div className="result-video-title" onclick="window.open('<#=videos[i].link#>')"><#=videos[i].source#> </div>
                <div className="video-wrap">
                    <img width="<#=ratio#>%" src="<#=videos[i].thumbnail#>">
                    <div className="video-info">
                        <#=videos[i].title#>
                    </div>
                </div>
            </div>
        <#}#>
        <#for(var i in audios){#>
            <a className="result-audio"  target="_Blank" data-id="<#=audios[i].song_id#>" data-source="<#=audios[i].source#>">
                <div className="result-audio-title" onclick="window.open('<#=audios[i].song_link#>')"><#=audios[i].source#> </div>
                <div style="display:-webkit-box;-webkit-box-orient:horizontal;padding:10px;width:100%;box-sizing:border-box;">
                    <img className="result-audio-img" width="150" height="150" src="<#=audios[i].album_big#>">
                    <div className="audio-info">
                        <div><#=audios[i].song_name#></div>
                        <div><#=audios[i].album_name#></div>
                        <div><#=audios[i].player#></div>
                    </div>
                </div>
            </a>
        <#}#>
  </script>
  <script id="template-youku" type="text/html">
    <div id="youkuplayer<#=youku_id#>" style="height:<#=height#>px;width:100%;display:block;"></div>
  </script>
  <script id="template-sprite-music" type="text/html">
    <div className="sprite-music-wrap">
        <div type="<#=spriteType#>" className="sprite-music" style="z-index:<#=zindex#>;background-image:url(<#=album_thumbnail#>);background-size:100%"></div>
    </div>
  </script>
  */
import React from 'react';
import ReactDOM from 'react-dom';

import config from '../config';

const { i18n } = config;

const Navigator = ({}) => (
  <div>
    <div className="nav-wrap musicwall">
      <div className="nav-stick">{i18n.musicWall}</div>
    </div>
    <div className="nav-wrap volunteer">
      <div className="nav-stick">{i18n.volunteer}</div>
    </div>
    <div className="nav-wrap about">
      <div className="nav-stick">{i18n.about}</div>
    </div>
    <div className="nav-wrap help">
      <div className="nav-stick">{i18n.help}</div>
    </div>
  </div>
);

const SearchInput = ({}) => (
  <div id="search-wrap" className="start">
    <div className="input-wrap">
      <div className="input-box">
        <input id="input-search" />
      </div>
      <button id="btn-search">{i18n.search}</button>
    </div>
  </div>
);

const SearchResult = ({}) => (
  <div id="result-wrap">
    <div id="result-stick"></div>
    <div id="result">
      <div className="tabs">
        <div data-type="scores" className="tab">
          {i18n.scores}
        </div>
        <div data-type="videos" className="tab">
          {i18n.videos}
        </div>
        <div data-type="audios" className="tab selected">
          {i18n.audios}
        </div>
      </div>
      <div id="result-content"></div>
    </div>
  </div>
);

class App extends React.Component<{}, {}> {
  render() {
    return (
      <div id="frame">
        <a id="logo">
          <div id="magnifier">
            <div id="stick"></div>
          </div>
        </a>
        <SearchInput/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
