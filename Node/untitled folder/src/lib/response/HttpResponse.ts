import { ServerResponse } from 'http';

class HttpResponse {
  content: string;
  status: number;
  headers: Record<string, string>;

  constructor(content: string, status = 200, headers: Record<string, string> = {}) {
    this.content = content;
    this.status = status;
    this.headers = headers;
  }

  send(res: ServerResponse): void {
    res.writeHead(this.status, this.headers);
    res.end(this.content);
  }
}

export default HttpResponse;
