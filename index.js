module.exports = {

  global: {
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
    },
    response: {
      error: {
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
        }
        generic: {
          msg: 'An unidentifiable error occured',
          suggestions: [
            'check stderr and the logs on the server for clues'
          ]
        }
      }
    }
  },

  build: {

    start: {
      description: 'Start building a Binder image from dependences in a repository',
      path: 'builds/',
      params: {
        repository: {
          type: String,
          description: 'the repository to build'
        }
      },
      msg: 'Starting Binder build for repository: {repository}',
      request: {
        method: 'POST',
        authorized: true,
        body: ['repository']
      },
      response: {
        body: {
          'image-name': String
        },
        error: {
          noDatabase: {
            status: 500,
            msg: 'Binder database not yet initialized',
            suggestions: [
              'ensure that the Binder mongo database is running and accessible to the build server'
            ]
          },
          badRepoSource: {
            status: 500,
            msg: 'Unsupported repo source',
            suggestions: [
              'host your binder on a supported repository source (GitHub)'
            ]
          }
        },
        success: {
          status: 200,
          msg: 'Build succesfully started for repository: {repository}'
        }
      }
    },

    statusOne: {
      path: 'builds/{image-name}',
      description: 'Get the status of a Binder build',
      params: {
        'image-name': {
          type: String,
          description: 'the name of the image'
        }
      },
      msg: 'Getting status of build for image: {image-name}',
      request: {
        method: 'GET',
        authorized: true
      },
      response: {
        body: {
          'image-name': String,
          'start-time': Date,
          'status': String,
          'phase': String,
          'repository': String
        },
        error: {
          noBuildInfo: {
            status: 500,
            msg: 'Could not get build information for requested image',
            suggestions: [
              'ensure that your build server is running and is accessible from this machine'
            ]
          },
          badQuery: {
            status: 500,
            msg: 'Could not query the Binder database for build information',
            suggestions: [
              'ensure that the database is running and is accessible to the build server'
            ]
          }
        },
        success: {
          status: 200,
          msg: 'Fetched build information for image: {image-name}'
        }
      }
    },

    statusAll: {
      path: 'builds/',
      description: 'Get the status of all Binder builds',
      msg: 'Getting status of all builds',
      request: {
        method: 'GET',
        authorized: true
      },
      response: {
        body: [ {
          'image-name': String,
          'start-time': Date,
          'status': String,
          'phase': String,
          'repository': String
        } ],
        error: {
          noBuildInfo: {
            status: 500,
            msg: 'Could not get build information for requested image',
            suggestions: [
              'ensure that your build server is running and is accessible from this machine'
            ]
          },
          badQuery: {
            status: 500,
            msg: 'Could not query the Binder database for build information',
            suggestions: [
              'ensure that the database is running and is accessible to the build server'
            ]
          }
        },
        success: {
          status: 200,
          msg: 'Fetched all build information'
        }
      }
    }
  },

  registry: {
    publish: {

    },
    fetch: {

    }
  },

  deploy: {
    deploy: {

    },
    status: {

    }
  }
}
