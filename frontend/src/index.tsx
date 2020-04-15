import './index.css';

import { sleep } from './utils';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const height = document.documentElement.clientHeight;
const width = document.documentElement.clientWidth;
/*
$('#result').width(width - 11);
$('#result').height(height - 100);
k('#introduction').width(width - 11);
$('#introduction').height(height - 100);

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
  */

import config from '../config';

const { i18n, backend_domain, backend_port } = config;

template.config('openTag', '<#');
template.config('closeTag', '#>');

const Navigator = ({ show }: { show: boolean }) => (
  <div className={`navigator ${show ? 'show' : ''}`}>
    <div className="nav-wrap">
      <div className="nav-stick">{i18n.musicWall}</div>
    </div>
    <div className="nav-wrap">
      <div className="nav-stick">{i18n.volunteer}</div>
    </div>
    <div className="nav-wrap">
      <div className="nav-stick">{i18n.about}</div>
    </div>
    <div className="nav-wrap">
      <div className="nav-stick">{i18n.help}</div>
    </div>
  </div>
);

const SearchInput = ({ onSearch }: { onSearch: (keyword: string) => void }) => {
  const placeholder = 'The magnifier of classical music';
  const [stopAnimation, setStopAnimation] = useState(false);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (stopAnimation || index === placeholder.length) {
        clearInterval(interval);
        return;
      }
      setIndex(idx => idx + 1);
    }, 100);
  }, []);
  return (
    <div id="search-wrap">
      <div className="input-wrap">
        <div className="input-box">
          <input
            onClick={() => {
              setStopAnimation(v => true);
              setIndex(placeholder.length);
            }}
            onInput={e => {
              e.persist();
              const v = e.currentTarget.value;
              setValue(a => v);
            }}
            onChange={e => {
              e.persist();
              const v = e.currentTarget.value;
              setValue(a => v);
            }}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                onSearch(value);
              }
            }}
            value={value}
            id="input-search"
            placeholder={placeholder.substr(0, index)}
          />
        </div>
        {value ? (
          <button id="btn-search" onClick={() => onSearch(value)}>
            {i18n.search}
          </button>
        ) : null}
      </div>
    </div>
  );
};

const SearchResult = ({ show, tab, data }: { show: boolean, tab: Tab, data: Result }) => (
  <div id="result-wrap" className={show ? 'show' : ''}>
    <div id="result-stick"></div>
    <div id="result">
      <div className="tabs">
        <div data-type="scores" className={`tab ${tab === Tab.score ? 'selected' : ''}`}>
          {i18n.scores}
        </div>
        <div data-type="videos" className={`tab ${tab === Tab.video ? 'selected' : ''}`}>
          {i18n.videos}
        </div>
        <div data-type="audios" className={`tab ${tab === Tab.audio ? 'selected' : ''}`}>
          {i18n.audios}
        </div>
      </div>
      <div id="result-content">
			</div>
    </div>
  </div>
);

let maxfov = 120,
  fov = 120,
  minfov = 120;

if (isMobile()) {
  maxfov = 100;
  fov = 100;
  minfov = 100;
}

type Audio = {
  id: number;
  uid: string;
  reference_url: string;
  player: string;
  album_name: string;
  name: string;
  album_sd: string;
  album_hd: string;
  source: string;
};

const MusicWallDetail = ({
  data,
  show,
  hideOnClick,
	moreOnClick,
}: {
  hideOnClick: Function;
	moreOnClick: Function;
  data?: Audio;
  show: boolean;
}) => (
  <div
    id="sprite-music-content"
    className={show ? 'show' : ''}
    onClick={e => hideOnClick()}>
    <div id="music-wrap">
      <div id="music-album" onClick={e => e.stopPropagation()}>
        <div
          id="music-album-full"
          style={{
            backgroundImage: `url(${data ? data.album_hd : ''})`,
          }}></div>
      </div>
      <div id="music-info-wrap">
        <div id="music-info">
          <div id="music-songname">{data ? data.name : ''}</div>
          <div id="music-singer">{data ? data.player : ''}</div>
          <div id="music-albumname">{data ? data.album_name : ''}</div>
        </div>
        <div id="music-more" onClick={() => moreOnClick(data ? data.name : '')}>{i18n.more}</div>
      </div>
    </div>
  </div>
);

