
import axios, { AxiosInstance } from 'axios'
import {from, Observable, Observer, of} from 'rxjs'
import {flatMap} from 'rxjs/operators'
export class JiraClient {
  constructor(private client: AxiosInstance) {}

  public all(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      const nextPage = () => this.client.post('/rest/api/2/search', {jql: '', fields: ['*all']}).then((response) => {
        if (response.data.issues) {
          response.data.issues.forEach((issue) => observer.next(issue))
          nextPage()
        } else {
          observer.complete()
        }
      })
      nextPage()
    })
  }
}
