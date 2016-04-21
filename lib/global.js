module.exports = {
  params: {
    'api-key': {
      type: String,
      description: 'API key for making authenticated requests to a Binder server'
    },
    'host': {
      type: String,
      description: 'Binder server host'
    },
    'port': {
      type: Number,
      description: 'Binder server port'
    }
  },
  response: {
    error: {
      unauthorized: {
        status: 403,
        msg: 'Unauthorized request',
        suggestions: [
          'make sure to include a valid API token with any privileged requests'
        ]
      },
      malformedRequest: {
        status: 422,
        msg: 'Request does not contain the required parameters for this endpoint: {name}',
        suggestions: [
          'add the required parameter to the request'
        ]
      },
      badResponse: {
        status: 500,
        msg: 'Server response is missing a required field: {name}',
        suggestions: [
          'this is the product of a bug in the server'
        ]
      },
      timeout: {
        msg: 'Request to {host}:{port} timed out',
        suggestions: [
          'ensure that the above server is running and is accessible from this machine'
        ]
      },
      refused: {
        msg: 'Could not connect to the server at {host}:{port}',
        suggestions: [
          'ensure that the above server is running and is accessible from this machine'
        ]
      },
      generic: {
        msg: 'An unidentifiable error occured: {error}',
        suggestions: [
          'check stderr and the logs on the server for clues'
        ]
      }
    }
  }
}
