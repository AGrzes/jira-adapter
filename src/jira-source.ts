
import axios, { AxiosInstance } from 'axios'
import {from, Observable, of} from 'rxjs'
import {flatMap} from 'rxjs/operators'
export class JiraClient {
  constructor(private client: AxiosInstance) {}

  public all(): Observable<any> {
    return from(this.client.post('/rest/api/2/search', {jql: '', fields: ['*all']}))
      .pipe(flatMap((response) => of(...(response.data.issues || []))))
  }
}
