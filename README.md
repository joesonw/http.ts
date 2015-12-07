# Pre requirements
    ** typescript 1.7.3+
    ** Node v4.0 +




# Components Hierarchy

Server is a instance of `App`, where requests, routes and responses are handled.





# Core Api

## Decorators
> Decorators are meant to decorate route handles.

### util.Route

#### util.Route.Method(util.HttpMethod)
> On **Sub-Handlers** only, states the method this **Sub-Handler** handles

#### util.Route.Path(string)
> On `entity.RouteHandler` only, specifies the main path

#### util.Route.SubPath(string)
> On **Sub-Handlers** only, specifies the sub path

#### util.Route.PreFilter(processor.PreProcessor)
> On **Sub-Handlers** only, add one `processor.PreProcessor` to the processing stack (before passing to the **Sub-Handler**).

#### util.Route.PostFilter(processor.PostProcessor)
> On **Sub-Handlers** only, add one `processor.PostProcessor` to the processing stack (after processing of  the **Sub-Handler**).

#### util.Route.PathParam(string)
> On **Sub-Handler-Paramters** only, match the specified key in path pattern to this parameter (see example above).

#### util.Route.QueryParam(string)
> On **Sub-Handler-Paramters** only, match the specified key in query pattern to this parameter (see example above).

#### util.Route.Produce(util.ContentType)
> On **Sub-Handlers** only, specifies the content-type of the response.

#### util.Route.QueryFilter(class util.Filter)
> On **Sub-Handlers** only, specifies the validation rules of the query.
> (*__it takes the class instead of the instance__*)
