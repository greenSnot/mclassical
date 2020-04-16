import './index.css';

import { sleep } from './utils';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import config from '../config';

const { i18n, backend_domain, backend_port } = config;

template.config('openTag', '<#');
template.config('closeTag', '#>');

enum NavType {
  musicWall,
  lab,
  about,
  help,
}

const Navigator = ({
  show,
  on_click,
}: {
  show: boolean;
  on_click: (type: NavType) => void;
}) => (
  <div className={`navigator ${show ? 'show' : ''}`}>
    <div className="nav-wrap">
      <div className="nav-stick" onClick={() => on_click(NavType.musicWall)}>
        {i18n.musicWall}
      </div>
    </div>
    <div className="nav-wrap">
      <div className="nav-stick" onClick={() => on_click(NavType.lab)}>
        {i18n.lab}
      </div>
    </div>
    <div className="nav-wrap">
      <div className="nav-stick" onClick={() => on_click(NavType.about)}>
        {i18n.about}
      </div>
    </div>
    <div className="nav-wrap">
      <div className="nav-stick" onClick={() => on_click(NavType.help)}>
        {i18n.help}
      </div>
    </div>
  </div>
);

const SearchInput = ({
  onSearch,
  keyword,
}: {
  onSearch: (keyword: string) => void;
  keyword: string;
}) => {
  const placeholder = 'The magnifier of classical music';
  const [stopAnimation, setStopAnimation] = useState(false);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(keyword);
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (stopAnimation || index === placeholder.length) {
        clearInterval(interval);
        return;
      }
      setIndex(idx => idx + 1);
    }, 100);
  }, []);
  React.useEffect(() => {
    setValue(state => keyword);
  }, [keyword]);
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

