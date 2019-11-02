require("../init")
import { graphqlHTTP } from '@jojo/graphql'
import express, { Router } from 'express'
import path from 'path'
import { useExpressServer } from 'routing-controllers'
import { Inject, Service } from 'typedi'
import { GraphqlService } from '../core/graphql/services/GraphqlService'

@Service()
export default class APIServer {

  @Inject() graphqlService: GraphqlService

  constructor(
  ) {
  }

  async run() {
    const app = express()
    const router = Router()
    useExpressServer(router, {
      controllers: [
        path.join(__dirname, '/controllers/**/*Controller.[tj]s'),
      ]
    })
    app.use('/rest', router)

    const schema = await this.graphqlService.getSchema()
    app.use(
      '/graphql',
      graphqlHTTP({
        schema,
        graphiql: process.env.NODE_ENV !== 'production',
      }),
    );

    app.listen(8970)
  }
}
