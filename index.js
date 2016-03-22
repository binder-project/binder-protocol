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
  },

  build: {

    start: {
      description: 'Start building a Binder image from dependences in a repository',
      path: '/builds/',
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
        method: 'GET',
        authorized: true
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
  },

  registry: {

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

  },

  deploy: {

    deploy: {
      path: '/applications/{template-name}',
      description: 'Deploy an instance of a template onto a Binder backend',
      params: {
        'template-name': {
          type: String,
          description: 'name of the template to deploy'
        }
      },
      msg: 'Deploying {template-name} onto a Binder backend',
      request: {
        method: 'POST',
        authorized: false
      },
      response: {
        body: {
          id: String
        },
        error: {
          registryError: {
            status: 500,
            msg: 'Could not fetch template with name {template-name} from registry',
            suggestions: [
              'make sure the deployment server is not in testing mode (will fetch templates locally)',
              'check if the registry has access to the Binder database'
            ]
          },
          badDatabase: {
            status: 500,
            msg: 'Could not write deployment metadata to the Binder database',
            suggestions: [
              'ensure that the database is accessible to the deploy server',
              'check the Binder Logstash logs for database-oriented messages'
            ]
          }
        },
        success: {
          status: 200,
          msg: '{results}'
        }
      }
    },

    status: {
      path: '/applications/{template-name}/{id}',
      description: 'Get information associated with a single deployment',
      params: {
        'template-name': {
          type: String,
          description: 'the deployment\'s template name'
        },
        'id': {
          type: String,
          description: 'the deployment\'s ID'
        }
      },
      msg: 'Getting information about the single deployment {template-name} - {id}',
      request: {
        method: 'GET',
        authorized: false
      },
      response: {
        body: {
          id: String,
          location: String
        },
        error: {
          badDatabase: {
            status: 500,
            msg: 'Querying the database for the deployment record failed',
            suggestions: [
              'ensure that the database is accessible to the deploy server',
              'check the Binder Logstash logs for database-oriented messages'
            ]
          },
          noRecord: {
            status: 500,
            msg: 'There is no record for that template/ID combination',
            suggestions: [
              'make sure that the template/ID are spelled correctly',
              'check if the ID was returned in a previous deployment call'
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
      path: '/applications/{template-name}',
      params: {
        'template-name': {
          type: String,
          description: 'name of the template with existing deployments',
          required: false
        }
      },
      description: 'Get information associated with all deployment for a given template',
      msg: 'Getting information about all deployments for {template-name}',
      request: {
        method: 'GET',
        authorized: true
      },
      response: {
        body: [{
          id: String,
          location: String
        }],
        error: {
          badDatabase: {
            status: 500,
            msg: 'Querying the database for all deployments failed',
            suggestions: [
              'ensure that the database is accessible to the deploy server',
              'check the Binder Logstash logs for database-oriented messages'
            ]
          }
        },
        success: {
          status: 200,
          msg: '{results}'
        }
      }
    },

    _preload: {
      path: '/preload/{template-name}',
      params: {
        'template-name': {
          type: String,
          description: 'name of the template to preload onto the cluster',
          required: true
        }
      },
      description: 'Preload a template onto all nodes of the cluster',
      msg: 'Preloading {template-name} onto all nodes of the cluster',
      request: {
        method: 'POST',
        authorized: true
      },
      response: {
        error: {
          badDatabase: {
            status: 500,
            msg: 'Saving the preloading apps to the database failed',
            suggestions: [
              'ensure that the database is accessible to the deploy server',
              'check the Binder Logstash logs for database-oriented messages'
            ]
          },
          badKubeRequest: {
            status: 500,
            msg: 'Getting the node list from Kubernetes failed',
            suggestions: [
              'ensure that the deployment server can communicate with the Kubernetes cluster'
            ]
          },
          unknownFailure: {
            status: 500,
            msg: 'Preloading failed for unknown reasons',
            suggestions: [
              'check the Binder Logstash logs for Kubernetes errors'
            ]
          }
        },
        success: {
          status: 200,
          msg: '{results}'
        }
      }
    },

    _preloadStatus: {
      path: '/preload/{template-name}',
      params: {
        'template-name': {
          type: String,
          description: 'name of the preloading template',
          required: true
        }
      },
      description: 'Check the preloading status of a template',
      msg: 'Checking preloading status of {template-name}',
      request: {
        method: 'GET',
        authorized: true
      },
      response: {
        error: {
          badDatabase: {
            status: 500,
            msg: 'Checking the preloading status failed due to a database error',
            suggestions: [
              'ensure that the database is accessible to the deploy server'
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
}
