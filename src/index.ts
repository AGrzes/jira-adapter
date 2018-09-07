import axios from 'axios'
import { Ouch, override } from 'ouch-rx'
import * as PouchDB from 'pouchdb-http'
import { map } from 'rxjs/operators'
import { JiraClient } from './jira-source'
const jiraClient = new JiraClient(axios.create({
  baseURL: process.argv[2],
  auth: {
    username: process.argv[3],
    password: process.argv[4]
  }
}))

const db = new PouchDB(process.argv[5])
const ouch = new Ouch(db)
jiraClient.all().pipe(map((issue) => {
  issue._id = issue.key
  return issue
}), ouch.merge(override)).subscribe({complete() {
  //
}})
