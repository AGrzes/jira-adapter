
import axios, { AxiosInstance } from 'axios'
import {from, Observable, Observer, of} from 'rxjs'
import {flatMap} from 'rxjs/operators'
export class JiraClient {
  constructor(private client: AxiosInstance) {}

  public query(jql: string): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      let startAt = 0
      const nextPage = () => this.client.post('/rest/api/2/search', {
        jql, fields: ['*all'], maxResults: 50, startAt
      }).then((response) => {
        if (response.data.issues && response.data.issues.length) {
          response.data.issues.forEach((issue) => observer.next(issue))
          startAt = startAt + 50
          nextPage()
        } else {
          observer.complete()
        }
      })
      nextPage()
    })
  }

  public all(): Observable<any> {
    return this.query('')
  }
}
