module.exports = {
  deploy: {
    path: '/applications/{template-name}',
    description: 'Deploy an instance of a template onto a Binder backend',
    params: {
      'template-name': {
        type: String,
        description: 'name of the template to deploy'
      }
      'cull-timeout': {
        type: Number,
        description: 'inactive period after which app will be culled',
        required: false
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
        registryError: {
          status: 500,
          msg: 'Could not fetch the template to preload from the registry',
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