enum Tab {
  audio = 'audio',
  video = 'video',
  score = 'score',
}

type Video = {
  link: string;
  thumbnail: string;
  title: string;
  id: string;
};

type Score = {
  link: string;
  title: string;
  source: string;
  relevance?: number;
};

type SearchType = 'scores' | 'scores_imslp' | 'videos' | 'audios';
type Result = {
  code: number;
  type: SearchType;
  videos: Video[];
  audios: Audio[];
  scores: Score[];
};

const App = ({}) => {
  const [active_id, set_active_id] = useState(0);
  const [show_navigator, set_navigator_visibility] = useState(false);
  const [show_result, set_result_visibility] = useState(false);
  const [tab, set_tab] = useState<Tab>(Tab.audio);
  const [data, set_data] = useState<Audio[]>([]);
  const [result_loading, set_result_loading] = useState(false);
  const [result_data, set_result_data] = useState<Result>({
    code: -1,
    type: 'scores',
    videos: [],
    audios: [],
    scores: [],
  });
  async function init() {
    const sprite_on_click = async (data: any) => {
      snot.autoRotation = 0;
      snot.setRx(data.rx, true);
      snot.setRy(data.ry, true);
      await sleep(300);
      set_active_id(state => data.id);
      set_navigator_visibility(state => false);
    };
    await new Promise(resolve =>
      snot.init({
        maxfov: maxfov,
        minfov: minfov,
        fov: fov,
        callback: resolve,
        autoRotation: 0.1,
        onClick: function() {},
        minDetectDistance: 30,
        onSpriteClick: sprite_on_click,
      })
    );

    const res = await (
      await fetch(`${backend_domain}:${backend_port}/random`)
    ).json();
    let ri = 0;
    let rj = -70;
    let zindex = 0;

    if (res.code != 0) {
      alert(res.msg);
      return;
    }

    var audios = res.data;
    set_data(state => res.data);
    var counter = 0;
    for (let i = 0; i < 6; ++i) {
      for (let j = 0; j < 15; ++j, ++counter) {
        var audio = audios[counter];
        if (j > 14) break;

        var rx = rj;
        var ry = (ri + (rj / 80) * 360) % 360;
        var p = rotation2Position(300, rx, ry);

        snot.loadSprites([
          {
            template: 'template-sprite-music',
            spriteType: 'sprite-music',
            id: audio.id,

            x: p[0],
            y: p[1],
            z: p[2],

            rx,
            ry,
            album_thumbnail: audio.album_sd,
            zindex: ++zindex,
          },
        ]);

        if (rj >= 70) {
          rj = -70;
          ri += 60;
        } else {
          rj += 10;
        }
      }
    }
  }
  	// $('#result-content').html('<div id="result-loading-wrap"><div id="result-loading"></div></div>');
	async function do_search(keyword: string) {
    const res = await (
      await fetch(`${backend_domain}:${backend_port}/search`, {
			method: 'POST',
mode: 'cors',
cache: 'no-cache',
			headers: {
    		'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				type: tab,
				keyword,
				page: 1,
			})
		})
    ).json();
		console.log(res);
  	if (res.code !== 0) {
  	  alert(res.msg);
  	  return;
  	}
		set_result_loading(s => false);
		set_result_data(s => res);
	}
do_search('asd');
  React.useEffect(() => {
    init();
  }, []);
  const logo_ref = React.useRef(null);
  return (
    <React.Fragment>
      <div id="head">
        <div
          id="logo"
          ref={logo_ref}
          onClick={async () => {
            const e = logo_ref.current;
            set_navigator_visibility(v => !v);
          }}>
          <div
            id="magnifier"
            style={{
              backgroundImage: `url(${config.cdn_prefix}/m_gray.jpg)`,
            }}>
            <div id="stick"></div>
          </div>
        </div>
        <SearchInput onSearch={(keyword: string) => console.log(keyword)} />
        <Navigator show={show_navigator} />
      </div>
      <MusicWallDetail
        show={!!active_id}
        hideOnClick={() => set_active_id(state => 0)}
        moreOnClick={(keyword: string) => do_search(keyword)}
        data={data.filter(i => i.id === active_id)[0]}
      />
      <SearchResult show={show_result} tab={tab} data={result_data} />
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
