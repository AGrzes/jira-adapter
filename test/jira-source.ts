import axios from 'axios'
import {expect} from 'chai'
import 'mocha'
import * as moxios from 'moxios'
import {toArray} from 'rxjs/operators'
import {JiraClient} from '../src/jira-source'

function responses(...requests: any[]) {
  requests.reverse()
  const wait = () => moxios.wait(() => {
      moxios.requests.mostRecent().respondWith(requests.pop())
      if (requests.length) {
        wait()
      }
    }, 1)
  wait()
}

describe('JiraClient', function() {
  beforeEach(function() {
    // import and pass your custom axios instance to this method
    moxios.install()
  })

  afterEach(function() {
    // import and pass your custom axios instance to this method
    moxios.uninstall()
  })
  describe('all', function() {
    const client = new JiraClient(axios)
    it('should call jira search', function() {
      responses({response: { }})
      return client.all().forEach(() => {
        const request = moxios.requests.get('POST', '/rest/api/2/search')
        expect(request).to.exist
      })
    })
    it('should send jql', function() {
      responses({response: { }})
      return client.all().forEach(() => {
        const request = moxios.requests.get('POST', '/rest/api/2/search')
        expect(JSON.parse(request.config.data)).to.have.property('jql').equals('')
      })
    })
    it('should send fields', function() {
      responses({response: { }})
      return client.all().forEach(() => {
        const request = moxios.requests.get('POST', '/rest/api/2/search')
        expect(JSON.parse(request.config.data)).to.have.property('fields').deep.equals(['*all'])
      })
    })
    it('should return issues', function(done) {
      responses({response: { issues: ['a', 'b', 'c']}}, {response: { }})
      client.all().pipe(toArray()).subscribe({
        next(result) {
          expect(result).to.deep.equals(['a', 'b', 'c'])
          done()
        }
      })
    })
    it('should combine pages', function(done) {
      responses({response: { issues: ['a', 'b']}}, {response: { issues: ['c']}}, {response: { }})
      client.all().pipe(toArray()).subscribe({
        next(result) {
          expect(result).to.deep.equals(['a', 'b', 'c'])
          done()
        }
      })
    })
  })
})
