
import axios, { AxiosInstance } from 'axios'
import {from, Observable} from 'rxjs'
export class JiraClient {
  constructor(private client: AxiosInstance) {}

  public all(): Observable<any> {
    return from(this.client.post('/rest/api/2/search', {jql: ''}).then((response) => response.data))
  }
}
