import { AxiosResponse } from "axios";

export function download(res: AxiosResponse) {
  const blob = new Blob([res.data], { type: res.headers["content-type"] });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = res.headers['content-disposition'].match(/filename="(.+)"/)[1];
  a.click();
  URL.revokeObjectURL(url);
}