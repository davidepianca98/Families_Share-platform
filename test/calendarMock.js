const mock = require('mock-require')

class MockCalendar {
  id
  events = []
  lastId = 0

  constructor (id) {
    this.id = id
  }

  insert(event) {
    event.id = this.lastId
    this.events[this.lastId] = event
    return this.lastId++
  }

  getEvents() {
    return this.events.filter(event => event != null)
  }

  getEvent(id) {
    return this.events[id]
  }

  updateEvent(id, resource) {
    this.events[id] = {...this.events[id], ...resource}
  }

  deleteEvent(id) {
    this.events[id] = null
  }
}

class MockGoogleCalendar {
  calendars = []
  lastId = 0

  insert() {
    let c = new MockCalendar(this.lastId)
    this.calendars[this.lastId] = c
    return this.lastId++
  }

  delete(id) {
    this.calendars[id] = null;
  }

  get(id) {
    return this.calendars[id];
  }
}

let mockCalendar = new MockGoogleCalendar()

const { google } = require('googleapis')

mock('googleapis', {
  google: {
    auth: google.auth,
    calendar: () => ({
      calendars: {
        insert: () => {
          let id = mockCalendar.insert()
          return Promise.resolve({
            data: {
              id: id
            }
          })
        },
        delete: ({calendarId}) => {
          mockCalendar.delete(calendarId)
          return Promise.resolve({
            data: {
              id: calendarId
            }
          })
        }
      },
      events: {
        insert: ({calendarId, resource}) => {
          let id = mockCalendar.get(calendarId).insert(resource)
          return Promise.resolve({
            data: {
              id: id
            }
          })
        },
        list: (req) => {
          calendarId = req.calendarId
          maxResults = req.maxResults
          pageToken = req.pageToken
          sharedExtendedProperty = req.sharedExtendedProperty
          let events = mockCalendar.get(calendarId).getEvents()
          return Promise.resolve({
            data: {
              items: events
            }
          })
        },
        get: ({calendarId, eventId}) => {
          let event = mockCalendar.get(calendarId).getEvent(eventId)
          return Promise.resolve({
            data: event
          })
        },
        patch: ({calendarId, eventId, resource}) => {
          mockCalendar.get(calendarId).updateEvent(eventId, resource)
          return Promise.resolve({
            data: {
              id: eventId
            }
          })
        },
        delete: ({eventId, calendarId}) => {
          mockCalendar.get(calendarId).deleteEvent(eventId)
          return Promise.resolve({
            data: {
              id: eventId
            }
          })
        }
      }
    })
  }
})
