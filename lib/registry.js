module.exports = {
  fetch: {
    path: '/templates/{template-name}',
    description: 'Fetch a template from the registry',
    params: {
      'template-name': {
        type: String,
        description: 'name of the template'
      }
    },
    msg: 'Fetching template from the registry',
    request: {
      method: 'GET',
      authorized: true
    },
    response: {
      error: {
        badDatabase: {
          status: 500,
          msg: 'Could not fetch template from the Binder database',
          suggestions: [
            'ensure that the database is running and is accessible to the registry server',
            'check the Binder Logstash logs for database errors'
          ]

        },
        doesNotExist: {
          status: 404,
          msg: 'The requested resource does not exist',
          suggestions: [
            'is the resource name spelled correctly?'
          ]
        }
      },
      success: {
        status: 200,
        msg: '{results}'
      }
    }
  },

  fetchAll: {
    path: '/templates/',
    description: 'Fetch all templates from the registry',
    msg: 'Fetching all templates from the registry',
    request: {
      method: 'GET',
      authorized: true
    },
    response: {
      error: {
        badDatabase: {
          status: 500,
          msg: 'Could not fetch template from the Binder database',
          suggestions: [
            'ensure that the database is running and is accessible to the registry server',
            'check the Binder Logstash logs for database errors'
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

