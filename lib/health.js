module.exports = {
  status: {
    path: '/health/',
    description: 'Get the health of all Binder components',
    msg: 'Getting health of all Binder components',
    request: {
      method: 'GET',
      authorized: true
    },
    response: {
      body: [ {
        'name': String,
        'timestamp': Date,
        'status': String
      } ],
      error: {
        badQuery: {
          status: 500,
          msg: 'Could not query the Binder database for health information',
          suggestions: [
            'ensure that the database is running and is accessible to the health server'
          ]
        }
      },
      success: {
        status: 200,
        msg: '{results}'
      }
    }
  }
}
