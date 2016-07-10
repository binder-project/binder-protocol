module.exports = {
  start: {
    description: 'Start building a Binder image from dependences in a repository',
    path: '/builds/',
    params: {
      repository: {
        type: String,
        description: 'the repository to build'
      },
      force: {
        type: Boolean,
        description: 'force a rebuild if the repository is already building',
        required: false
      }
    },
    msg: 'Starting Binder build for repository: {repository}',
    request: {
      method: 'POST',
      authorized: true,
      body: ['repository', 'force']
    },
    response: {
      body: {
        'name': String
      },
      error: {
        noDatabase: {
          status: 500,
          msg: 'Binder database not yet initialized',
          suggestions: [
            'ensure that the Binder mongo database is running and accessible to the build server'
          ]
        },
        badQuery: {
          status: 500,
          msg: 'Could not query the Binder database for build information',
          suggestions: [
            'ensure that the database is running and is accessible to the build server'
          ]
        },
        badRepoSource: {
          status: 500,
          msg: 'Unsupported repo source',
          suggestions: [
            'host your binder on a supported repository source (GitHub)'
          ]
        },
        alreadyBuilding: {
          status: 500,
          msg: 'Already building the image',
          suggestions: [
            'wait until the current build has completed before trying again'
          ]
        }
      },
      success: {
        status: 200,
        msg: 'Build succesfully started for repository: {repository}\n {results}'
      }
    }
  },

  status: {
    path: '/builds/{image-name}',
    description: 'Get the status of a Binder build',
    params: {
      'image-name': {
        type: String,
        description: 'the name of the image'
      }
    },
    msg: 'Getting status of build for image: {image-name}',
    request: {
      method: 'GET'
    },
    response: {
      body: {
        'name': String,
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
        msg: '{results}'
      }
    }
  },

  statusAll: {
    path: '/builds/',
    description: 'Get the status of all Binder builds',
    msg: 'Getting status of all builds',
    request: {
      method: 'GET',
      authorized: true
    },
    response: {
      body: [ {
        'name': String,
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
        msg: '{results}'
      }
    }
  }
}
