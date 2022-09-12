import config from '../config';
import { random_audios } from './mock';
import { Result, Tab } from './types';

const { i18n, backend_domain, backend_port } = config;

export async function search(type: Tab, keyword: string, page: number): Promise<Result> {
  const res = await (
    await fetch(`${backend_domain}:${backend_port}/search`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        keyword,
        page,
      }),
    })
  ).json();

  return res;
}

export async function random(): Promise<Result> {
// return (await fetch(`${backend_domain}:${backend_port}/random`)).json();
  const res: Result = {
    code: 0,
    type: 'audio',
    videos: [],
    scores: [],
    audios: random_audios(),
  };
  return res;
}