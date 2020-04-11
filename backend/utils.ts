import * as request from 'request';

export async function request_get(url: string) {
  return new Promise<string>((resolve, reject) => {
    request.get(url, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}

export async function request_post(url: string, form: Object) {
  return new Promise<string>((resolve, reject) => {
    request.post({ url, form }, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}

export function unicode_to_chr(str: string) {
  return unescape(str.replace(/\\u/gi, '%u'));
}