const Search = (props: {
  show: boolean;
  keyword: string;
  tab?: Tab;
  text?: string;
  text_title?: string;
}) => {
  const [tab, set_tab] = useState<Tab>(props.tab || Tab.audio);
  const [loading, set_loading] = useState(false);
  const [page, set_page] = useState(1);
  const [result_data, set_result_data] = useState<Result>({
    code: -1,
    type: 'scores',
    videos: [],
    audios: [],
    scores: [],
  });

  const { keyword, show } = props;

  async function do_search() {
    set_loading(s => true);
    const res = await (
      await fetch(`${backend_domain}:${backend_port}/search`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: tab,
          keyword,
          page,
        }),
      })
    ).json();
    if (res.code !== 0) {
      alert(res.msg);
      return;
    }
    set_loading(s => false);
    set_result_data(s => res);
  }

  React.useEffect(() => {
    if (keyword) {
      do_search();
    }
  }, [keyword, tab]);

  const SearchResult = () => (
    <React.Fragment>
      <div className="tabs">
        <div
          data-type="scores"
          onClick={() => {
            set_tab(state => Tab.score);
          }}
          className={`tab ${tab === Tab.score ? 'selected' : ''}`}>
          {i18n.scores}
        </div>
        <div
          data-type="videos"
          onClick={async () => {
            await set_tab(state => Tab.video);
          }}
          className={`tab ${tab === Tab.video ? 'selected' : ''}`}>
          {i18n.videos}
        </div>
        <div
          data-type="audios"
          onClick={() => {
            set_tab(state => Tab.audio);
          }}
          className={`tab ${tab === Tab.audio ? 'selected' : ''}`}>
          {i18n.audios}
        </div>
      </div>
      <div id="result-content">
        {loading ? (
          <div id="result-loading-wrap">
            <div id="result-loading"></div>
          </div>
        ) : null}
        {tab === Tab.audio
          ? result_data.audios.map(i => (
              <a className="result-audio" target="_Blank" key={i.id}>
                <div
                  className="result-audio-title"
                  onClick={() => window.open(i.reference_url)}>
                  {i.source}
                </div>
                <div className="result-audio-info-wrap">
                  <img
                    className="result-audio-img"
                    width="150"
                    height="150"
                    src={i.album_hd}
                  />
                  <div className="audio-info">
                    <div>{i.name}</div>
                    <div>{i.album_name}</div>
                    <div>{i.player}</div>
                  </div>
                </div>
              </a>
            ))
          : null}
        {tab === Tab.video
          ? result_data.videos.map(i => (
              <div className="result-video" key={i.id}>
                <div
                  className="result-video-title"
                  onClick={() => window.open(i.link)}>
                  {i.source}
                </div>
                <div
                  className="video-wrap"
                  onClick={() => {
                    YKU.Player(`youku-${i.id}`, {
                      styleid: '0',
                      client_id: config.youku.client_id,
                      vid: i.id,
                    });
                  }}>
                  <img
                    src={i.thumbnail}
                    style={{ width: '100%', display: 'block' }}
                  />
                  <div className="video-info">{i.title}</div>
                  <div
                    id={`youku-${i.id}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: '100%',
                    }}></div>
                </div>
              </div>
            ))
          : null}
        {tab === Tab.score
          ? result_data.scores.map(i => (
              <a
                className="result-score"
                key={i.id}
                target="_Blank"
                href={i.link}>
                {i.title}
              </a>
            ))
          : null}
      </div>
    </React.Fragment>
  );
  return (
    <div id="result-wrap" className={show ? 'show' : ''}>
      <div id="result-stick"></div>
      <div id="result">
        {props.text ? (
          <React.Fragment>
            <div className="info-title">{props.text_title}</div>
            <div className="result-info">{props.text}</div>
          </React.Fragment>
        ) : (
          <SearchResult />
        )}
      </div>
    </div>
  );
};

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
        <div id="music-more" onClick={() => moreOnClick(data ? data.name : '')}>
          {i18n.more}
        </div>
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
  source: string;
  id: string;
};

type Score = {
  id: number;
  link: string;
  title: string;
  source: string;
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
  const [show_search, set_search_visibility] = useState(false);
  const [data, set_data] = useState<Audio[]>([]);
  const [keyword, set_keyword] = useState('');
  const [text, set_text] = useState('');
  const [text_title, set_text_title] = useState('');
  async function init() {
    const sprite_on_click = async (data: any) => {
      snot.autoRotation = 0;
      snot.setRx(data.rx, true);
      snot.setRy(data.ry, true);
      await sleep(300);
      set_active_id(state => data.id);
			hide_search();
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
  React.useEffect(() => {
    init();
  }, []);

  async function hide_search() {
    set_search_visibility(state => false);
    set_text(state => '');
    await sleep(600);
  }
  async function search(keyword: string) {
    if (show_search) {
      await hide_search();
    }
    set_keyword(state => keyword);
    set_search_visibility(state => true);
  }
  async function set_search_text(title: string, t: string) {
    if (show_search) {
      await hide_search();
    }
    set_text(state => t);
    set_text_title(state => title);
    set_search_visibility(state => true);
  }

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
        <SearchInput
          keyword={keyword}
          onSearch={(keyword: string) => {
            search(keyword);
          }}
        />
        <Navigator
          show={show_navigator}
          on_click={(type: NavType) => {
            set_navigator_visibility(state => false);
            set_search_visibility(state => false);
            if (type === NavType.about) {
              set_search_text(i18n.about, i18n.about_content);
            } else if (type === NavType.help) {
              set_search_text(i18n.help, i18n.help_content);
            } else if (type === NavType.lab) {
              set_search_text(i18n.lab, i18n.lab_content);
            }
          }}
        />
      </div>
      <MusicWallDetail
        show={!!active_id}
        hideOnClick={() => set_active_id(state => 0)}
        moreOnClick={(keyword: string) => {
          search(keyword);
        }}
        data={data.filter(i => i.id === active_id)[0]}
      />
      <Search
        show={show_search}
        keyword={keyword}
        text={text}
        text_title={text_title}
      />
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
