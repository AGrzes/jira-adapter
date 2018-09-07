import axios from 'axios'
import {expect} from 'chai'
import 'mocha'
import * as moxios from 'moxios'
import {JiraClient} from '../src/jira-source'

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
      moxios.stubRequest('/rest/api/2/search', {response:{}})
      return client.all().forEach(() => {
        const request = moxios.requests.get('POST', '/rest/api/2/search')
        expect(request).to.exist
      })
    })
    it('should send jql', function() {
      moxios.stubRequest('/rest/api/2/search', {response:{}})
      return client.all().forEach(() => {
        const request = moxios.requests.get('POST', '/rest/api/2/search')
        expect(JSON.parse(request.config.data)).to.have.property('jql').equals('')
      })
    })
    it('should send fields', function() {
      moxios.stubRequest('/rest/api/2/search', {response:{}})
      return client.all().forEach(() => {
        const request = moxios.requests.get('POST', '/rest/api/2/search')
        expect(JSON.parse(request.config.data)).to.have.property('fields').deep.equals(['*all'])
      })
    })
  })
})
