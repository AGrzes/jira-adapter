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
    it('should call jira search', function(done) {
      responses({response: { }})
      client.all().subscribe({complete() {
        const request = moxios.requests.get('POST', '/rest/api/2/search')
        expect(request).to.exist
        done()
      }, error: done})
    })
    it('should send jql', function(done) {
      responses({response: { }})
      client.all().subscribe({complete() {
        const request = moxios.requests.get('POST', '/rest/api/2/search')
        expect(JSON.parse(request.config.data)).to.have.property('jql').equals('')
        done()
      }, error: done})
    })
    it('should send fields', function(done) {
      responses({response: { }})
      client.all().subscribe({complete() {
        const request = moxios.requests.get('POST', '/rest/api/2/search')
        expect(JSON.parse(request.config.data)).to.have.property('fields').deep.equals(['*all'])
        done()
      }, error: done})
    })
    it('should send maxResults ', function(done) {
      responses({response: { }})
      client.all().subscribe({complete() {
        const request = moxios.requests.get('POST', '/rest/api/2/search')
        expect(JSON.parse(request.config.data)).to.have.property('maxResults').deep.equals(50)
        done()
      }, error: done})
    })
    it('should return issues', function(done) {
      responses({response: { issues: ['a', 'b', 'c']}}, {response: { }})
      client.all().pipe(toArray()).subscribe({
        next(result) {
          expect(result).to.deep.equals(['a', 'b', 'c'])
          done()
        }, error: done
      })
    })
    it('should combine pages', function(done) {
      responses({response: { issues: ['a', 'b']}}, {response: { issues: ['c']}}, {response: { }})
      client.all().pipe(toArray()).subscribe({
        next(result) {
          expect(result).to.deep.equals(['a', 'b', 'c'])
          done()
        }, error: done
      })
    })
    it('should increment startAt', function(done) {
      responses({response: { issues: ['a', 'b']}}, {response: { issues: ['c']}}, {response: { }})
      client.all().subscribe({
        complete() {
          expect(JSON.parse(moxios.requests.at(0).config.data)).to.have.property('startAt',0)
          expect(JSON.parse(moxios.requests.at(1).config.data)).to.have.property('startAt',50)
          expect(JSON.parse(moxios.requests.at(2).config.data)).to.have.property('startAt',100)
          done()
        }, error: done
      })
    })
  })
})
