## :dash: :dash: **The Binder Project is moving to a [new repo](https://github.com/jupyterhub/binderhub).** :dash: :dash:

:books: Same functionality. Better performance for you. :books:

Over the past few months, we've been improving Binder's architecture and infrastructure. We're retiring this repo as it will no longer be actively developed. Future development will occur under the [JupyterHub](https://github.com/jupyterhub/) organization.

* All development of the Binder technology will occur in the [binderhub repo](https://github.com/jupyterhub/binderhub)
* Documentation for *users* will occur in the [jupyterhub binder repo](https://github.com/jupyterhub/binder) 
* All conversations and chat for users will occur in the [jupyterhub binder gitter channel](https://gitter.im/jupyterhub/binder)

Thanks for updating your bookmarked links.

## :dash: :dash: **The Binder Project is moving to a [new repo](https://github.com/jupyterhub/binderhub).** :dash: :dash:

---

# binder-protocol
A declarative specification of the Binder API that ensures consistency between BinderModules and the client module

Used by [`binder-client`](http://github.com/binder-project/binder-client) to auto-generate the client and CLI interfaces

### install
```
npm install binder-protocol
```

### usage

The protocol declaration is a single JS object, where each bottom-level key represents a Binder API endpoint and the value is a [schema](###schema) object. The endpoints currently defined are (see the [API description](https://github.com/binder-project/binder-docs/blob/master/markdown/api-docs.md) for more detail): 
* build
  * start - start a build
  * status - query the status of a single build
  * statusAll - query the status of all builds
* registry
  * fetch - get a single template
  * fetchAll - get all registered templates
* deploy
  * deploy - launch an instance of a template on the deploy backend
  * status - get the status of a single deployment matching a template/id combo
  * statusAll - get the status of all deployments for a given template

### schema

Each endpoint is defined by the following properties:
 1. `path` string - templated string describing the pathname and any request parameters
 2. `params` object - keys for every request parameter and values describing that parameter's properties:
  1. `type` string - request parameter type
  2. `description` string - request parameter description
  3. `required` boolean - is this parameter required? 
 3. `description` string - description of the endpoint
 4. `msg` string - message that should be displayed when the endpoint request is sent
 5. `request` object - keys for all properties of the HTTP request
  1. `method` string - HTTP method
  2. `authorized` boolean - if the endpoint requires an API token
  3. `body` object - HTTP post body
 6. `response` object - contains a description of the possible response body and error/success handling info
  1. `body` object - response body type description
  2. `error` object - names and handlers for all possible errors that the endpoint can generate (keyed by error name)
   1. `status` number - HTTP response code for the error
   2. `msg` string - description of the error that occurred
   3. `suggestions` [string] - possible fixes for the error
  3. `success` object - handler for the single success outcome that the endpoint can generate

### examples

Here's a simple example from the `deploy` API, but see [`index.js`](index.js) for many more examples.

```
deploy: {
    ...
    
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
    }
  }
```
